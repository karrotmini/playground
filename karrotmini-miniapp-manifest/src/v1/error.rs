#[derive(Debug)]
pub enum ManifestError {
    ParseJsonError(serde_json::Error),
}

impl From<serde_json::Error> for ManifestError {
    fn from(err: serde_json::Error) -> Self {
        ManifestError::ParseJsonError(err)
    }
}
