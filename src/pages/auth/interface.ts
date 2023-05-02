import { IAddress, IUser } from '@/common/interfaces';

export interface ILoginForm {
    username: string;
    password: string;
}

export interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IRegisterResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IRegisterForm {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone?: string;
    birthday?: string;
    address?: IAddress;
    describe?: string;
}

export interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}
