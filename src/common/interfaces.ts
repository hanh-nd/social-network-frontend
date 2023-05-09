import { AxiosResponse } from 'axios';
import { HttpStatus, OrderDirection } from './constants';
export interface IBodyResponse<T> extends AxiosResponse {
    success: boolean;
    isRequestError?: boolean;
    code: HttpStatus;
    message: string;
    data: T;
    error?: { key: string; message: string; errorCode: HttpStatus };
}

export interface ILoginForm {
    username: string;
    password: string;
}

export interface IChangePasswordForm {
    newPassword: string;
}

export interface IForgotPasswordForm {
    email: string;
}

export interface IVerifyTokenRequest {
    code: string;
    email: string;
}

export interface IRegisterForm {
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface IResetPasswordForm {
    password: string;
}

export interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IRequestForgotPasswordResponse {
    success: boolean;
    code: HttpStatus;
}

export interface IVerifyTokenResponse {
    code: HttpStatus;
    token: string;
    email: string;
}

export interface ICommonGetListQuery {
    page?: number;
    limit?: number;
    keyword?: string;
    orderDirection?: OrderDirection;
}

export interface ICommonGetListResponse<T> {
    items: T[];
    totalItems: number;
}

export const enum MediaExtension {
    PNG = 'png',
    JPEG = 'jpeg',
    PDF = 'pdf',
}

export const enum FileMime {
    IMAGE_PNG = 'image/png',
    IMAGE_JPG = 'image/jpeg',
    IMAGE_TIFF = 'image/tiff',
    IMAGE_WEBP = 'image/webp',
    IMAGE_BMP = 'image/bmp',
    PDF = 'application/pdf',
}

export interface IBreadcrumb {
    index: number;
    text: string;
    link: string;
}

export interface IYupError {
    i18nKey?: string;
    message?: string;
    params?: Record<string, string>;
}

export interface IDropDownOption {
    value?: string | number;
    label?: string;
}

export interface IUser {
    _id: string;
    username: string;
    roleId: string;
    fullName: string;
    avatarId?: string;
    coverId?: string;
    email: string;
    active: boolean;
    private: boolean;
    point: number;
    lastOnlineAt?: Date;
    numberOfSubscribers: number;
    numberOfSubscribing: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
