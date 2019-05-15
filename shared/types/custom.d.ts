declare interface ReduxAction {
    type: string,
    data: any
}
declare interface IResponse {
    error: boolean,
    data?: any,
    msg?: string
}

declare interface IFile {
    url: string
}

declare module 'rc-form';
