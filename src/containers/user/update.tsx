import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { List, InputItem, TextareaItem, Toast, ImagePicker } from '@ant-design/react-native';
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
    pwd: string
}

const renderHeaderTitle = (updateType: UpdateType) => {
    switch(updateType) {
        case UpdateType.Name: 
            return '用户名修改';
        case UpdateType.Mobile:
            return '手机号修改';
        case UpdateType.Pwd:
            return '密码修改';
        default:
            return '404';
    }
}
class UserUpdate extends React.Component<IProps, IState> {

    state: IState = {
        user_name: '',
        phone_number: '',
        pwd: '' 
    }

    renderUpdateName = () => {
        const { user_name } = this.state;
        return (
            <InputItem clear/>
        );
    }
    renderUpdateMobile = () => {
        return (
            <InputItem clear/>
        );
    }
    renderUpdatePwd = () => {
        return (
            <InputItem clear/>
        );
    }
    render() {
        const { history, match } = this.props;
        const updateType: UpdateType = parseInt(match.params.type);
        return (
            <View>
                <Header title={renderHeaderTitle(updateType)} history={history} />
                {updateType === UpdateType.Name ? this.renderUpdateName() : null}
                {updateType === UpdateType.Mobile ? this.renderUpdateMobile() : null}
                {updateType === UpdateType.Pwd ? this.renderUpdatePwd() : null}
            </View>
        )
    }
}

export default connect(({user} : {user: IUserState}) => {
    return {
        user
    }
})(UserUpdate);
