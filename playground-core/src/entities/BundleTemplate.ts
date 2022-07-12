import {
  Entity,
  registerGUID,
  type Resource,
  type GUID,
} from '../framework';

export type BundleTemplateID = GUID<'BundleTemplate'>;
export const BundleTemplateID = registerGUID<BundleTemplateID>();

export class BundleTemplate
  extends Entity<BundleTemplateID>
  implements Resource
{
  typename = 'BundleTemplate' as const;

  static centeringDiv() {
    const templateId = BundleTemplateID('__CENTERING_DIV');
    return new BundleTemplate(templateId);
  }
}
