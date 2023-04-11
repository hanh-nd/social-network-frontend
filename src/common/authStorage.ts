import { DEFAULT_LANGUAGE, SUPPORT_LANGUAGE } from './constants';
import { ICustomer } from './interfaces';
import { storage } from './localStorage';

export const enum AUTH_SERVICE_KEY {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    LANGUAGUE = 'LANGUAGE',
    LOGIN_CUSTOMER = 'CUSTOMER',
}
class LocalStorageAuthService {
    setAccessToken(value: string): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, value);
    }

    setLanguage(value: SUPPORT_LANGUAGE): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LANGUAGUE, value);
    }

    setLoginCustomer(customer: ICustomer | null) {
        storage.setLocalStorage(
            AUTH_SERVICE_KEY.LOGIN_CUSTOMER,
            JSON.stringify(customer || ''),
        );
    }

    getAccessToken(): string {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN);
    }

    getLanguage(): SUPPORT_LANGUAGE {
        return (storage.getLocalStorage(AUTH_SERVICE_KEY.LANGUAGUE) ||
            DEFAULT_LANGUAGE) as SUPPORT_LANGUAGE;
    }

    getLoginCustomer(): ICustomer {
        return storage.getObjectFromKey(AUTH_SERVICE_KEY.LOGIN_CUSTOMER) as ICustomer;
    }

    resetAccessToken(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, '');
    }

    resetLoginCustomer(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LOGIN_CUSTOMER, '');
    }

    resetAll(): void {
        this.resetAccessToken();
        this.resetLoginCustomer();
    }
}

const localStorageAuthService = new LocalStorageAuthService();
export default localStorageAuthService;
