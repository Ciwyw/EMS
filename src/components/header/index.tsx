import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import Icon from '../icon';
import styles from './style';

interface IProps {
    back?: boolean,
    title: string,
    right?: ReactNode,
    history?: {
        goBack: () => void
    },
    onOpenDrawer?: () => void
}

interface IState {
}

export default class Header extends React.Component<IProps, IState> {
    static defaultProps = {
        back: true
    }

    render() {
        const { back, title, right, onOpenDrawer } = this.props;
        return (
            <View style={styles.header}>
                { back ? <Icon name="arrow-left" onPress={this.handleBack}/>
                    : <Icon name="bars" onPress={onOpenDrawer}/>
                }
                <Text style={styles.title}>{title}</Text>
                { right ? right : <View /> }
            </View>
        )
    }

    handleBack = () => {
        this.props.history && this.props.history.goBack();
    }

}