import React from 'react';
import { Provider } from 'react-redux';
import { NativeRouter, Switch, Route } from "react-router-native";
import { Provider as ProviderComponent } from '@ant-design/react-native';
import store from './redux/user-store';

import Login from './containers/login';
import Home from './containers/home';
import Farm from './containers/farm';

const App = () => {
    return (
        <Provider store={store}>
            <ProviderComponent>
                <NativeRouter>
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/login" component={Login} />
                        <Route path="/farm/:id" component={Farm}/>
                    </Switch>
                </NativeRouter>
            </ProviderComponent>
        </Provider>
    )
}

export default App;