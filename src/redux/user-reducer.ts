export interface IUserState {
    user_id: string
}

const userInit: IUserState = {
    user_id: ''
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