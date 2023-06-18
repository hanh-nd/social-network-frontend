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
}
