import { ProfileScreenTab } from '@/pages/profile/constants';
import mitt from 'mitt';

export enum EventName {
    CHANGE_PROFILE_SCREEN_TAB = 'CHANGE_PROFILE_SCREEN_TAB',
}

export type Events = {
    [EventName.CHANGE_PROFILE_SCREEN_TAB]: ProfileScreenTab;
};

export const EventEmitter = mitt<Events>();
