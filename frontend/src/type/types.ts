export type Polygon = {
    id: number;
    name: string;
    points: number[][];
};

export enum AppStateEnum {
    IDLE = 'IDLE',
    FETCHING = 'FETCHING',
    SAVEING_DRAWING = 'SAVEING_DRAWING',
    DELETING = 'DELETING',
    ERROR_SAVING_DRAWING = 'ERROR_SAVING_DRAWING',
    DRAWING = 'DRAWING'
};

export type AppState = {
    state: AppStateEnum;
    payload?: Object | null;
}