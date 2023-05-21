import { ICommonGetListQuery, IUser } from '@/common/interfaces';
import { ChatType } from './constants';

export interface IChat {
    _id: string;
    name?: string;
    avatarId?: string;
    administrators?: [
        {
            user: Partial<IUser>;
            isOwner: boolean;
        },
    ];
    members: Partial<IUser>[];
    blockedIds: string[];
    type: ChatType;
    deletedFor: string[];
    lastMessage?: IMessage;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface IMessage {
    _id: string;
    author: Partial<IUser>;
    chat: Partial<IChat>;
    content: string;
    mediaId?: string;
    isRecalled?: boolean;
    deletedFor: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface ICreateChatBody {
    name?: string;
    members?: string[];
    type?: ChatType;
}

export interface IUpdateChatBody {
    name?: string;
    avatarId?: string;
}

export interface ICreateMessageBody {
    content: string;
    mediaId?: string;
}

export type IGetMessageListQuery = ICommonGetListQuery;

export interface IReceiveUserChatPayload {
    chatId: string;
    message: IMessage;
}
