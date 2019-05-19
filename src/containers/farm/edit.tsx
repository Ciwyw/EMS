import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createForm } from 'rc-form';
import { List, InputItem, TextareaItem, Button, Toast, Icon, ImagePicker } from '@ant-design/react-native';
import ajax from '../../../services';
import upload from '../../utils/upload';
import { requestCameraPermission } from '../../utils/permission';
import InputNumber from '../../components/input-number';
import Header from '../../components/header';

interface IProps {
    history: {
        goBack: () => void
    },
    match: {
        params: {
            id?: string
        }
    },
    form: any
}

interface IState {
    files: IFile[],
    uri: string,
    farmInfo: IFarm,
    edit: boolean
}

const Item = List.Item;

class Farm extends React.Component<IProps, IState> {

    state: IState = {
        files: [],
        uri: '',
        farmInfo: {},
        edit: false
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { files, farmInfo, edit } = this.state;
        const rightFragment = (
            <TouchableOpacity onPress={this.handleSubmit}>
                <View><Text style={{ color: '#fff' }}>保存</Text></View>
            </TouchableOpacity>
        );
        return (
            <View>
                <Header 
                    title={edit ? farmInfo.farm_name : '新增养殖场'} 
                    history={this.props.history}
                    right={rightFragment}
                />
                <List renderHeader="基本信息">
                    {
                        getFieldDecorator('farm_name',{
                            initialValue: farmInfo.farm_name,
                            rules: [{ required: true }]
                        })(
                            <InputItem clear>名称</InputItem>
                        )
                    }
                     {
                        getFieldDecorator('stall_num',{
                            initialValue: farmInfo.farm_name || 10,
                            rules: [{ required: true }]
                        })(
                            <InputNumber extra="间 ">牛舍</InputNumber>
                        )
                    }
                    <Item
                        extra={
                            <ImagePicker 
                                files={files} 
                                selectable={files.length < 1}
                                onChange={this.handlePickImage}
                            />}
                        multipleLine
                    >
                        图片
                    </Item>
                    {
                        getFieldDecorator('address',{
                            initialValue: farmInfo.address,
                            rules: [{ required: true }]
                        })(
                            <TextareaItem rows={4} placeholder="请输入养殖场详细地址" /> 
                        )
                    }
                </List>
                <List renderHeader="环境参数阈值">
                    {
                        getFieldDecorator('temp_thres',{
                            initialValue: farmInfo.temp_thres || 0
                        })(
                            <InputNumber extra="℃ ">温度</InputNumber>
                        )
                    }
                    {
                        getFieldDecorator('humi_thres',{
                            initialValue: farmInfo.humi_thres || 0
                        })(
                            <InputNumber extra="% ">湿度</InputNumber>
                        )
                    }
                    {
                        getFieldDecorator('illum_thres',{
                            initialValue: farmInfo.illum_thres || 0
                        })(
                            <InputNumber extra="lx">光照度</InputNumber>
                        )
                    }
                    {
                        getFieldDecorator('amm_thres',{
                            initialValue: farmInfo.amm_thres || 0
                        })(
                            <InputNumber extra="ppm">氨气</InputNumber>
                        )
                    }
                    {
                        getFieldDecorator('h2s_thres',{
                            initialValue: farmInfo.h2s_thres || 0
                        })(
                            <InputNumber extra="ppm">H2S</InputNumber>
                        )
                    }
                     {
                        getFieldDecorator('co2_thres',{
                            initialValue: farmInfo.co2_thres || 0
                        })(
                            <InputNumber extra="ppm">CO2</InputNumber>
                        )
                    }
                </List>
            </View>
        )
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if(!id) { //新增
            const auth = requestCameraPermission();
            if(!auth) {
                this.props.history.goBack();
            }
            return;
        }
        this.fetchFarmInfo(parseInt(id));
    }

    fetchFarmInfo = async (id: number) => {
        const res: IResponse = await ajax('/farm/info', {id});
        if(res.error) {
            Toast.fail(res.msg, 1);
            return;
        }
        const uri = res.data.image
        const files = [{ url: uri }];
        this.setState({
            files,
            uri,
            farmInfo: res.data,
            edit: true
        }, () => {
            console.log(this.state.farmInfo, 'farminfo');
        });
    }

    handlePickImage = async ( files: IFile[]) => {
        const res: IResponse = await upload(files[0].url);
        if(res.error) {
            Toast.fail('图片上传失败', 1);
            return;
        }
        Toast.success('图片上传成功', 1);
        this.setState({
            files,
            uri: res.data.uri
        }, () => {
            console.log(this.state.uri);
        });
    }

    handleSubmit = () => {
        const { uri, edit } = this.state;
        this.props.form.validateFields( async (error: any,values: any) => {
            if(error) {
                Toast.fail('请完善所有信息！', 1);
                return;
            }
            if(!uri) {
                Toast.fail('请上传养殖场图片！', 1);
                return;
            }
            const api = edit ? '/farm/update' : '/farm/add';
            const res: IResponse = await ajax(api, {
                ...values,
                image: uri,
                id: this.props.match.params.id
            })
            if(res.error) {
                Toast.fail(res.msg, 1);
                return;
            }
            Toast.success('保存成功', 1);
            setTimeout(() => {
                this.props.history.goBack();
            }, 1000);
        });
    }
}

export default createForm()(Farm);