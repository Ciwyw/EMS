import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, StyleSheet } from 'react-native';
import { List, ImagePicker, Toast } from '@ant-design/react-native';
import { IUserState, UserRole } from '../../redux/user-reducer';
import upload from '../../utils/upload';
import Header from '../../components/header';
import { UpdateType } from './update';

interface IProps {
    history: {
        push: (path: string) => void,
        goBack: () => void
    },
    user?: IUserState
}

interface IState {
}

const ListItem = List.Item;

class UserDetail extends React.Component<IProps, IState> {

    render() {
        const { user } = this.props;
        const avatarFragement = <Image source={{uri: user.avatar}} style={styles.avatar}/>;
        const role = user.role === UserRole.Admin ? '管理员':'养殖工人';
        return (
            <View>
                <Header title="个人中心" history={this.props.history}/>
                <List>
                    <ListItem onPress={this.handldCheckAvatar} extra={avatarFragement} arrow="horizontal">头像</ListItem>
                    <ListItem onPress={this.handleUpdate.bind(this, UpdateType.Name)} extra={user.user_name} arrow="horizontal">用户名</ListItem>
                    <ListItem extra={role}>身份</ListItem>
                    <ListItem onPress={this.handleUpdate.bind(this, UpdateType.Mobile)} extra={user.phone_number} arrow="horizontal">手机号</ListItem>
                </List>
                <List style={styles.actions}>
                    <ListItem onPress={this.handleUpdate.bind(this, UpdateType.Pwd)} arrow="horizontal">密码修改</ListItem>
                </List>
            </View>
        )
    }

    handldCheckAvatar = () => {
        this.props.history.push('/user/avatar');
    }

    handleUpdate (type: UpdateType) {
        this.props.history.push(`/user/update/${type}`);
    }
}

const styles = StyleSheet.create({
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    actions: {
        marginTop: 15
    }
})

export default connect(({user} : {user: IUserState}) => {
    return {
        user
    }
})(UserDetail);
