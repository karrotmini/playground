use karrotmini_miniapp_manifest::v1::manifest::Manifest;
use karrotmini_miniapp_package::package::Package;
use serde::{Serialize, Deserialize};
use worker::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseBody {
    manifest: Option<Manifest>,
}

pub async fn post(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let storage = ctx.kv("KV_BUNDLE_STORAGE")?;
    if let Some(id) = ctx.param("id") {
        let form = req.form_data().await?;
        if let Some(FormEntry::File(file)) = form.get("content") {
            console_log!("{} {}", file.name(), file.type_());
            let key = "bundle:".to_string() + id;
            let bytes = file.bytes().await?;
            return match Package::from_bytes(bytes.clone()) {
                Ok(package) => {
                    storage.put_bytes(key.as_str(), bytes.as_slice())?.execute().await?;
                    let body = ResponseBody {
                        manifest: package.manifest,
                    };
                    Response::from_json(&body)
                },
                Err(err) => {
                    Response::error(err.to_string(), 400)
                },
            };
        }
    }
    Response::error("Bad Request", 400)
}
