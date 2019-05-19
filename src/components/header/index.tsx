import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import Icon from '../icon';
import styles from './style';

interface IProps {
    title: string,
    left?: ReactNode,
    right?: ReactNode,
    history?: {
        goBack: () => void
    }
}

interface IState {
}

export default class Header extends React.Component<IProps, IState> {

    render() {
        const { title, left, right } = this.props;
        return (
            <View style={styles.header}>
                { left ? left : <Icon name="arrow-left" color="#fff" onPress={this.handleBack}/> }
                <Text style={styles.title}>{title}</Text>
                { right ? right : <View /> }
            </View>
        )
    }

    handleBack = () => {
        this.props.history && this.props.history.goBack();
    }

}