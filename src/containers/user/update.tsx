import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { InputItem, Toast, List } from '@ant-design/react-native';
import ajax from '../../../services';
import { userFetchInfo } from '../../redux/user-action';
import store from '../../redux/user-store';
import Header from '../../components/header';
import { IUserState } from '../../redux/user-reducer';

export enum UpdateType {
    Name,
    Mobile,
    Pwd
}

interface IProps {
    history: {
        goBack: () => void
    },
    match: {
        params: {
            type: string
        }
    },
    user?: IUserState
}

interface IState {
    user_name: string,
    phone_number: string,
    old_pwd: string,
    new_pwd: string,
    confirm_pwd: string
}

const renderRight = (fn: () => void) => {
    return (
        <TouchableOpacity onPress={fn}>
            <View><Text style={{ color: '#fff' }}>保存</Text></View>
        </TouchableOpacity>
    )
}

const ListItem = List.Item;
class UserUpdate extends React.Component<IProps, IState> {

    state: IState = {
        user_name: this.props.user.user_name,
        phone_number: this.props.user.phone_number,
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
    }

    renderUpdateName = () => {
        const { user_name } = this.state;
        return (
            <View>
                <Header 
                    title="用户名修改" 
                    right={renderRight(this.handleSubmitName)} 
                    history={this.props.history}
                />
                <InputItem 
                    value={user_name} 
                    clear
                    onChange={(val: string) => this.handleChangeState('user_name', val)}
                />
            </View>
        );
    }
    
    renderUpdateMobile = () => {
        const { phone_number } = this.state;
        return (
            <View>
                <Header 
                    title="手机号修改" 
                    right={renderRight(this.handleSubmitMobile)} 
                    history={this.props.history}
                />
                <InputItem 
                    value={phone_number} 
                    clear
                    onChange={(val: string) => this.handleChangeState('phone_number', val)}
                />
            </View>
        );
    }

    renderUpdatePwd = () => {
        const { old_pwd, new_pwd, confirm_pwd } = this.state;
        return (
            <View>
                <Header 
                    title="密码修改" 
                    right={renderRight(this.handleSubmitPwd)} 
                    history={this.props.history}
                />
                <List>
                    <InputItem 
                        value={old_pwd} 
                        clear
                        type="password"
                        onChange={(val: string) => this.handleChangeState('old_pwd', val)}
                        placeholder="请输入原密码"
                    >
                        原密码
                    </InputItem>
                    <InputItem 
                        value={new_pwd} 
                        clear
                        type="password"
                        onChange={(val: string) => this.handleChangeState('new_pwd', val)}
                        placeholder="请输入新密码"
                    >
                        新密码
                    </InputItem>
                    <InputItem 
                        value={confirm_pwd} 
                        clear
                        type="password"
                        onChange={(val: string) => this.handleChangeState('confirm_pwd', val)}
                        placeholder="请再次输入密码"
                    >
                        确认密码
                    </InputItem>
                </List>
            </View>
        );
    }

    renderUpdate = () => {
        const updateType: UpdateType = parseInt(this.props.match.params.type);
        switch(updateType) {
            case UpdateType.Name: 
                return this.renderUpdateName();
            case UpdateType.Mobile:
                return this.renderUpdateMobile();
            case UpdateType.Pwd:
                return this.renderUpdatePwd();
            default:
                return;
        }
    }

    render() {
        return (
            <View>{this.renderUpdate()}</View>
        )
    }

    handleChangeState = (key: string, val: string) => {
        this.setState({
            [key]: val
        })
    }

    handleSubmitName = async () => {
        const { user_name } = this.state;
        if(!user_name) {
            Toast.fail('请输入用户名!',1);
            return;
        }
        const res: IResponse = await ajax('/user/update/name', {user_name});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        Toast.success('修改成功!',1);
        store.dispatch(userFetchInfo({user_name}));
        this.props.history.goBack();
    }

    handleSubmitMobile = async () => {
        const { phone_number } = this.state;
        if(!phone_number || !/^1\d{10}$/.test(phone_number)) {
            Toast.fail('请输入正确的手机号!',1);
            return;
        }
        const res: IResponse = await ajax('/user/update/mobile', {phone_number});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        Toast.success('修改成功!',1);
        store.dispatch(userFetchInfo({phone_number}));
        this.props.history.goBack();
    }

    handleSubmitPwd = async () => {
        const { old_pwd, new_pwd, confirm_pwd } = this.state;
        if(!old_pwd || !new_pwd || !confirm_pwd) {
            Toast.fail('请输入密码！', 1);
            return;
        }
        if(new_pwd !== confirm_pwd) {
            Toast.fail('密码不一致!', 1);
            return;
        }
        const res: IResponse = await ajax('/user/update/pwd', {old_pwd, new_pwd});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        Toast.success('修改成功!',1);
        this.props.history.goBack();
    }
}

export default connect(({user} : {user: IUserState}) => {
    return {
        user
    }
})(UserUpdate);
