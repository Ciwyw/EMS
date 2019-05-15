import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { createForm } from 'rc-form';
import { List, InputItem, Picker, TextareaItem, Button, Toast, Icon, ImagePicker } from '@ant-design/react-native';
import ajax from '../../../services';
import upload from '../../utils/upload';
import { requestCameraPermission } from '../../utils/permission';
import Header from '../../components/header';

interface IProps {
    history: {
        goBack: () => void
    },
    match: {
        params: {
            id: string
        }
    },
    form: any
}

interface IState {
    files: IFile[],
    uri: string
}

class Farm extends React.Component<IProps, IState> {

    state: IState = {
        files: [],
        uri: ''
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { files } = this.state;
        const rightFragment = (
            <TouchableOpacity onPress={this.handleSubmit}>
                <View><Text>保存</Text></View>
            </TouchableOpacity>
        );
        return (
            <View>
                <Header 
                    title="新增养殖场" 
                    history={this.props.history}
                    right={rightFragment}
                />
                <List renderHeader="基本信息">
                    {
                        getFieldDecorator('farm_name',{
                            rules: [{ required: true }]
                        })(
                            <InputItem clear>名称</InputItem>
                        )
                    }

                    <List.Item
                        extra={
                            <ImagePicker 
                                files={files} 
                                selectable={files.length < 1}
                                onChange={this.handlePickImage}
                            />}
                        multipleLine
                    >
                        上传图片
                    </List.Item>
                    {
                        getFieldDecorator('stall_num',{
                            rules: [{ required: true }],
                            normalize: (val: string) => parseInt(val)
                        })(
                            <InputItem clear type="number">牛舍数量</InputItem>
                        )
                    }
                    {
                        getFieldDecorator('address',{
                            rules: [{ required: true }]
                        })(
                            <TextareaItem rows={4} placeholder="养殖场地址" /> 
                        )
                    }
                </List>
                <List renderHeader="环境参数阈值">
                    {
                        getFieldDecorator('temp_thres',{
                            normalize: (val: string) => val && parseFloat(val)
                        })(
                            <InputItem clear type="number">温度</InputItem>
                        )
                    }
                    {
                        getFieldDecorator('humi_thres',{
                            normalize: (val: string) => val && parseFloat(val)

                        })(
                            <InputItem clear type="number">湿度</InputItem>
                        )
                    }
                    {
                        getFieldDecorator('illum_thres',{
                            normalize: (val: string) => val && parseFloat(val)

                        })(
                            <InputItem clear type="number">光照度</InputItem>
                        )
                    }
                    {
                        getFieldDecorator('amm_thres',{
                            normalize: (val: string) => val && parseFloat(val)

                        })(
                            <InputItem clear type="number">氨气</InputItem>
                        )
                    }
                    {
                        getFieldDecorator('h2s_thres',{
                            normalize: (val: string) => val && parseFloat(val)

                        })(
                            <InputItem clear type="number">硫化氢</InputItem>
                        )
                    }
                    {
                        getFieldDecorator('co2_thres',{
                            normalize: (val: string) => val && parseFloat(val)

                        })(
                            <InputItem clear type="number">CO2</InputItem>
                        )
                    }
                </List>
            </View>
        )
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if(!id.trim()) { //新增
            const auth = requestCameraPermission();
            if(!auth) {
                this.props.history.goBack();
            }
            return;
        }
        this.fetchFarmInfo(id);
    }

    fetchFarmInfo = async (id: string) => {
        const res: IResponse = ajax('/farm/info', {id});
        if(res.error) {
            Toast.fail(res.msg);
            return;
        }
        console.log(res);
        this.setState({ ...res.data });

    }

    handlePickImage = async ( files: IFile[]) => {
        const res: IResponse = await upload(files[0].url);
        if(res.error) {
            Toast.fail('图片上传失败');
            return;
        }
        Toast.success('图片上传成功', 2);
        this.setState({
            files,
            uri: res.data.uri
        }, () => {
            console.log(this.state.uri);
        });
    }

    handleSubmit = () => {
        const { uri } = this.state;
        this.props.form.validateFields( async (error: any,values: any) => {
            if(error) {
                Toast.fail('请完善所有信息！');
                return;
            }
            if(!uri) {
                Toast.fail('请上传养殖场图片！');
                return;
            }
            const res: IResponse = await ajax('/farm/add', {
                ...values,
                district: values.district.join(),
                image: uri
            })
            if(res.error) {
                Toast.fail(res.msg, 2);
                return;
            }
            Toast.success('添加成功', 1);
            setTimeout(() => {
                this.props.history.goBack();
            }, 1000);
        });
    }
}

export default createForm()(Farm);