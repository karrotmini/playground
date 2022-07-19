import {
  Entity,
  registerGUID,
  type GUID,
} from '../framework';

export type BundleTemplateID = GUID<'BundleTemplate'>;
export const BundleTemplateID = registerGUID<BundleTemplateID>();

export class BundleTemplate
  extends Entity<BundleTemplateID>
{
  readonly typename = 'BundleTemplate' as const;

  static centeringDiv() {
    const templateId = BundleTemplateID('__CENTERING_DIV');
    return new BundleTemplate(templateId);
  }
}
