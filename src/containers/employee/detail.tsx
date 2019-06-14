import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ajax from '../../../services';
import { List, Toast, Button, Modal } from '@ant-design/react-native';
import { IUserState } from '../../redux/user-reducer';
import Header from '../../components/header';

interface IProps {
    history: {
        push: (path: string) => void,
        goBack: () => void
    },
    match: {
        params: {
            id?: string
        }
    }
}

interface IState {
    employeeInfo: IUserState
}

const ListItem = List.Item;

export default class EmployDetail extends React.Component<IProps, IState> {

    state: IState = {
        employeeInfo: {}
    }

    render() {
        const { employeeInfo } = this.state;
        const headerRight = (
            <TouchableOpacity onPress={this.handleEdit}>
                <View><Text style={{ color: '#fff' }}>编辑</Text></View>
            </TouchableOpacity>
        );
        return (
            <View>
                <Header title="职工详情" right={headerRight} history={this.props.history}/>
                <List>
                    <ListItem extra={employeeInfo.user_name} arrow="empty">姓名</ListItem>
                    <ListItem extra={employeeInfo.sex === 1 ? '女':'男'} arrow="empty">性别</ListItem>
                    <ListItem extra={employeeInfo.phone_number} arrow="empty">手机号</ListItem>
                    <ListItem extra={employeeInfo.farm_name} arrow="empty">养殖场</ListItem>
                </List>
                <Button 
                    type="primary" 
                    onPress={this.handleDelete}
                    style={styles.btn}
                >
                    删除
                </Button>
            </View>
        )
    }
    componentDidMount() {
        this.fetchEmployeeInfo();
    }

    fetchEmployeeInfo = async () => {
        const id = parseInt(this.props.match.params.id);
        const res: IResponse = await ajax('/user/check', { id });
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.setState({
            employeeInfo: res.data
        })
    }

    handleEdit = () => {
        const id = parseInt(this.props.match.params.id);
        this.props.history.push(`/employee/edit/${id}`);
    }

    handleDelete = async () => {
        const id = parseInt(this.props.match.params.id);
        Modal.alert('确定要删除吗？', '', [
            {
                text: '确定',
                onPress: async () => {
                    const res: IResponse = await ajax('/user/delete', { id });
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
    btn: {
        width: '90%',
        borderWidth: 0,
        alignSelf: 'center',
        marginTop: 50
    }
})
