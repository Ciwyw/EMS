
export enum UserRole {
    Unknown,
    Employee,
    Admin
}

export enum Sex {
    Unknown,
    Female,
    Male
}
export interface IUserState {
    id?: number,
    farm_id?: number,
    role?: UserRole,
    avatar?: string,
    user_name?: string,
    phone_number?: string,
    sex?: Sex,
    farm_name?: string
}

export const userInit: IUserState = {
    id: 0,
    farm_id: 0,
    role: UserRole.Unknown,
    avatar: '',
    user_name: '',
    phone_number: '',
    sex: Sex.Unknown,
    farm_name: ''
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