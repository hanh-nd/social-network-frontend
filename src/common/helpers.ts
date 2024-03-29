import i18n from '@/plugins/vue-i18n';
import flatten from 'lodash/flatten';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import pick from 'lodash/pick';
import trim from 'lodash/trim';
import { NotificationActionName, NotificationTargetTypeName } from './constants';
import { INotification, IUser } from './interfaces';

export function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function trimObject(body: any): void {
    const trimValue = (item: any) => {
        mapKeys(item, (value, key) => {
            // remove string contain only space characters
            if (typeof value === 'string') {
                item[key] = value.trim();
            }

            // iterate array
            else if (Array.isArray(value)) {
                value.forEach((subValue, index) => {
                    // remove string contain only space characters
                    if (typeof subValue === 'string' && !trim(subValue as string)) {
                        value.splice(index, 1);
                    } else if (isPlainObject(subValue)) {
                        trimValue(subValue);
                    }
                });
            } else if (isPlainObject(value)) {
                trimValue(value);
            }
        });
    };

    trimValue(body);
}

export function translateYupError(
    yupError:
        | {
              i18nKey: string;
              params?: Record<string, string>;
          }
        | string,
): string {
    if (typeof yupError === 'string') {
        return i18n.global.t(yupError);
    }
    if (!yupError?.i18nKey) return '';
    return i18n.global.t(yupError?.i18nKey, { ...yupError?.params });
}

// transform resposne to vue-meta's form
export function transformMetaResponse(obj: any) {
    const res = [] as any[];
    delete obj.id;
    Object.keys(obj).forEach((key) => res.push(obj[key]));
    const flatRes = flatten(res).map((ele) => pick(ele, ['name', 'content', 'itemprop', 'property']));
    return flatRes;
}

export function getAvatarUrl(user?: Partial<IUser>) {
    return user?.avatarId
        ? `${process.env.VUE_APP_API_URL}/files/${user.avatarId}`
        : require('@/assets/images/common/default-avatar.svg');
}

export function generateNotificationMessageContent(notification: INotification) {
    const { author, to, targetType, target, action, content: notificationContent } = notification;
    if (notificationContent) {
        return notificationContent;
    }

    const content = [author?.fullName, 'vừa', NotificationActionName[action], NotificationTargetTypeName[targetType]];
    return content.join(' ');
}
