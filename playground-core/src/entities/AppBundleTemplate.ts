import {
  Entity,
  registerGUID,
  type GUID,
} from '../framework';

export type AppBundleTemplateID = GUID<'AppBundleTemplate'>;
export const AppBundleTemplateID = registerGUID<AppBundleTemplateID>();

export class AppBundleTemplate extends Entity<AppBundleTemplateID> {
  static centeringDiv() {
    const templateId = AppBundleTemplateID('__CENTERING_DIV');
    return new AppBundleTemplate(templateId);
  }
}
