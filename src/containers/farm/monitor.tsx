import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Toast } from '@ant-design/react-native';
import DatePicker from 'react-native-datepicker';
import Header from '../../components/header';
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
    date: string
}

const paramList = ['温度','湿度','光照度','氨气','H2S','CO2'];
const tableHead = [...paramList, '时间'];
class Monitor extends React.Component<IProps, IState> {
    state: IState = {
        envList: [],
        date: ''
    }
    render() {   
        const { date } = this.state;  
        return (
            <View>
                <Header title={this.props.match.params.farmName} history={this.props.history}/>
                <View style={styles.body}>
                    <View>
                        <Text style={styles.chartTitle}>养殖场环境变化趋势图</Text>
                        <DatePicker 
                            date={date}
                            mode="date"
                            format="YYYY-MM-DD"
                            minDate="2019-05-18"
                            maxDate={date}
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            onDateChange={this.handleSelectDate}
                            style={styles.datePicker}
                        />
                    </View>
                    <Echarts option={this.initEchartOption()} height={350} />
                    <View style={styles.tableWrapper}>
                        <Table>
                            <Row data={tableHead}/>
                            <Rows data={this.initTableData()}/>
                        </Table>
                    </View>
                </View>
            </View>
        )
    }

    componentDidMount () {
        this.circleFetchEnvData();
        this.setState({
            date: formatDate()
        }, () => {
            console.log(this.state.date, 'date')
        });
    }

    circleFetchEnvData = async () => {
        const id = parseInt(this.props.match.params.farmId);
        const res: IResponse = await ajax('/farm/env', {id});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            envList: res.data
        }, () => {
            console.log(this.state.envList, 'envList')
        })
    }

    handleSelectDate = (date: string) => {
        this.setState({ date });
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
                data: paramList
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

    initTableData = () => {
        const { envList } = this.state;
        return envList.map(env => [
            env.temperature,
            env.humidity,
            env.illuminance,
            env.ammonia,
            env.h2s,
            env.co2,
            formatTime(env.update_time)
        ])
    }
}

const styles = StyleSheet.create({
    body: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 19,
        fontWeight: '500'
    },
    datePicker: {
        alignSelf: 'center'
    },
    tableWrapper: {
        width: '100%'
    }
})

export default Monitor;