import { IMessage } from '@/pages/chat/interfaces';
import { AxiosResponse } from 'axios';
import {
    Gender,
    HttpStatus,
    NotificationAction,
    NotificationTargetType,
    OrderDirection,
    ReactionType,
    Relationship,
    ReportAction,
    ReportTargetType,
    SubscribeRequestStatus,
    SurveyType,
    SystemMessageType,
} from './constants';
export interface IBodyResponse<T> extends AxiosResponse {
    success: boolean;
    isRequestError?: boolean;
    code: HttpStatus;
    message: string;
    data: T;
    error?: { key: string; message: string; errorCode: HttpStatus };
}

export interface IChangePasswordForm {
    newPassword: string;
}

export interface IForgotPasswordForm {
    email: string;
}

export interface IVerifyTokenRequest {
    token: string;
    password: string;
}

export interface IResetPasswordForm {
    password: string;
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
    phone?: string;
    avatarId?: string;
    coverId?: string;
    describe?: string;
    email: string;
    active: boolean;
    private: boolean;
    point: number;
    lastOnlineAt?: Date;
    numberOfSubscribers: number;
    numberOfSubscribing: number;
    numberOfBlocked?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    isSubscribing?: boolean;
    isBlocked?: boolean;
    isSentRequest?: boolean;
    isSelf?: boolean;
    alertRange: number;
}

export interface IUserDetail {
    _id: string;
    userId: string;
    gender?: Gender;
    birthday?: Date;
    address?: IAddress;
    relationship?: Relationship;
    work?: IWork;
    education?: IEducation;
    tagIds?: string[];
}

export interface IAddress {
    province: string;
    ward: string;
    district: string;
    detail?: string;
}

export interface IWork {
    name: string;
    position?: string;
}

export interface IEducation {
    name: string;
    major?: string;
}

export interface IFile {
    _id: string;
    originalname: string;
    mimetype: string;
    id: string;
    filename: string;
    metadata: {
        uploadedBy: {
            _id: string;
            username: string;
        };
    };
    bucketName: string;
    chunkSize: number;
    size: number;
    uploadDate: Date;
    contentType: string;
}

export type IGetUserListQuery = ICommonGetListQuery;

export interface IUpdateProfileBody {
    avatarId?: string;
    coverId?: string;
    phone?: string;
    fullName?: string;
    email?: string;
    gender?: Gender;
    birthday?: Date;
    address?: IAddress;
    describe?: string;
    relationship?: Relationship;
    work?: IWork;
    education?: IEducation;
    private?: boolean;
    tagIds?: string[];
}

export interface IUpdateAlertTimeRange {
    alertRange: number;
}

export interface IPost {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    author: Partial<IUser>;
    content: string;
    privacy: number;
    isAnonymous?: boolean;
    postShared: Partial<IPost>;
    postedInGroup: Partial<IGroup>;
    pictureIds: string[];
    medias: IFile[];
    tagIds: ITag[];
    videoIds: string[];
    numberOfComments: number;
    numberOfReacts: number;
    numberOfShares: number;
    isReacted: boolean;
    reactionType?: ReactionType;
    isToxic?: boolean;
}

export type IGetPostListQuery = ICommonGetListQuery;

export interface ICreateNewPostBody {
    privacy: number;
    content: string;
    pictureIds: string[];
    videoIds: string[];
    postSharedId?: string;
    isAnonymous?: boolean;
}

export interface IUpdatePostBody {
    privacy?: number;
    content?: string;
    pictureIds?: string[];
    videoIds?: string[];
    tagIds?: string[];
}

export interface IReportPostBody {
    reportReason: string;
}

export interface ICreateReactionBody {
    type: string;
}

export type IGetCommentListQuery = ICommonGetListQuery;

export interface ICreateCommentBody {
    content: string;
    pictureId?: string;
    videoId?: string;
}

export interface IEditCommentBody {
    content: string;
    pictureId?: string;
    videoId?: string;
}

export interface IComment {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    author: Partial<IUser>;
    post: Partial<IPost>;
    content: string;
    numberOfReacts: number;
    isReacted: boolean;
    reactionType?: ReactionType;
    isToxic?: boolean;
}

export interface ISearchResults {
    posts: IPost[];
    users: IUser[];
    groups: IGroup[];
}

export interface ISearchQuery extends ICommonGetListQuery {
    size?: number;
}

export interface IReaction {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    author: {
        _id: string;
        username: string;
        fullName: string;
        isSubscribing?: boolean;
        isSelf?: boolean;
    };
    target: {
        _id: string;
    };
    targetType: string;
    type: ReactionType;
}

