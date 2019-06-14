import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { List, Icon, Button, Modal, Toast } from '@ant-design/react-native';
import { IUserState, UserRole, Sex } from '../../redux/user-reducer';
import ajax from '../../../services';
import Header from '../../components/header';

interface IProps {
    history: {
        goBack: () => void,
        push: (path: string) => void
    },
    user?: IUserState
}

interface IState {
}

const ListItem = List.Item;

class User extends React.Component<IProps, IState> {

    render () {
        const { user } = this.props;
        const isAdmin = user.role === UserRole.Admin;
        const isMale = user.sex === Sex.Male;
        return (
            <View>
                <Header title="个人中心" history={this.props.history}/>
                <View style={styles.baseinfo}>
                    <View style={styles.wrapper}>
                        <Image style={styles.avatar} source={{ uri: user.avatar}} />
                        <Icon style={styles.sex} name={isMale ? 'man' : 'woman'} color='#5096ff'/>
                    </View>
                    <Text style={styles.userName}>{user.user_name} · {isAdmin ? '管理员':'养殖工人'}</Text>
                </View>
                <List>
                    <TouchableOpacity>
                        <ListItem 
                            onPress={this.handleInfo}
                            style={styles.listItem} 
                            arrow="horizontal" 
                            thumb={<Icon style={styles.icon} name="user" color="#3194d0"/>}
                        >
                            个人信息
                        </ListItem>
                    </TouchableOpacity>
                   {
                       isAdmin ?
                       <ListItem    
                            onPress={this.handleEmploy}
                            arrow="horizontal" 
                            thumb={<Icon style={styles.icon} name="bulb" color="#42c02d"/>}
                        >
                            工人管理
                        </ListItem> : null
                   }
                    <ListItem 
                        arrow="horizontal" 
                        thumb={<Icon style={styles.icon} 
                        name="setting" 
                        color="#2998f0"/>}
                    >
                        更多
                    </ListItem>
                </List>
                <Button 
                    type="primary" 
                    style={styles.btn}
                    onPress={this.handleLogout}
                >
                    退出登录
                </Button>
            </View>
        )
    }

    handleInfo = () => {
        this.props.history.push('/user/detail');
    }

    handleEmploy = () => {
        this.props.history.push('/employee');
    }

    handleLogout = () => {
        Modal.alert('确定要退出吗？', '', [
            {
                text: '确定',
                onPress: async () => {
                    const res: IResponse = await ajax('/user/logout');
                    if(res.error) {
                        Toast.fail('网络出现问题', 1);
                        return;
                    }
                    this.props.history.push('/login');
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
    baseinfo: {
        width: '100%',
        backgroundColor: "#fff",
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15
    },
    wrapper: {
        position: 'relative'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    sex: {
        position: 'absolute',
        bottom: -6,
        right: 13
    },
    userName: {
        color: '#5096ff',
        fontSize: 16,
        marginTop: 10
    },
    userRole: {
        fontSize: 13
    },
    listItem: {
        height: 50
    },
    icon: {
        marginRight: 10
    },
    btn: {
        width: '90%',
        borderWidth: 0,
        alignSelf: 'center',
        marginTop: 50
    }
})

export default connect(({user} : {user: IUserState}) => {
    return {
        user
    }
})(User);