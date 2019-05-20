import { IUserState } from './user-reducer';
export function userFetchInfo(info: Partial<IUserState>) {
    return {
        type: 'USER_FETCH_INFO',
        data: info
    }
}