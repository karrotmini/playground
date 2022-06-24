import {
  Aggregate,
  registerGUID,
  registerSnapshot,
  type GUID,
  type Snapshot,
  type Resource,
} from '../framework';
import {
  type UserProfileCreatedEvent,
  type UserProfileUpdatedEvent,
  type UserAppAddedEvent,
} from '../events';
import {
  type AppID,
} from '../entities';

export type UserProfileID = GUID<'UserProfile'>;
export const UserProfileID = registerGUID<UserProfileID>();

export type UserProfileEvent = (
  | UserProfileCreatedEvent
  | UserProfileUpdatedEvent
  | UserAppAddedEvent
);

export type UserProfileSnapshot = Snapshot<1, {
  createdAt: number,
  deletedAt: number | null,
  name: string | null,
  profileImageUrl: string | null,
  appIds: AppID[],
}>;
export const UserProfileSnapshot = registerSnapshot<UserProfileSnapshot>();

export type UserProfileDTO = {
  id: UserProfileID,
  appIds: AppID[],
  name: string,
  profileImageUrl: string,
};

export class UserProfile
  extends Aggregate<UserProfileID, UserProfileEvent, UserProfileSnapshot, UserProfileDTO>
  implements Resource
{
  static DEFAULT_NAME = 'Guest';
  static DEFAULT_PROFILE_IMAGE_URL = 'https://dnvefa72aowie.cloudfront.net/origin/profile/profile_default.png';

  readonly typename = 'UserProfile' as const;
  readonly snapshotVersion = 1 as const;

  get appIds() {
    return this.$snapshot.appIds.slice();
  }

  get name() {
    return this.$snapshot.name ?? UserProfile.DEFAULT_NAME;
  }

  get profileImageUrl() {
    return new URL(this.$snapshot.profileImageUrl ?? UserProfile.DEFAULT_PROFILE_IMAGE_URL);
  }

  toJSON(): Readonly<UserProfileDTO> {
    return Object.freeze({
      id: this.id,
      appIds: this.appIds,
      name: this.name,
      profileImageUrl: this.profileImageUrl.toString(),
    });
  }

  validate(state: Partial<UserProfileSnapshot>): state is UserProfileSnapshot {
    if (!(
      typeof state.createdAt === 'number' &&
      (state.deletedAt === null || typeof state.deletedAt === 'number') &&
      (state.name === null || (typeof state.name === 'string' && state.name !== '')) &&
      (state.profileImageUrl === null || typeof state.profileImageUrl === 'string') &&
      Array.isArray(state.appIds)
    )) {
      return false;
    }

    if (state.profileImageUrl) {
      new URL(state.profileImageUrl);
    }

    return true;
  }

  reduce(current: UserProfileSnapshot, event: UserProfileEvent): void {
    switch (event.eventName) {
      case 'UserProfileCreated': {
        current.createdAt = event.eventDate;
        current.deletedAt = null;
        current.name = event.eventPayload.name;
        current.profileImageUrl = event.eventPayload.profileImageUrl;
        current.appIds = [];
        break;
      }

      case 'UserProfileUpdated': {
        current.name = event.eventPayload.name;
        current.profileImageUrl = event.eventPayload.profileImageUrl;
        break;
      }

      case 'UserAppAdded': {
        current.appIds.push(event.eventPayload.appId);
        break;
      }
    }
  }

  static create(props: {
    id: UserProfileID,
    name?: string,
    profileImage?: URL,
  }): UserProfile {
    const id = props.id;
    const userProfile = new UserProfile(id);
    userProfile.$publishEvent({
      aggregateName: userProfile.typename,
      aggregateId: id,
      eventName: 'UserProfileCreated',
      eventDate: Date.now(),
      eventPayload: {
        name: props.name ?? null,
        profileImageUrl: props.profileImage?.toString() ?? null,
      },
    });
    return userProfile;
  }

  updateProfile(props: {
    name?: string,
    profileImage?: URL,
  }): void {
    const name = props.name ?? null;
    const profileImageUrl = props.profileImage?.toString() ?? null;

    if (
      this.$snapshot.name === name &&
      this.$snapshot.profileImageUrl === profileImageUrl
    ) {
      return;
    }

    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'UserProfileUpdated',
      eventDate: Date.now(),
      eventPayload: {
        name,
        profileImageUrl,
      },
    });
  }

  addApp(props: {
    appId: AppID,
  }): void {
    if (this.appIds.includes(props.appId)) {
      return;
    }

    this.$publishEvent({
      aggregateName: this.typename,
      aggregateId: this.id,
      eventName: 'UserAppAdded',
      eventDate: Date.now(),
      eventPayload: {
        appId: props.appId,
        userProfileId: this.id,
      },
    });
  }
}
