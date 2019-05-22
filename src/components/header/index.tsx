import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from '../icon';
import styles from './style';

interface IProps {
    title: string,
    avatar?: string,
    right?: ReactNode,
    history: {
        push?: (path: string) => void,
        goBack?: () => void
    }
}

interface IState {
}

export default class Header extends React.Component<IProps, IState> {

    render() {
        const { title, avatar, right } = this.props;
        return (
            <View style={styles.header}>
                { 
                    avatar ?
                    <TouchableOpacity onPress={this.handlePressUser}>
                        <Image source={{ uri: avatar}} style={styles.avatar}/>
                    </TouchableOpacity>
                     :
                    <Icon name="arrow-left" color="#fff" onPress={this.handleBack}/>
                }
                <Text style={styles.title}>{title}</Text>
                { right ? right : <View /> }
            </View>
        )
    }

    handleBack = () => {
        this.props.history && this.props.history.goBack();
    }

    handlePressUser = () => {
        this.props.history && this.props.history.push('/user');
    }

}