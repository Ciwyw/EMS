import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { List, Toast, Modal, SwipeAction, Icon } from '@ant-design/react-native';
import ajax from '../../../services';
import Header from '../../components/header';

interface IProps {
    history: {
        push: (path: string) => void,
        goBack: () => void
    },
    match: {
        params: {
            id: string
        }
    }
}

interface IState {
    farmInfo: IFarm
}

const Item = List.Item;
class Farm extends React.Component<IProps, IState> {
    state: IState = {
        farmInfo: {}
    }

    render() {
        const { farmInfo } = this.state;
        const rightAction = [
            {
                text: '编辑',
                onPress: () => this.handleEdit(),
                style: { backgroundColor: 'rgb(39, 120, 255)', color: '#fff' },
            },
            {
                text: '删除',
                onPress: () => this.handleDelete(),
                style: { backgroundColor: '#f00', color: '#fff' },
            }
        ]
        return (
            <View style={styles.farm}>
                <Header title={farmInfo.farm_name} history={this.props.history}/>
                <SwipeAction autoClose right={rightAction} style={{ backgroundColor: '#fff' }}>
                    <View style={styles.baseinfo}>
                        <Image style={styles.image} source={{ uri: farmInfo.image || ''}} />
                        <View style={styles.detail}>
                            <Text style={styles.farmName}>{farmInfo.farm_name}</Text>
                            <Text>{farmInfo.stall_num}间牛舍</Text>
                            <Text>{farmInfo.address}</Text>
                        </View>
                    </View>
                </SwipeAction>
                <List renderHeader="环境参数阈值">
                    <Item extra={<Text>{farmInfo.temp_thres}</Text>} arrow="empty">温度 (℃)</Item>
                    <Item extra={<Text>{farmInfo.humi_thres}</Text>} arrow="empty">湿度 (%)</Item>
                    <Item extra={<Text>{farmInfo.illum_thres}</Text>} arrow="empty">光照度 (lx)</Item>
                    <Item extra={<Text>{farmInfo.amm_thres}</Text>} arrow="empty">氨气 (ppm)</Item>
                    <Item extra={<Text>{farmInfo.h2s_thres}</Text>} arrow="empty">H2S (ppm)</Item>
                    <Item extra={<Text>{farmInfo.co2_thres}</Text>} arrow="empty">CO2 (ppm)</Item>
                </List>
                <View style={styles.monitor}>
                    <TouchableOpacity onPress={this.handleMonitor}>
                        <Text style={styles.text}>环境监控</Text>
                    </TouchableOpacity>                    
                </View>
            </View>
        )
    }

    componentDidMount() {
        this.fetchFarmInfo();
    }

    fetchFarmInfo = async () => {
        const id = parseInt(this.props.match.params.id);
        const res: IResponse = await ajax('/farm/info', {id});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            farmInfo: res.data
        })
    }

    handleMonitor = () => {
        const { id, farm_name } = this.state.farmInfo;
        this.props.history.push(`/monitor/${id}/${farm_name}`);

    }

    handleEdit = () => {
        this.props.history.push(`/farm/edit/${this.props.match.params.id}`);
    }

    handleDelete = () => {
        Modal.alert('确认要删除当前养殖场？', '', [
            {
                text: '删除',
                onPress: async () => {
                    const id = parseInt(this.props.match.params.id);
                    const res: IResponse = await ajax('/farm/delete', {id});
                    if(res.error) {
                        Toast.fail(res.msg, 1);
                        return;
                    }
                    Toast.success('删除成功', 1);
                    this.props.history.goBack();
                }
            },
            {
                text: '取消',
                onPress: async () => {}
            }
        ])
    }
}

const styles = StyleSheet.create({
    farm: {
        height: '100%',
        position: 'relative'
    },
    monitor: {
        width: 90,
        height: 40,
        position: 'absolute',
        right: 0,
        bottom: 120,
        backgroundColor: '#f45a8d',
        paddingLeft: 15,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 15
    },
    baseinfo: {
        width: '100%',
        padding: 15,
        backgroundColor: "#fff",
        flexDirection: 'row'
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 10
    },
    detail: {
        justifyContent: 'center'
    },
    farmName: {
        fontSize: 18,
        marginBottom: 7,
        color: '#000'
    },
    address: {
        flexDirection: 'row'
    }
})

export default Farm;
