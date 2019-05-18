import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Header from '../../components/header';

interface IProps {
    history: {
        goBack: () => void
    }
}

interface IState {
}

class User extends React.Component<IProps, IState> {
    render () {
        return (
            <Header title="个人中心" history={this.props.history}/>
        )
    }
}

export default User;