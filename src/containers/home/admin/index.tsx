import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Toast } from '@ant-design/react-native';
import ajax from '../../../../services';
import { IUserState } from '../../../redux/user-reducer';
import Header from '../../../components/header';
import Icon from '../../../components/icon';
import Empty from '../../../components/empty';
import Card from './card';

interface IProps {
    history: {
        push: (path: string) => void
    },
    avatar?: string
}

interface IState {
    farmList: IFarm[],
}

class Admin extends React.Component<IProps, IState> {
    
    state: IState = {
        farmList: []
    }
    render() {
        const {  farmList } = this.state;
        const src = this.props.avatar ? { uri: this.props.avatar} : require('../../../assets/avatar.png');
        const headerLeft = (
            <TouchableOpacity onPress={this.handlePressUser}>
                <Image source={src} style={styles.avatar}/>
            </TouchableOpacity>);
        const headerRight = <Icon name="plus" color="#fff" onPress={this.handlePressAdd}/>;
        return (
            <View>
                <Header 
                    title="养殖场" 
                    left={headerLeft}
                    right={headerRight}
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
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15
    }
})

export default connect((state: IUserState) => {
    return {
        avatar: state.avatar
    }
})(Admin);
