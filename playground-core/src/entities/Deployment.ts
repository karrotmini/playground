import {
  type BundleRef,
  type CustomHostID,
} from '../entities';

export type DeploymentRef = {
  name: string,
  bundle: BundleRef,
  customHostId: CustomHostID,
  deployedAt: number,
};
