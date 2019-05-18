import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Toast, Drawer } from '@ant-design/react-native';
import ajax from '../../../../services';
import Header from '../../../components/header';
import Icon from '../../../components/icon';
import Empty from '../../../components/empty';
import Card from './card';

interface IProps {
    history: {
        push: (path: string) => void
    }
}

interface IState {
    farmList: IFarm[]
}

class Admin extends React.Component<IProps, IState> {
    state: IState = {
        farmList: []
    }
    render() {
        const {  farmList } = this.state;
        const rightFragment = <Icon name="plus" onPress={this.handlePressAdd}/>;
        return (
            <View>
                <Header 
                    back={false} 
                    title="养殖场" 
                    right={rightFragment}
                    onUser={this.handlePressUser}
                />
                {
                    farmList.length === 0 ?
                        <Empty hint="还没有养殖场，点击右上角添加吧～" /> :
                        <FlatList 
                            data={farmList} 
                            renderItem={({item}) => <Card key={item.id} info={item} history={this.props.history}/>}
                            style={styles.list}
                        />
                }
            </View>
        )
    }

    componentDidMount() {
        this.fetchFarmList();
    }

    handlePressAdd = () => {
        this.props.history.push('/farm/add');
    }

    handlePressUser = () => {
        this.props.history.push('/user');
    }

    fetchFarmList = async () => {
        const res: IResponse = await ajax('/farm/list');
        if(res.error) {
            Toast.fail(res.msg, 1);
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
