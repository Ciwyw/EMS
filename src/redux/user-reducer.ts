
export enum UserRole {
    Unknown,
    Employee,
    Admin
}
export interface IUserState {
    id: string,
    farm_id: string,
    role: UserRole,
    avatar: string,
    user_name: string,
    phone_number: string
}

const userInit: IUserState = {
    id: '',
    farm_id: '',
    role: UserRole.Unknown,
    avatar: '',
    user_name: '',
    phone_number: ''
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