export enum ChatType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP',
}

export const ChatTypeName = {
    [ChatType.PRIVATE]: 'Đoạn hội thoại kín',
    [ChatType.GROUP]: 'Đoạn hội thoại nhóm',
};

export const INIT_GET_MESSAGE_LIST_QUERY = {
    page: 1,
    limit: 25,
};
