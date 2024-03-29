export enum PageName {
    HOME_PAGE = 'HomePage',
    LOGIN_PAGE = 'LoginPage',
    REGISTER_PAGE = 'RegisterPage',
    FORGOT_PASSWORD_PAGE = 'ForgotPasswordPage',
    RESET_PASSWORD_PAGE = 'ResetPasswordPage',
    NOT_FOUND_PAGE = 'NotFoundPage',
    WELCOME_PAGE = 'WelcomePage',
    PROFILE_PAGE = 'ProfilePage',
    SEARCH_PAGE = 'SEARCH_PAGE',
    POST_DETAIL_PAGE = 'POST_DETAIL_PAGE',
    NOTIFICATION_PAGE = 'NOTIFICATION_PAGE',
    CHAT_PAGE = 'CHAT_PAGE',
    EMPTY_CHAT_PAGE = 'EMPTY_CHAT_PAGE',
    GROUP_PAGE = 'GROUP_PAGE',
    GROUP_DETAIL_PAGE = 'GROUP_DETAIL_PAGE',
    JOIN_GROUP_REQUEST_PAGE = 'JOIN_GROUP_REQUEST_PAGE',
    PENDING_GROUP_POSTS_PAGE = 'PENDING_GROUP_POSTS_PAGE',
    SUGGESTION_PAGE = 'SUGGESTION_PAGE',
    PROFILE_INFORMATION_PAGE = 'PROFILE_INFORMATION_PAGE',

    DASHBOARD = 'DASHBOARD',
    MANAGE_POST_PAGE = 'MANAGE_POST_PAGE',
    MANAGE_REPORT_PAGE = 'MANAGE_REPORT_PAGE',
    MANAGE_USER_PAGE = 'MANAGE_USER_PAGE',
    MANAGE_GROUP_PAGE = 'MANAGE_GROUP_PAGE',

    SETTINGS_PAGE = 'SETTINGS_PAGE',
    MANAGE_SURVEY_PAGE = 'MANAGE_SURVEY_PAGE',
    MANAGE_SYSTEM_MESSAGE_PAGE = 'MANAGE_SYSTEM_MESSAGE_PAGE',
}

export const PROVINCE_LIMIT = 100;

export enum SUPPORT_LANGUAGE {
    VI = 'vi',
}

export const DEFAULT_LANGUAGE = SUPPORT_LANGUAGE.VI;

export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    GROUP_HAS_CHILDREN = 410,
    GROUP_MAX_LEVEL = 411,
    GROUP_MAX_QUANTITY = 412,
    AWS_ERROR = 413,
    ITEM_NOT_FOUND = 444,
    ITEM_ALREADY_EXIST = 445,
    ITEM_INVALID = 446,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

export enum DateFormat {
    YYYY_MM_DD = 'YYYY/MM/DD',
    YYYY_MM_DD_HYPHEN = 'YYYY_MM_DD',
    DD_MM_YYYY_DASH = 'DD/MM/YYYY',
    hh_mm_L_COLON = 'h:mm L',
    DD_vi_MM_YYYY_HH_mm = 'DD [tháng] MM, YYYY [lúc] HH:mm',
    DD_vi_MM_HH_mm = 'DD [tháng] MM [lúc] HH:mm',
    dddd_vi_DD_MM_YYYY_DASH = 'dddd [Ngày] DD/MM/YYYY',
    dddd_vi_L_SPACE = 'dddd, [ngày] L',
    DD_vi_MM = 'DD [Th]MM',
    DD_vi_M_YYYY = 'DD [Th]M YYYY',
    HH_mm = 'HH:mm',
    YYYY_MM_DD_HH_MM_ss = 'YYYY/MM/DD HH:mm:ss',
}

