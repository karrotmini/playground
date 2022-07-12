import {
  type BundleTemplate,
  type BundleUpload,
} from '../entities';

export type Bundle = BundleTemplate | BundleUpload;
export type BundleID = Bundle['id'];
