export interface IJob {
    key: string;
    nextDate: Date;
    cronTime: string;
    active: boolean;
}

export interface IUpdateJobBody {
    cronTime: string;
    active: boolean;
}
