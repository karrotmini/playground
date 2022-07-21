use std::io::{Cursor, Read};

use karrotmini_miniapp_manifest::v1::manifest::{self, Manifest};
use zip::ZipArchive;

use crate::result::{PackageResult, PackageError};

pub type Error = PackageError;
pub type Result<T> = PackageResult<T>;

#[derive(Debug)]
pub struct Package {
    pub manifest: Option<Manifest>,
    // FIXME: do it more generic way
    inner: ZipArchive<Cursor<Vec<u8>>>,
}

impl Package {
    pub fn from_bytes(bytes: Vec<u8>) -> Result<Self> {
        let mut archive = ZipArchive::new(Cursor::new(bytes))?;
        let mut buf: Vec<u8> = Vec::new();

        let _ = archive.by_name(manifest::MANIFEST_FILENAME).map(|mut file| {
            file.read_to_end(&mut buf).unwrap();
        });

        let manifest = match buf.is_empty() {
            true => None,
            false => Some(Manifest::try_from(buf)?),
        };

        Ok(Self {
            manifest,
            inner: archive,
        })
    }

    pub fn read_path(&mut self, path: &str) -> Option<Vec<u8>> {
        let name = &path[1..path.len()];
        match self.inner.by_name(name) {
            Ok(mut file) => {
                let mut buf: Vec<u8> = Vec::new();
                file.read_to_end(&mut buf).unwrap();
                Some(buf)
            },
            Err(..) => None,
        }
    }
}

impl<'a> TryFrom<&'a [u8]> for Package {
    type Error = Error;

    fn try_from(bytes: &'a [u8]) -> Result<Self> {
        Package::from_bytes(Vec::from(bytes))
    }
}

#[cfg(test)]
mod test {
    #[test]
    fn extract_valid_manifest() {
        use super::Package;

        let mut v = Vec::new();
        v.extend_from_slice(include_bytes!("../tests/data/valid_manifest.zip"));

        let package = Package::from_bytes(v);
        assert!(package.is_ok());

        let manifest = package.unwrap().manifest;
        assert!(manifest.is_some());
    }

    #[test]
    fn extract_no_manifest() {
        use super::Package;

        let mut v = Vec::new();
        v.extend_from_slice(include_bytes!("../tests/data/no_manifest.zip"));

        let package = Package::from_bytes(v);
        assert!(package.is_ok());

        let manifest = package.unwrap().manifest;
        assert!(manifest.is_none());
    }

    #[test]
    fn invalid_manifest() {
        use super::Package;

        let mut v = Vec::new();
        v.extend_from_slice(include_bytes!("../tests/data/invalid_manifest.zip"));

        let package = Package::from_bytes(v);
        assert!(package.is_err());
    }

    #[test]
    fn invalid_bytes() {
        use super::Package;

        let empty_bytes: Vec<u8> = Vec::new();
        let package = Package::from_bytes(empty_bytes);
        assert!(package.is_err())
    }
}
