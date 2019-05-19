import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Image } from 'react-native';
import { List, Icon } from '@ant-design/react-native';
import { IUserState, UserRole } from '../../redux/user-reducer';
import Header from '../../components/header';

interface IProps {
    history: {
        goBack: () => void
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
        const src = user.avatar ? { uri: user.avatar} : require('../../assets/avatar.png');
        return (
            <View>
                <Header title="个人中心" history={this.props.history}/>
                <View style={styles.baseinfo}>
                    <Image style={styles.avatar} source={src} />
                    <Text style={styles.userName}>{user.user_name} · {isAdmin ? '管理员':'养殖工人'}</Text>
                </View>
                <List>
                    <ListItem 
                        style={styles.listItem} 
                        arrow="horizontal" 
                        thumb={<Icon style={styles.icon} name="user" color="#3194d0"/>}
                    >
                        个人信息
                    </ListItem>
                   {
                       isAdmin ?
                       <ListItem 
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
            </View>
        )
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
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    userName: {
        color: '#f45a8d',
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
    }
})

export default connect(({user} : {user: IUserState}) => {
    return {
        user
    }
})(User);