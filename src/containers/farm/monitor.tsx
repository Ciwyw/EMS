import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Toast, Icon, NoticeBar } from '@ant-design/react-native';
import DatePicker from 'react-native-datepicker';
import Header from '../../components/header';
import Empty from '../../components/empty';
import ajax from '../../../services';
import { formatTime, formatDate } from '../../utils/time';
import Echarts from 'native-echarts';
import { Table, Row, Rows } from 'react-native-table-component';

interface IProps {
    history: {
        goBack: () => void
    },
    match: {
        params: {
            farmId: string,
            farmName: string
        }
    }
}

interface IState {
    envList: IEnv[],
    farmInfo: IFarm,
    date: string,
    warnList: string[],
    showWarning: boolean
}

const TODAY = formatDate();

const paramList = ['温度','湿度','光照度','氨气','H2S','CO2'];
const tableHead = [...paramList, '时间'];
class Monitor extends React.Component<IProps, IState> {
    state: IState = {
        envList: [],
        farmInfo: {},
        date: '',
        warnList: [],
        showWarning: false
    }

    private interval: number | null = null;
    private farmId: number;

    render() {   
        const { date, warnList, envList, showWarning } = this.state; 
        return (
            <ScrollView>
                <Header title={this.props.match.params.farmName} history={this.props.history}/>
                <NoticeBar 
                    icon={<Icon name="warning"/>}
                    style={{ display: showWarning ? 'flex' : 'none' }}
                    marqueeProps={{ loop: true, style: { fontSize: 14, color: '#f00' } }}
                >
                    <Text>检测到养殖场内{warnList.join(',')}异常，请立即处理！</Text>
                </NoticeBar>
                <View style={styles.body}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>环境监控</Text>
                        <DatePicker 
                            date={date}
                            mode="date"
                            format="YYYY-MM-DD"
                            minDate="2019-05-22"
                            maxDate={date}
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            onDateChange={this.handleSelectDate}
                            customStyles={{
                                dateInput: styles.dateInput
                            }}
                        />
                    </View>
                    <Echarts option={this.initEchartOption()} height={350} />
                    <Text style={{...styles.title, marginTop: 15}}>历史数据</Text>
                    <View style={styles.tableWrapper}>
                    {
                        envList.length === 0 ?
                        <Empty hint="暂无数据" /> :
                        <Table borderStyle={{borderColor: '#C1C0B9'}}>
                            <Row data={tableHead} style={styles.tableHead} textStyle={styles.textHead}/>
                            <Rows data={this.getTableData()} textStyle={styles.textBody}/>
                        </Table>
                    }
                    </View>
                </View>
            </ScrollView>
        )
    }

    componentDidMount () {
        this.farmId = parseInt(this.props.match.params.farmId);
        this.setState({
            date: TODAY
        }, () => {
            this.setTimer();
        });
        this.fetchFarmInfo();
    }

    componentWillUnmount () {
        this.clearTimer();
    }

    setTimer = async () => {
        this.fetchEnvList();
        this.interval = setInterval(() => {
            if(this.state.date !== TODAY) {
                this.clearTimer();
                return;
            }
            this.fetchEnvList();
        }, 1000 * 15);
    }

    fetchFarmInfo = async () => {
        const res: IResponse = await ajax('/farm/info', {id: this.farmId});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            farmInfo: res.data
        })
    }

    fetchEnvList = async () => {
        const { date } = this.state;
        const res: IResponse = await ajax('/farm/env', {date, id: this.farmId});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            envList: res.data
        }, () => {
            this.checkEnv();
        })
    }

    checkEnv = () => {
        const { envList, farmInfo, date } = this.state;
        if(envList.length === 0) {
            return;
        }
        const latest = envList[envList.length - 1];
        const warnList = [];
        latest.temperature > farmInfo.temp_thres && warnList.push('温度');
        latest.humidity > farmInfo.humi_thres && warnList.push('湿度');
        latest.illuminance > farmInfo.illum_thres && warnList.push('光照度');
        latest.ammonia > farmInfo.amm_thres && warnList.push('氨气浓度');
        latest.h2s > farmInfo.h2s_thres && warnList.push('H2S浓度');
        latest.co2 > farmInfo.co2_thres && warnList.push('CO2浓度');
        this.setState({ 
            warnList,
            showWarning: warnList.length !== 0 && date === TODAY
         }, () => {
             this.state.showWarning && Toast.fail('环境异常！');
         });
    }

    clearTimer = () => {
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    handleSelectDate = (date: string) => {
        this.setState({ date }, () => {
            this.setTimer();
        });
    }

    initEchartOption = () => {
        const { envList } = this.state;
        const xDates = envList.map((item) => formatTime(item.update_time));
        const chartType = 'line';
        const option = {
            title: {
                show: false
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: paramList,
                left: '22%',
                right: '20%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xDates
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: paramList[0],
                    type: chartType,
                    data: envList.map(i => i.temperature)
                },
                {
                    name: paramList[1],
                    type: chartType,
                    data: envList.map(i => i.humidity)
                },
                {
                    name: paramList[2],
                    type: chartType,
                    data: envList.map(i => i.illuminance)
                },
                {
                    name: paramList[3],
                    type: chartType,
                    data: envList.map(i => i.ammonia)
                },
                {
                    name: paramList[4],
                    type: chartType,
                    data: envList.map(i => i.h2s)
                },
                {
                    name: paramList[5],
                    type: chartType,
                    data: envList.map(i => i.co2)
                }
            ]
        };
        return option;
    }

    getTableData = () => {
        const { envList } = this.state;
        return envList.map(env => [
            env.temperature,
            env.humidity,
            env.illuminance,
            env.ammonia,
            env.h2s,
            env.co2,
            formatTime(env.update_time)
        ]).reverse();
    }
}

const styles = StyleSheet.create({
    body: {
        width: '100%',
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
        borderLeftWidth: 4,
        borderLeftColor: '#5096ff',
        paddingLeft: 10,
    },
    dateInput: {
        height: 30,
        borderColor: '#5096ff',
        borderRadius: 5
    },
    titleWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
    },
    tableWrapper: {
        width: '100%',
        marginTop: 15,
        marginBottom: 30
    },
    tableHead: {
        backgroundColor: '#fff',
        height: 35
    },
    textHead: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15
    },
    textBody: {
        textAlign: 'center',
        height: 25,
        lineHeight: 25
    }
})

export default Monitor;