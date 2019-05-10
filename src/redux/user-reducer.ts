
export enum UserRole {
    Unknown,
    Admin,
    Employee
}
export interface IUserState {
    id: string,
    role: UserRole,
    avatar: string,
    name: string
}

const userInit: IUserState = {
    id: '',
    role: UserRole.Unknown,
    avatar: '',
    name: ''
}

export default function(state = userInit, action: ReduxAction) {
    switch(action.type) {
        case 'USER_FETCH_INFO': 
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}