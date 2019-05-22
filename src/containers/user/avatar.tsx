import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { ImagePicker, Toast } from '@ant-design/react-native';
import { IUserState } from '../../redux/user-reducer';
import ajax from '../../../services';
import { requestCameraPermission } from '../../utils/permission';
import upload from '../../utils/upload';
import { userFetchInfo } from '../../redux/user-action';
import store from '../../redux/user-store';
import Header from '../../components/header';

interface IProps {
    history: {
        goBack: () => void
    },
    avatar?: string
}

interface IState {
}

class UserAvatar extends React.Component<IProps, IState> {

    renderHeaderRight = () => {
        return (
            <TouchableHighlight>
                <ImagePicker onChange={this.handlePickImage} />
            </TouchableHighlight>
        )
    }
    render() {
        const { history, avatar } = this.props;
        return (
            <View>
                <Header title="头像" history={history} right={this.renderHeaderRight()}/>
                <View style={styles.body}>
                    <Image style={styles.image} source={{ uri: avatar}}/>
                </View>
            </View>
        )
    }
    
    componentDidMount() {
        const auth = requestCameraPermission();
        if(!auth) {
            this.props.history.goBack();
        }
        return;
    }

    handlePickImage = async ( files: IFile[]) => {
        const uploadRes: IResponse = await upload(files[0].url);
        if(uploadRes.error) {
            Toast.fail('头像上传失败', 1);
            return;
        }
        const avatar = uploadRes.data.url;
        const res: IResponse = await ajax('/user/update/avatar', {avatar});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        store.dispatch(userFetchInfo({avatar}));
        Toast.success('头像上传成功', 1);
    }
}


const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingTop: 200,
    },
    image: {
        width: 380,
        height: 380
    }
})

export default connect(({user} : {user: IUserState}) => {
    return {
        avatar: user.avatar
    }
})(UserAvatar);