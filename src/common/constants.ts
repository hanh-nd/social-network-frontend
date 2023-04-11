export enum PageName {
    HOME_PAGE = 'HomePage',
    NOT_FOUND_PAGE = 'NotFoundPage',
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

export enum DATE_TIME_FORMAT {
    YYYY_MM_DD_HYPHEN = 'YYYY_MM_DD',
    DD_MM_YYYY_DASH = 'DD/MM/YYYY',
    hh_mm_L_COLON = 'h:mm L',
    HH_mm_vi_DD_MM_YYYY_DOT = 'HH:mm [Ngày] DD.MM.YYYY',
    dddd_vi_DD_MM_YYYY_DASH = 'dddd [Ngày] DD/MM/YYYY',
    DD_MM_YY_DASH = 'DD/MM/YYYY',
    dddd_vi_L_SPACE = 'dddd, [ngày] L',
    DD_vi_MM = 'DD [Th]MM',
    DD_vi_M_YYYY = 'DD [Th]M YYYY',
    HH_mm = 'HH:mm',
}

export const FORM_VALIDATION = {
    textMaxLength: 255,
    textAreaMaxLength: 2000,
    passwordMinLength: 6,
    phoneRegExp:
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    nameRegExp: /^([^!@`~#$:%^*&()<>?\\/\\+|=]+?)$/,
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
