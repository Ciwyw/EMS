import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Toast, Drawer, WhiteSpace, Button } from '@ant-design/react-native';
import ajax from '../../../../services';
import Header from '../../../components/header';
import Icon from '../../../components/icon';
import Card from './card';

interface IProps {
    history: {
        push: (path: string) => void
    }
}

interface IState {
    farmList: any[],
    drawerVisible: boolean
}

class Admin extends React.Component<IProps, IState> {
    state: IState = {
        farmList: [],
        drawerVisible: false
    }
    render() {
        const { drawerVisible, farmList } = this.state;
        const rightFragment = <Icon name="plus" onPress={this.handlePressAdd}/>;
        return (
            <View>
                <Header 
                    back={false} 
                    title="养殖场" 
                    right={rightFragment}
                    onOpenDrawer={this.handleOpenDrawer}
                />
                <Drawer
                    sidebar={this.renderSiderbar()}
                    position="left"
                    open={drawerVisible}
                />
                <FlatList 
                    data={farmList} 
                    renderItem={({item}) => <Card info={item} history={this.props.history}/>}
                    style={styles.list}
                />
            </View>
        )
    }

    renderSiderbar = () => {
        return (
            <Text>side</Text>
        )
    }

    componentDidMount() {
        this.fetchFarmList();
    }

    handlePressAdd = () => {
        this.props.history.push('/farm/ ');
    }

    handleOpenDrawer = () => {
        this.setState({
            drawerVisible: true
        })
    }

    handleCloseDrawer = () => {
        this.setState({
            drawerVisible: false
        })
    }

    fetchFarmList = async () => {
        const res: IResponse = await ajax('/farm/list');
        if(res.error) {
            Toast.fail(res.msg, 2);
            return;
        }
        this.setState({
            farmList: res.data
        })
    }

}

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 15,
        paddingVertical: 20
    }
})

export default Admin;
