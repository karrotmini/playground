use std::str::FromStr;
use serde::{Serialize, Deserialize};

use crate::v1::error::ManifestError;

#[derive(Debug, Serialize, Deserialize)]
pub struct Manifest {
    pub app_id: String,
    pub name: String,
}

impl FromStr for Manifest {
    type Err = ManifestError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let manifest: Self = serde_json::from_str(s)?;
        Ok(manifest)
    }
}

#[test]
fn v1_manifest_full() {
    let json = r#"
      {
        "app_id": "test-app-id",
        "name": "My First App"
      }
    "#;

    let manifest = Manifest::from_str(&json);
    assert!(manifest.is_ok());
}

#[test]
fn v1_manifest_missing_app_id() {
    let json = r#"
      {
        "name": "My First App"
      }
    "#;

    let manifest = Manifest::from_str(&json);
    assert!(manifest.is_err());
}