export interface IGroup {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    name: string;
    administrators: {
        user: IUser;
        isOwner: boolean;
    }[];
    private: boolean;
    reviewPost: boolean;
    autoReject?: boolean;
    summary: string;
    coverId: string;
    memberIds: string[];
    pinnedPosts: IGroupPost[];
    blockIds: IUser[];
    isMember?: boolean;
    isPending?: boolean;
}

export interface IGroupPost {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    author: string;
    post: IPost;
    group: IGroup;
    status: SubscribeRequestStatus;
}

export interface IJoinRequest {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    sender: IUser;
    group: string;
    status: SubscribeRequestStatus;
}

export interface ICreateGroupBody {
    name: string;
    private?: boolean;
    reviewPost?: boolean;
    autoReject?: boolean;
    summary?: string;
    coverId?: string;
}

export interface IUpdateGroupBody {
    name?: string;
    private?: boolean;
    reviewPost?: boolean;
    autoReject?: boolean;
    summary?: string;
    coverId?: string;
}

export type IGetGroupListQuery = ICommonGetListQuery;

export type IGetJoinRequestListQuery = ICommonGetListQuery;

export type ICreatePostInGroupBody = ICreateGroupPostBody;

export interface IGetGroupPostListQuery extends ICommonGetListQuery {
    status?: SubscribeRequestStatus;
}

export type ICreateGroupPostBody = ICreateNewPostBody;

export interface IUpdateGroupPostBody {
    status: SubscribeRequestStatus;
}

export interface ICreateJoinRequestBody {
    status: SubscribeRequestStatus;
}

export interface IUpdateJoinRequestBody {
    status: SubscribeRequestStatus;
}

export interface ITag {
    _id: string;
    name: string;
    iconId: string;
}

export interface IRole {
    _id: string;
    name: string;
    permissions: string[];
}

export interface INotification {
    _id: string;
    author: IUser;
    to: IUser;
    target: NotificationTarget;
    targetType: NotificationTargetType;
    action: NotificationAction;
    isRead: boolean;
    content: string;
    additionalData?: object;
    urgent: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export type NotificationTarget = IPost | IComment | IMessage | IUser | ISystemMessage | ISurvey | IQuestion;
export type ReportTarget = IPost | IComment | IMessage | IUser;

export interface IStatistic {
    total: number;
    totalActive: number;
    totalDeactivated: number;
    group: IGroupCount[];
}
export interface IGroupCount {
    _id: string;
    count: number;
}

export interface IReport {
    _id: string;
    author: IUser;
    target: ReportTarget;
    targetType: ReportTargetType;
    action: ReportAction;
    reportReason?: string;
    note?: string;
    systemReporter?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface IGetReportListQuery extends ICommonGetListQuery {
    targetType?: ReportTargetType;
}

export interface IUpdateReportBody {
    note?: string;
}

export interface IGetStatisticQuery extends ICommonGetListQuery {
    range?: number;
}

export interface ISystemMessage {
    _id: string;
    code: string;
    template: string;
    fullTemplate: string;
    type: SystemMessageType;
}

export interface IQuestion {
    _id: string;
    sender: IUser;
    receiver: IUser;
    question: string;
    answer?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface IGetQuestionListQuery extends ICommonGetListQuery {
    pending?: number;
    query?: number;
}

export interface ICreateQuestionBody {
    receiver: string;
    isAnonymous: boolean;
    question: string;
}

export interface IUpdateQuestionBody {
    answer: string;
}

export interface IUpdateUserRoleBody {
    roleId: string;
}

export interface ISurvey {
    _id: string;
    name: string;
    description?: string;
    type: SurveyType;
    question: string;
    askDate: Date;
    urgent: boolean;
    userAnswer: ISurveyAnswer;
    quickAnswers: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface ISurveyAnswer {
    _id: string;
    survey: ISurvey;
    user: IUser;
    answer: string;
    additionalData?: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export type IGetSurveyListQuery = ICommonGetListQuery;

export type IGetSystemMessageListQuery = ICommonGetListQuery;

export interface ICreateSurveyBody {
    name: string;
    description?: string;
    type: SurveyType;
    question: string;
    askDate: Date;
    urgent: boolean;
    repeatDays?: number[];
    quickAnswers?: string;
}

export interface ICreateSystemMessageBody {
    code: string;
    template: string;
    fullTemplate: string;
    type: SystemMessageType;
}

export type IUpdateSurveyBody = Partial<ICreateSurveyBody>;

export interface IUpdateSystemMessageBody {
    template?: string;
    fullTemplate?: string;
    type?: SystemMessageType;
}

export interface IAnswerSurveyBody {
    answer: string;
}

export type IGetUserAnswerQuery = ICommonGetListQuery;

export type IGetSuggestionListQuery = ICommonGetListQuery;

export interface IChangePasswordBody {
    oldPassword: string;
    password: string;
    rePassword?: string;
}
