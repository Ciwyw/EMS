import React from 'react';
import { Provider } from 'react-redux';
import { NativeRouter, Switch, Route } from "react-router-native";
import { Provider as ProviderComponent } from '@ant-design/react-native';
import store from './redux/user-store';

import Login from './containers/login';
import Home from './containers/home';
import Farm from './containers/farm';
import FarmEdit from './containers/farm/edit';
import Monitor from './containers/farm/monitor';
import User from './containers/user';

const App = () => {
    return (
        <Provider store={store}>
            <ProviderComponent>
                <NativeRouter>
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/login" component={Login} exact />
                        <Route path="/farm/add" component={FarmEdit} exact />
                        <Route path="/farm/edit/:id" component={FarmEdit} exact />
                        <Route path="/farm/:id" component={Farm} exact />
                        <Route path="/monitor/:farmId/:farmName" component={Monitor} exact />
                        <Route path="/user" component={User} exact />
                    </Switch>
                </NativeRouter>
            </ProviderComponent>
        </Provider>
    )
}

export default App;