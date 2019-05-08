import React from 'react';
import { Provider } from 'react-redux';
import { NativeRouter, Switch, Route } from "react-router-native";
import store from './redux/user-store';

import Login from './containers/login';


const App = () => {
    return (
        <Provider store={store}>
            <NativeRouter>
                <Switch>
                    <Route path="/" component={Login} exact />
                </Switch>
            </NativeRouter>
        </Provider>
    )
}

export default App;