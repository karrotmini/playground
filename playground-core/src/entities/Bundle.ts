import {
  type BundleTemplate,
  type BundleTemplateID,
  type BundleUpload,
  type BundleUploadID,
} from '../entities';

export type Bundle = BundleTemplate | BundleUpload;
export type BundleID = Bundle['id'];

export type BundleRef = (
  | {
    type: 'template',
    id: BundleTemplateID,
  }
  | {
    type: 'upload',
    id: BundleUploadID,
  }
);
