import { DEFAULT_LANGUAGE, SUPPORT_LANGUAGE } from './constants';
import { IUser } from './interfaces';
import { storage } from './localStorage';

export const enum AUTH_SERVICE_KEY {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    LANGUAGE = 'LANGUAGE',
    LOGIN_USER = 'USER',
    IS_REFRESHING = 'IS_REFRESHING',
    ADMIN_ROLE_IDS = 'ADMIN_ROLE_IDS',
}
class LocalStorageAuthService {
    setAccessToken(value: string): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, value);
    }

    setRefreshToken(value: string): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN, value);
    }

    setLanguage(value: SUPPORT_LANGUAGE): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LANGUAGE, value);
    }

    setLoginUser(user: IUser | null) {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER, JSON.stringify(user || ''));
    }

    setIsRefreshing(isRefreshing: number) {
        storage.setLocalStorage(AUTH_SERVICE_KEY.IS_REFRESHING, `${isRefreshing}`);
    }

    getAccessToken(): string {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN);
    }

    getRefreshToken(): string {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN);
    }

    getLanguage(): SUPPORT_LANGUAGE {
        return (storage.getLocalStorage(AUTH_SERVICE_KEY.LANGUAGE) || DEFAULT_LANGUAGE) as SUPPORT_LANGUAGE;
    }

    getLoginUser(): IUser {
        return storage.getObjectFromKey(AUTH_SERVICE_KEY.LOGIN_USER) as IUser;
    }

    getIsRefreshing(): number {
        return +(storage.getObjectFromKey(AUTH_SERVICE_KEY.IS_REFRESHING) as string);
    }

    resetRefreshToken(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN, '');
    }

    resetAccessToken(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, '');
    }

    resetLoginUser(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER, '');
    }

    getAdminRoleIds() {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.ADMIN_ROLE_IDS);
    }

    setAdminRoleIds(id = '') {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ADMIN_ROLE_IDS, id);
    }

    resetAll(): void {
        this.resetRefreshToken();
        this.resetAccessToken();
        this.resetLoginUser();
    }
}

const localStorageAuthService = new LocalStorageAuthService();
export default localStorageAuthService;
