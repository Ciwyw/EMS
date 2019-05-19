import React from 'react';
import { View, Text } from 'react-native';
import ajax from '../../../services';
import { userFetchInfo } from '../../redux/user-action';
import store from '../../redux/user-store';
import { UserRole } from '../../redux/user-reducer';
import Admin from './admin';
import Employ from './employ';

interface IProps {
    history: {
        push: (path: string) => void
    }
}

interface IState {
    role: UserRole
}

export default class Home extends React.Component<IProps, IState> {

    state: IState = {
        role: UserRole.Unknown
    }

    render() {
        const { role } = this.state;
        return (
            <View>
                { role === UserRole.Admin ? <Admin history={this.props.history}/> : null}
                { role === UserRole.Employee ? <Employ /> : null}
            </View>
        )
    }

    async componentDidMount() {
        const res: IResponse = await ajax('/user/info');
        if(res.error) {
            this.props.history.push('/login');
            return;
        }
        console.log(res.data, 'userInfo----------');
        this.setState({
            role: res.data.role
        });
        store.dispatch(userFetchInfo(res.data));
    }
}