import {
  type BundleTemplate,
  type BundleTemplateID,
  type BundleUpload,
  type BundleUploadID,
} from '../entities';

export type { BundleRef } from './_snapshots';

export type Bundle = BundleTemplate | BundleUpload;
export type BundleID = Bundle['id'];
