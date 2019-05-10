declare interface ReduxAction {
    type: string,
    data: any
}
declare interface IResponse {
    status: 'error' | 'success',
    data?: any,
    msg?: string
}
