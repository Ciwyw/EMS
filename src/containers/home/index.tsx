import React from 'react';
import { View, Text } from 'react-native';
import ajax from '../../../services';
import { userFetchInfo } from '../../redux/user-action';
import store from '../../redux/user-store';
import { IUserState, UserRole } from '../../redux/user-reducer';
import Admin from './admin';
import Employ from '../farm';

interface IProps {
    history: {
        push: (path: string) => void,
        goBack: () => void
    },

}

interface IState {
    user: IUserState
}

class Home extends React.Component<IProps, IState> {

    state: IState = {
        user: {}
    }

    render() {
        const { user } = this.state;
        return (
            <View>
                { user.role === UserRole.Admin ? <Admin history={this.props.history}/> : null}
                { user.role === UserRole.Employee ? <Employ asEmploy={true} user={user} history={this.props.history} /> : null}
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
            user: res.data
        });
        store.dispatch(userFetchInfo(res.data));
    }
}

export default Home;