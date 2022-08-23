use std::str::FromStr;
use serde::{Serialize, Deserialize};

use crate::v1::error::ManifestError;

#[derive(Debug, Eq, PartialEq, Serialize, Deserialize)]
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

impl TryFrom<String> for Manifest {
    type Error = ManifestError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Manifest::from_str(value.as_str())
    }
}

impl TryFrom<Vec<u8>> for Manifest {
    type Error = ManifestError;

    fn try_from(value: Vec<u8>) -> Result<Self, Self::Error> {
        let manifest = serde_json::from_slice(value.as_slice())?;
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
fn v1_invalid_manifest_missing_app_id() {
    let json = r#"
      {
        "name": "My First App"
      }
    "#;

    let manifest = Manifest::from_str(&json);
    assert!(manifest.is_err());
}

#[test]
fn v1_invalid_manifest_missing_name() {
    let json = r#"
      {
        "app_id": "test"
      }
    "#;

    let manifest = Manifest::from_str(&json);
    assert!(manifest.is_err());
}
