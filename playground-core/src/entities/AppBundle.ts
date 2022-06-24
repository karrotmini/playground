import {
  type AppBundleTemplate,
  type AppBundleUpload,
} from '../entities';

export type AppBundle = AppBundleTemplate | AppBundleUpload;
export type AppBundleID = AppBundle['id'];
