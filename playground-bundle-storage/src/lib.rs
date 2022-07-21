use karrotmini_miniapp_package::package::Package;
use serde_json::json;
use worker::*;

mod utils;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    utils::set_panic_hook();

    Router::new()
        .get_async("/bundle/:id/manifest", |_req, ctx| async move {
            if let Some(id) = ctx.param("id") {
                let storage = ctx.kv("KV_BUNDLE_STORAGE").unwrap();
                let key = "bundle:".to_string() + id;
                let content = storage.get(key.as_str()).bytes().await.unwrap();
                let response = match content {
                    None => {
                        Response::error("Bundle not found", 404)
                    }
                    Some(bytes) => {
                        match Package::from_bytes(bytes) {
                            Ok(Package { manifest: Some(manifest), .. }) => {
                                Response::from_json(&manifest)
                            },
                            Ok(_) => {
                                Response::from_json(&json!(null))
                            },
                            Err(err) => {
                                Response::error(err.to_string(), 500)
                            },
                        }
                    }
                };
                return response;
            }
            Response::error("Bad Request", 400)
        })
        .post_async("/bundle/:id/upload", |mut req, ctx| async move {
            if let Some(id) = ctx.param("id") {
                let storage = ctx.kv("KV_BUNDLE_STORAGE")?;
                let form = req.form_data().await?;
                if let Some(FormEntry::File(file)) = form.get("content") {
                    let key = "bundle:".to_string() + id;
                    let bytes = file.bytes().await?;
                    return match Package::from_bytes(bytes.clone()) {
                        Ok(_) => {
                            storage.put_bytes(key.as_str(), bytes.as_slice())?.execute().await?;
                            Response::ok("")
                        },
                        Err(err) => {
                           Response::error(err.to_string(), 400)
                        }
                    }
                }
            }
            Response::error("Bad Request", 400)
        })
        .post_async("/bundle/:id/connect_hostname", |mut req, ctx| async move {
            if let Some(id) = ctx.param("id") {
                let storage = ctx.kv("KV_BUNDLE_STORAGE")?;
                let form = req.form_data().await?;
                if let Some(FormEntry::Field(hostname)) = form.get("hostname") {
                    let key = "hostname:".to_string() + hostname.as_str();
                    storage.put(key.as_str(), id.as_str())?;
                }
            }
            Response::error("Bad Request", 400)
        })
        .run(req, env).await
}
