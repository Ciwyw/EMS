import { IUserState } from './user-reducer';
export function userFetchInfo(info: IUserState) {
    return {
        type: 'USER_FETCH_INFO',
        data: info
    }
}