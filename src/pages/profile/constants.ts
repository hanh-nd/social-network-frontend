export enum ProfileScreenTab {
    MAIN = 'MAIN',
    DESCRIBE = 'DESCRIBE',
    SUBSCRIBERS = 'SUBSCRIBERS',
    SUBSCRIBING = 'SUBSCRIBING',
    BLOCKS = 'BLOCKS',
    REQUEST = 'REQUESTS',
    QUESTIONS = 'QUESTIONS',
    STATISTICS = 'STATISTICS',
}

export const INIT_GET_POST_LIST_QUERY = {
    page: 1,
    limit: 10,
};

export const INIT_GET_SUBSCRIBE_REQUEST_LIST_QUERY = {
    page: 1,
    limit: 10,
};

export const INIT_GET_QUESTION_LIST_QUERY = {
    page: 1,
    limit: 10,
};

export const INIT_GET_STATISTIC_QUERY = {
    range: 7,
};
