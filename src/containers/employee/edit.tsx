import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { List, InputItem, Picker, Toast } from '@ant-design/react-native';
import { createForm } from 'rc-form';
import ajax from '../../../services';
import config from '../../../services/config';
import { IUserState, UserRole } from '../../redux/user-reducer';
import Header from '../../components/header';

interface IFarmPicker {
    value: number,
    label: string
}

interface IProps {
    history: {
        goBack: () => void
    },
    match: {
        params: {
            id?: string
        }
    },
    form: any
}

interface IState {
    employeeInfo: IUserState,
    farmList: IFarmPicker[],
    isUpdate: boolean
}

const ListItem = List.Item;

const sexList = [
    {
        value: 1,
        label: '女'
    },
    {
        value: 2,
        label: '男'
    }
];

const DEFAULT_PWD = '123456';
const DEFAULT_AVATAR = `${config.BASE_URL}/images/avatar.png`;

const formatFarmList = (farmList: IFarm[]) => {
    return farmList.map(farm => {
        return {
            value: farm.id,
            label: farm.farm_name
        }
    })
}

class EmployeeEdit extends React.Component<IProps, IState> {

    state: IState = {
        employeeInfo: {},
        farmList: [],
        isUpdate: false
    }

    render() {
        const { employeeInfo, farmList, isUpdate } = this.state;
        const { getFieldDecorator } = this.props.form;
        const headerRight = (
            <TouchableOpacity onPress={this.handleSubmit}>
                <View><Text style={{ color: '#fff' }}>保存</Text></View>
            </TouchableOpacity>
        );
        const headerTitle = isUpdate ? '编辑信息' : '新增工人';
        return (
            <View>
                <Header title={headerTitle} right={headerRight} history={this.props.history}/>
                <List>
                {
                    getFieldDecorator('user_name',{
                            initialValue: employeeInfo.user_name,
                            rules: [{ required: true }]
                    })(
                        <InputItem clear>姓名</InputItem>
                    )
                }
                {
                    getFieldDecorator('sex',{
                            initialValue: [employeeInfo.sex],
                            rules: [{ required: true }]
                    })(
                        <Picker data={sexList} cols={1}>
                            <ListItem arrow="horizontal">性别</ListItem>
                        </Picker>
                    )
                }
                {
                    getFieldDecorator('phone_number',{
                            initialValue: employeeInfo.phone_number,
                            rules: [{ required: true }]
                    })(
                        <InputItem clear>手机号</InputItem>
                    )
                }
                {
                    getFieldDecorator('farm_id',{
                            initialValue: [employeeInfo.farm_id],
                            rules: [{ required: true }]
                    })(
                        <Picker data={farmList} cols={1}>
                            <ListItem arrow="horizontal">养殖场</ListItem>
                        </Picker>
                    )
                }
                </List>
            </View>
        )
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if(id) { //编辑
            this.fetchEmployeeInfo(parseInt(id));
        }
        this.fetchFarmList();
    }

    fetchEmployeeInfo = async (id: number) => {
        const res: IResponse = await ajax('/user/check', { id });
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            employeeInfo: res.data,
            isUpdate: true
        })
    }

    fetchFarmList = async () => {
        const res: IResponse = await ajax('/farm/list');
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            farmList: formatFarmList(res.data)
        });
    }

    handleSubmit = () => {
        const { farmList, isUpdate } = this.state;
        this.props.form.validateFields( async (error: any,values: any) => {
            if(error) {
                Toast.fail('请完善所有信息！', 1);
                return;
            }
            if(!/^1\d{10}$/.test(values.phone_number)) {
                Toast.fail('请输入正确的手机号!', 1);
                return;
            }
            const farm_id = values.farm_id[0];
            const farm_name = farmList.find((farm) => farm.value === farm_id).label;
            const api = isUpdate ? '/user/update' : '/user/add';
            const res: IResponse = await ajax(api, {
                ...values,
                farm_id,
                farm_name,
                sex: values.sex[0],
                role: UserRole.Employee,
                password: DEFAULT_PWD,
                avatar: DEFAULT_AVATAR,
                id: parseInt(this.props.match.params.id)
            })
            if(res.error) {
                Toast.fail(res.msg, 1);
                return;
            }
            Toast.success('保存成功', 1);
            setTimeout(() => {
                this.props.history.goBack();
            });
        })
    }
}

export default createForm()(EmployeeEdit);
