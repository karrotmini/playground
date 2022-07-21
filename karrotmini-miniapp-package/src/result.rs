use std::error::Error;
use std::fmt;
use std::io;

use karrotmini_miniapp_manifest::v1::error::ManifestError;
use zip::result::ZipError;

pub type PackageResult<T> = Result<T, PackageError>;

#[derive(Debug)]
pub enum PackageError {
    InvalidPackage(Box<dyn Error + Send + Sync + 'static>),
    InvalidManifest(ManifestError),
}

impl fmt::Display for PackageError {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            PackageError::InvalidPackage(_) => write!(fmt, "invalid package format"),
            PackageError::InvalidManifest(_) => write!(fmt, "invalid manifest format"),
        }
    }
}

impl Error for PackageError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}

impl From<PackageError> for io::Error {
    fn from(err: PackageError) -> io::Error {
        io::Error::new(io::ErrorKind::Other, err)
    }
}

impl From<ZipError> for PackageError {
    fn from(err: ZipError) -> Self {
        PackageError::InvalidPackage(Box::new(err))
    }
}

impl From<ManifestError> for PackageError {
    fn from(err: ManifestError) -> Self {
        PackageError::InvalidManifest(err)
    }
}
