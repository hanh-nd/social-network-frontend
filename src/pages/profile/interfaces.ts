import { SubscribeRequestStatus } from '@/common/constants';
import { ICommonGetListQuery, IUser } from '@/common/interfaces';

export interface ISubscribeRequest {
    _id: string;
    sender: IUser;
    receiver: IUser;
    status: SubscribeRequestStatus;
}

export type IGetSubscribeRequestListQuery = ICommonGetListQuery;

export interface IUpdateSubscribeRequestBody {
    status: SubscribeRequestStatus;
}

export interface IGetQuestionListQuery extends ICommonGetListQuery {
    pending?: number;
    asked?: number;
}

export interface IUserStatistic {
    date: string;
    spentHour: number;
    point: number;
}

export interface IGetUserStatisticQuery {
    range?: number;
}
