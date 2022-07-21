use karrotmini_miniapp_package::package::Package;
use serde_json::json;
use worker::*;

mod utils;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    utils::set_panic_hook();

    Router::new()
        .get_async("/bundle/:id/manifest", get_bundle_manifest)
        .post_async("/bundle/:id/upload", upload_bundle_content)
        .post_async("/bundle/:id/connect_hostname", connect_bundle_hostname)
        .run(req, env).await
}

async fn get_bundle_manifest(mut _req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let storage = ctx.kv("KV_BUNDLE_STORAGE")?;
    if let Some(id) = ctx.param("id") {
        let key = "bundle:".to_string() + id;
        let content = storage.get(key.as_str()).bytes().await?;
        return match content {
            Some(bytes) => match Package::from_bytes(bytes) {
                Ok(Package { manifest: Some(manifest), .. }) => {
                    Response::from_json(&manifest)
                },
                Ok(_) => {
                    Response::from_json(&json!(null))
                },
                Err(err) => {
                    Response::error(err.to_string(), 500)
                },
            },
            None => Response::error("Bundle not found", 404),
        };
    }
    Response::error("Bad Request", 400)
}

async fn upload_bundle_content(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let storage = ctx.kv("KV_BUNDLE_STORAGE")?;
    if let Some(id) = ctx.param("id") {
        let form = req.form_data().await?;
        if let Some(FormEntry::File(file)) = form.get("content") {
            console_log!("{} {}", file.name(), file.type_());
            let key = "bundle:".to_string() + id;
            let bytes = file.bytes().await?;
            return match Package::from_bytes(bytes.clone()) {
                Ok(_) => {
                    storage.put_bytes(key.as_str(), bytes.as_slice())?.execute().await?;
                    Response::empty()
                },
                Err(err) => {
                    Response::error(err.to_string(), 400)
                },
            };
        }
    }
    Response::error("Bad Request", 400)
}

async fn connect_bundle_hostname(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let storage = ctx.kv("KV_BUNDLE_STORAGE")?;
    if let Some(id) = ctx.param("id") {
        let form = req.form_data().await?;
        return match form.get("hostname") {
            Some(FormEntry::Field(hostname)) => {
                let key = "hostname:".to_string() + hostname.as_str();
                storage.put(key.as_str(), id.as_str())?.execute().await?;
                Response::empty()
            },
            Some(_) => {
                Response::error("\"hostname\" must be a string", 404)
            },
            None => {
                Response::error("\"hostname\" is required", 404)
            },
        };
    }
    Response::error("Bad Request", 400)
}

