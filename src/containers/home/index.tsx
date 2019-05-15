import React from 'react';
import { View, Text } from 'react-native';
import ajax from '../../../services';
import { userFetchInfo } from '../../redux/user-action';
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
        role: UserRole.Admin
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
        // const res: IResponse = await ajax('/user/info');
        // if(res.status === 'error') {
            // this.props.history.push('/login');
        //     return;
        // }
        // console.log(res.data, 'userInfo----------');
    }
}