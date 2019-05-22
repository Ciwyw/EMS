import React from 'react';
import { View } from 'react-native';
import {  Toast, List } from '@ant-design/react-native';
import Header from '../../components/header';
import Icon from '../../components/icon';
import Empty from '../../components/empty';
import { IUserState, UserRole } from '../../redux/user-reducer';
import ajax from '../../../services';

interface IProps {
    history: {
        goBack: () => void,
        push: (path: string) => void
    },
}

interface IState {
    employeeList: IUserState[]
}

const ListItem = List.Item;

export default class Employee extends React.Component<IProps, IState> {
    state: IState = {
        employeeList: []
    }
    render() {
        const { employeeList } = this.state;
        const headerRight = <Icon name="plus" color="#fff" onPress={this.handlePressAdd}/>;
        return (
            <View>
                <Header title="工人管理" right={headerRight} history={this.props.history}/>
                {
                    employeeList.length === 0 ?
                    <Empty hint="还没有工人数据，点击右上角添加吧～" /> :
                    <List>
                        {
                            employeeList.map((employee) => (
                                <ListItem
                                    key={employee.id} 
                                    thumb={employee.avatar}
                                    onPress={() => this.handleGetDetail(employee.id)}
                                    arrow="horizontal"
                                >
                                    {employee.user_name}
                                </ListItem>
                            ))
                        }
                    </List>
                }
            </View>
        )
    }

    componentDidMount() {
        this.fetchEmployeeList();
    }

    fetchEmployeeList = async () => {
        const res: IResponse = await ajax('/user/rolelist', {role: UserRole.Employee});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            employeeList: res.data
        })
    }

    handlePressAdd = () => {
        this.props.history.push('/employee/add');
    }

    handleGetDetail = (id: number) => {
        this.props.history.push(`/employee/${id}`);
    }
}
