import React from 'react';
import { View, Text, Picker, Image } from 'react-native';
import { Button, InputItem, Icon, Toast } from '@ant-design/react-native';
import ajax from '../../../services';
import { UserRole } from '../../redux/user-reducer';

import styles from './style';
interface IProps {
    history: {
        goBack: () => void
    }
}
interface IState {
    name: string,
    pwd: string,
    role: UserRole
}
class Login extends React.Component<IProps, IState> {

    state: IState = {
        name: '',
        pwd: '',
        role: UserRole.Employee
    }

    render() {
        const { name, pwd, role } = this.state
        return (
            <View style={styles.login}>
                <Image source={require('../../assets/logo.png')} style={styles.header}/>
                <View style={styles.inputArea}>
                    <InputItem
                        clear
                        value={name}
                        onChange={this.handleNameChange}
                        style={styles.input}
                        labelNumber={2}
                        placeholder="请输入用户名"
                    >
                        <Icon name="user" size="sm" />
                    </InputItem>
                </View>
                <InputItem
                    clear
                    value={pwd}
                    onChange={this.handlePwdChange}
                    type="password"
                    style={styles.input}
                    labelNumber={2}
                    placeholder="请输入密码"
                >
                    <Icon name="tool" size="sm" />
                </InputItem>
                <Picker 
                    style={styles.rolepicker}
                    selectedValue={role}
                    onValueChange={this.handleRoleChange}
                >
                    <Picker.Item label="养殖员工" value={UserRole.Employee} />
                    <Picker.Item label="管理员" value={UserRole.Admin} />
                </Picker>
                <Button 
                    type="primary" 
                    style={styles.btn}
                    activeStyle={styles.activeBtn}
                    disabled={!name || !pwd}
                    onPress={this.handleLogin}
                >
                    登录
                </Button>
            </View>
        )
    }

    handleNameChange = (name: string) => {
        this.setState({
            name
        })
    }

    handlePwdChange = (pwd: string) => {
        this.setState({
            pwd
        })
    }

    handleRoleChange = (role: UserRole) => {
        this.setState({
            role
        })
    }

    handleLogin = async () => {
        const res: IResponse = await ajax('/user/login', this.state);
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        this.props.history.goBack();
    }
}

export default Login;
