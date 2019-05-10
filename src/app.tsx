import React from 'react';
import { Provider } from 'react-redux';
import { NativeRouter, Switch, Route } from "react-router-native";
import { Provider as ProviderComponent } from '@ant-design/react-native';
import store from './redux/user-store';

import Login from './containers/login';


const App = () => {
    return (
        <Provider store={store}>
            <ProviderComponent>
                <NativeRouter>
                    <Switch>
                        <Route path="/" component={Login} exact />
                    </Switch>
                </NativeRouter>
            </ProviderComponent>
        </Provider>
    )
}

export default App;