export const ValidationForm = {
    INPUT_TEXT_MAX_LENGTH: 255,
    INPUT_TEXT_AREA_MAX_LENGTH: 2000,
    PASSWORD_MIN_LENGTH: 6,
    PHONE_REG_EXP:
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    NAME_REG_EXP: /^([^!@`~#$:%^*&()<>?\\/\\+|=]+?)$/,
};

export enum DeviceType {
    MOBILE = 'mobile',
    DESKTOP = 'desktop',
}

export enum QueryTag {
    POPULAR = 'popular',
}

export const LG_GRID_BREAKPOINT = 991;
export const MD_GRID_BREAKPOINT = 767;
export const SM_GRID_BREAKPOINT = 399;
export const HEIGHT_SHOW_STICKY_HEADER = 80;
export const PAGINATION_LIMIT_MAX_VALUE = 1000;

export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export enum NotificationPermission {
    GRANTED = 'granted',
    DENIED = 'denied',
    DEFAULT = 'default',
}

export const MAX_SUGGESTION_LENGTH = 75; // characters

export const ORDER_WAITING_DAY_COUNT = 2;

export enum KeyCode {
    ENTER = 'Enter',
}

export const Privacy = {
    PUBLIC: 1,
    SUBSCRIBED: 2,
    PRIVATE: 3,
};

export const PrivacyName = {
    [Privacy.PUBLIC]: 'Công khai',
    [Privacy.SUBSCRIBED]: 'Những người theo dõi tôi',
    [Privacy.PRIVATE]: 'Riêng tư',
};

export const MAX_UPLOAD_FILE_SIZE_IN_BYTE = 100000000;

export enum SubscribeRequestStatus {
    PENDING = 1,
    ACCEPTED = 2,
    REJECTED = 3,
}

export enum ReactionType {
    LIKE = 'LIKE',
    EMPATHIZE = 'EMPATHIZE',
    CELEBRATE = 'CELEBRATE',
    LOVE = 'LOVE',
    ANGRY = 'ANGRY',
}

export const ReactionTargetType = {
    POST: 'Post',
    COMMENT: 'Comment',
};

export enum ReportAction {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED',
}

export enum ReportTargetType {
    POST = 'Post',
    COMMENT = 'Comment',
    MESSAGE = 'Message',
    USER = 'User',
}

export enum NotificationTargetType {
    POST = 'Post',
    COMMENT = 'Comment',
    MESSAGE = 'Message',
    USER = 'User',
    SYSTEM_MESSAGE = 'SystemMessage',
    SURVEY = 'Survey',
    GROUP = 'Group',
    QUESTION = 'AskUserQuestion',
}

export const NotificationTargetTypeName = {
    [NotificationTargetType.POST]: 'bài viết',
    [NotificationTargetType.COMMENT]: 'bình luận',
    [NotificationTargetType.MESSAGE]: 'tin nhắn',
    [NotificationTargetType.USER]: 'bạn',
    [NotificationTargetType.QUESTION]: 'câu hỏi',
    [NotificationTargetType.GROUP]: 'nhóm',
};

export enum NotificationAction {
    REACT = 'REACT',
    COMMENT = 'COMMENT',
    SHARE = 'SHARE',
    SUBSCRIBE_PROFILE = 'SUBSCRIBE_PROFILE',
    SENT_SUBSCRIBE_REQUEST = 'SENT_SUBSCRIBE_REQUEST',
    ACCEPT_SUBSCRIBE_REQUEST = 'ACCEPT_SUBSCRIBE_REQUEST',
    SEND_MESSAGE = 'SEND_MESSAGE',
    SEND_SURVEY = 'SEND_SURVEY',
    ASK_QUESTION = 'ASK_QUESTION',
    ANSWER_QUESTION = 'ANSWER_QUESTION',
    REQUEST_JOIN_GROUP = 'REQUEST_JOIN_GROUP',
    ACCEPT_JOIN_GROUP = 'ACCEPT_JOIN_GROUP',
}

export const NotificationActionName = {
    [NotificationAction.REACT]: 'bày tỏ cảm xúc về một',
    [NotificationAction.COMMENT]: 'bình luận về một',
    [NotificationAction.SHARE]: 'chia sẻ',
    [NotificationAction.SUBSCRIBE_PROFILE]: 'theo dõi',
    [NotificationAction.SENT_SUBSCRIBE_REQUEST]: 'yêu cầu theo dõi',
    [NotificationAction.ACCEPT_SUBSCRIBE_REQUEST]: 'đồng ý lời mời theo dõi của',
    [NotificationAction.SEND_MESSAGE]: 'gửi cho bạn một',
    [NotificationAction.ASK_QUESTION]: 'đặt cho bạn một',
    [NotificationAction.ANSWER_QUESTION]: 'trả lời một',
    [NotificationAction.REQUEST_JOIN_GROUP]: 'gửi cho bạn một yêu cầu tham gia',
    [NotificationAction.ACCEPT_JOIN_GROUP]: 'chấp thuận yêu cầu tham gia',
};

export enum SocketEvent {
    USER_LOGIN = 'USER_LOGIN',
    USER_LOGOUT = 'USER_LOGOUT',

    USER_REACT = 'USER_REACT',
    USER_SUBSCRIBE_PUBLIC = 'USER_SUBSCRIBE_PUBLIC',
    USER_SUBSCRIBE_PRIVATE = 'USER_SUBSCRIBE_PRIVATE',
    USER_CHAT = 'USER_CHAT',
    USER_RECALL = 'USER_RECALL',

    USER_NOTIFICATION = 'USER_NOTIFICATION',

    POST_UPDATE = 'POST_UPDATE',

    USER_SURVEY_MUSIC_RECOMMEND = 'USER_SURVEY_MUSIC_RECOMMEND',
    CHECK_ONLINE = 'CHECK_ONLINE',
}

export const INIT_GET_COMMENT_LIST_QUERY = {
    page: 1,
    limit: 10,
};

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export const GenderName = {
    [Gender.MALE]: 'Nam',
    [Gender.FEMALE]: 'Nữ',
    [Gender.OTHER]: 'Khác',
};

export enum Relationship {
    SINGLE = 'SINGLE',
    IN_A_RELATIONSHIP = 'IN_A_RELATIONSHIP',
    MARRIED = 'MARRIED',
}

export const RelationshipName = {
    [Relationship.SINGLE]: 'Độc thân',
    [Relationship.IN_A_RELATIONSHIP]: 'Đang trong một mối quan hệ',
    [Relationship.MARRIED]: 'Đã kết hôn',
};

export enum SystemMessageType {
    INFO = 'info',
    WARNING = 'warning',
}

export enum SurveyType {
    CARE = 'CARE',
    ASK_AND_ANSWER = 'ASK_AND_ANSWER',
}

export const SurveyTypeName = {
    [SurveyType.CARE]: 'Quan tâm',
    [SurveyType.ASK_AND_ANSWER]: 'Hỏi đáp',
};

export const SystemMessageTypeName = {
    [SystemMessageType.INFO]: 'Thông báo',
    [SystemMessageType.WARNING]: 'Cảnh bảo',
};
