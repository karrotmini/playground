use worker::*;

mod utils;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    utils::set_panic_hook();

    let router = Router::new();

    router
        .post_async("/bundle/:id/upload", |mut req, ctx| async move {
            if let Some(id) = ctx.param("id") {
                let storage = ctx.kv("KV_BUNDLE_STORAGE")?;
                let form = req.form_data().await?;
                if let Some(FormEntry::File(file)) = form.get("content") {
                    // TODO: validate package
                    let key = "bundle:".to_string() + id;
                    let bytes = file.bytes().await?;
                    storage.put_bytes(key.as_str(), bytes.as_slice())?;
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
