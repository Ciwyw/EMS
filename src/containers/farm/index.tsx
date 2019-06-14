import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { List, Toast, Modal, SwipeAction, Icon } from '@ant-design/react-native';
import ajax from '../../../services';
import Header from '../../components/header';
import { IUserState } from '../../redux/user-reducer';

interface IProps {
    history: {
        push: (path: string) => void,
        goBack: () => void
    },
    match?: {
        params: {
            id: string
        }
    },
    user?: IUserState,
    asEmploy?: boolean
}

interface IState {
    farmInfo: IFarm
}

const Item = List.Item;
class Farm extends React.Component<IProps, IState> {
    state: IState = {
        farmInfo: {}
    }

    private id: number;

    renderAction = () => {
        const rightAction = [
            {
                text: '编辑',
                onPress: () => this.handleEdit(),
                style: { backgroundColor: '#87CEFA', color: '#fff' },
            }
        ];
        const deleteItem = {
            text: '删除',
            onPress: () => this.handleDelete(),
            style: { backgroundColor: '#FFC1C1', color: '#fff' },
        };
        return !this.props.asEmploy && [...rightAction, deleteItem] || rightAction;
    }

    render() {
        const { farmInfo } = this.state;
        const { user, asEmploy, history } = this.props;
        return (
            <View style={styles.farm}>
                <Header 
                    title={farmInfo.farm_name} 
                    avatar={asEmploy ? user.avatar : ''}
                    history={history}
                />
                <SwipeAction autoClose right={this.renderAction()} style={{ backgroundColor: '#fff' }}>
                    <View style={styles.baseinfo}>
                        <Image style={styles.image} source={{ uri: farmInfo.image }} />
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
                    <Item extra={<Text>{farmInfo.illum_thres}</Text>} arrow="empty">光照度 (lux)</Item>
                    <Item extra={<Text>{farmInfo.amm_thres}</Text>} arrow="empty">氨气 (mg/m3)</Item>
                    <Item extra={<Text>{farmInfo.h2s_thres}</Text>} arrow="empty">H2S (mg/m3)</Item>
                    <Item extra={<Text>{farmInfo.co2_thres}</Text>} arrow="empty">CO2 (ppm)</Item>
                </List>
                <TouchableOpacity style={styles.monitor} onPress={this.handleMonitor}>
                    <Text style={styles.text}>环境监控</Text>
                    <Icon name="right" color="#fff" size="xs"/>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        const { user, match, asEmploy } = this.props;
        this.id = asEmploy ? user.farm_id : parseInt(match.params.id);
        this.fetchFarmInfo();
    }

    fetchFarmInfo = async () => {
        const res: IResponse = await ajax('/farm/info', {id: this.id});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            farmInfo: res.data
        })
    }

    handleMonitor = () => {
        const { farm_name } = this.state.farmInfo;
        this.props.history.push(`/monitor/${this.id}/${farm_name}`);

    }

    handleEdit = () => {
        this.props.history.push(`/farm/edit/${this.id}`);
    }

    handleDelete = () => {
        Modal.alert('确认要删除当前养殖场？', '', [
            {
                text: '删除',
                onPress: async () => {
                    const res: IResponse = await ajax('/farm/delete', {id: this.id});
                    if(res.error) {
                        Toast.fail(res.msg, 1);
                        return;
                    }
                    Toast.success('删除成功', 1);
                    setTimeout(() => {
                        this.props.history.goBack();
                    }, 0);
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
        width: 100,
        height: 40,
        position: 'absolute',
        right: 0,
        bottom: 120,
        backgroundColor: '#5096ff',
        paddingLeft: 10,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        flexDirection: 'row',
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
