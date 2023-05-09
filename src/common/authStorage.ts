import { DEFAULT_LANGUAGE, SUPPORT_LANGUAGE } from './constants';
import { IUser } from './interfaces';
import { storage } from './localStorage';

export const enum AUTH_SERVICE_KEY {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    LANGUAGE = 'LANGUAGE',
    LOGIN_USER = 'USER',
}
class LocalStorageAuthService {
    setAccessToken(value: string): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, value);
    }

    setLanguage(value: SUPPORT_LANGUAGE): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LANGUAGE, value);
    }

    setLoginUser(user: IUser | null) {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER, JSON.stringify(user || ''));
    }

    getAccessToken(): string {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN);
    }

    getLanguage(): SUPPORT_LANGUAGE {
        return (storage.getLocalStorage(AUTH_SERVICE_KEY.LANGUAGE) || DEFAULT_LANGUAGE) as SUPPORT_LANGUAGE;
    }

    getLoginUser(): IUser {
        return storage.getObjectFromKey(AUTH_SERVICE_KEY.LOGIN_USER) as IUser;
    }

    resetAccessToken(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, '');
    }

    resetLoginUser(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER, '');
    }

    resetAll(): void {
        this.resetAccessToken();
        this.resetLoginUser();
    }
}

const localStorageAuthService = new LocalStorageAuthService();
export default localStorageAuthService;
