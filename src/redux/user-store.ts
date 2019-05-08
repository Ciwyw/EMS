import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import user from './user-reducer';

const store = createStore(
    combineReducers({
        user
    }),
    applyMiddleware(thunk)
)

export default store;