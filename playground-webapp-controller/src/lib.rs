use std::io::{Cursor, Read, Seek};

use worker::{*, kv::KvStore};
use zip::read::ZipArchive;

mod utils;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or("unknown region".into())
    );
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    log_request(&req);

    // Optionally, get more helpful error messages written to the console in the case of a panic.
    utils::set_panic_hook();
    
    let url = req.url()?;
    let hostname = url.host_str().unwrap();
    let kv = KvStore::from_this(&env, "APP_BUNDLE_STORE")?;

    if let Some(index) = kv.get(hostname).text().await? {
        if let Some(bytes) = kv.get(index.as_str()).bytes().await? {
            let cursor = Cursor::new(bytes);
            let mut archive = ZipArchive::new(cursor).unwrap();

            let path = url.path();
            let path = match &path[1..path.len()] {
                "" => "index.html",
                path => path,
            };
            if let Some(response) = read_archive(&mut archive, path) {
                return Ok(response);
            }
        }
    }

    Response::error("Not found", 404)
}

fn read_archive<R: Read + Seek>(archive: &mut ZipArchive<R>, path: &str) -> Option<Response> {
    match archive.by_name(path).map(|mut file| {
        let mime = mime_guess::from_path(path)
            .first()
            .unwrap_or(mime::APPLICATION_OCTET_STREAM);

        let mut headers = Headers::new();
        headers.append("Content-Type", mime.to_string().as_str()).unwrap();

        let mut buf: Vec<u8> = Vec::new();
        file.read_to_end(&mut buf).unwrap();

        Response::from_bytes(buf)
            .map(|resp| resp.with_headers(headers))
            .unwrap()
    }) {
        Ok(response) => Some(response),
        Err(..) => None,
    }
}
