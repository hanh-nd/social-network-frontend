import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpMiddleware {
    async onRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        return config;
    }

    onRequestError(err: AxiosError): void {
        throw err;
    }

    onSync(promise: Promise<unknown>): Promise<unknown> {
        return promise;
    }

    onResponse(response: AxiosResponse): AxiosResponse {
        return response;
    }

    async onResponseError(err: AxiosError, http: AxiosInstance | null): Promise<unknown> {
        throw err;
    }
}
