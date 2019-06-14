import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createForm } from 'rc-form';
import { List, InputItem, TextareaItem, Toast, ImagePicker } from '@ant-design/react-native';
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
            id?: string
        }
    },
    form: any
}

interface IState {
    files: IFile[],
    url: string,
    farmInfo: IFarm,
    edit: boolean
}

const Item = List.Item;

const normalizeToInt = (val: string) => {
    return val.replace(/[^0-9]/, '');
}

const normalizeToFloat = (val: string) => {
    return val.replace(/[^0-9.]/, '');
}
class Farm extends React.Component<IProps, IState> {

    state: IState = {
        files: [],
        url: '',
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
                            initialValue: farmInfo.stall_num && `${farmInfo.stall_num}`,
                            rules: [{ required: true }],
                            normalize: normalizeToInt
                        })(
                            <InputItem type="number" clear>牛舍</InputItem>                           
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
                            initialValue: farmInfo.temp_thres && `${farmInfo.temp_thres}`,
                            normalize: normalizeToFloat
                        })(
                            <InputItem type="number" clear extra="℃  ">温度</InputItem>                           
                        )
                    }
                    {
                        getFieldDecorator('humi_thres',{
                            initialValue: farmInfo.humi_thres && `${farmInfo.humi_thres}`,
                            normalize: normalizeToFloat
                        })(
                            <InputItem type="number" clear extra="%  ">湿度</InputItem>                           
                        )
                    }
                    {
                        getFieldDecorator('illum_thres',{
                            initialValue: farmInfo.illum_thres && `${farmInfo.illum_thres}`,
                            normalize: normalizeToFloat
                        })(
                            <InputItem type="number" clear extra="lux">光照度</InputItem>                           
                        )
                    }
                    {
                        getFieldDecorator('amm_thres',{
                            initialValue: farmInfo.amm_thres && `${farmInfo.amm_thres}`,
                            normalize: normalizeToFloat
                        })(
                            <InputItem type="number" clear extra="mg/m3">氨气</InputItem>                           
                        )
                    }
                    {
                        getFieldDecorator('h2s_thres',{
                            initialValue: farmInfo.h2s_thres && `${farmInfo.h2s_thres}`,
                            normalize: normalizeToFloat
                        })(
                            <InputItem type="number" clear extra="mg/m3">H2S</InputItem>                           
                        )
                    }
                    {
                        getFieldDecorator('co2_thres',{
                            initialValue: farmInfo.co2_thres && `${farmInfo.co2_thres}`,
                            normalize: normalizeToFloat
                        })(
                            <InputItem type="number" clear extra="ppm ">CO2</InputItem>                           
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
        const url = res.data.image
        const files = [{ url }];
        this.setState({
            files,
            url,
            farmInfo: res.data,
            edit: true
        });
    }

    handlePickImage = async ( files: IFile[]) => {
        if(files.length === 0) { //删除
            this.setState({
                files,
                url: ''
            });
            return;
        }
        const res: IResponse = await upload(files[0].url);
        if(res.error) {
            Toast.fail('图片上传失败!', 1);
            return;
        }
        Toast.success('图片上传成功!', 1);
        this.setState({
            files,
            url: res.data.url
        });
    }

    handleSubmit = () => {
        const { url, edit } = this.state;
        this.props.form.validateFields( async (error: any,values: any) => {
            if(error) {
                Toast.fail('请完善所有信息！', 1);
                return;
            }
            if(!url) {
                Toast.fail('请上传养殖场图片！', 1);
                return;
            }
            const api = edit ? '/farm/update' : '/farm/add';
            const res: IResponse = await ajax(api, {
                ...values,
                image: url,
                stall_num: parseInt(values.stall_num),
                temp_thres: parseFloat(values.temp_thres),
                humi_thres: parseFloat(values.humi_thres),
                illum_thres: parseFloat(values.illum_thres),
                amm_thres: parseFloat(values.amm_thres),
                h2s_thres: parseFloat(values.h2s_thres),
                co2_thres: parseFloat(values.co2_thres),
                id: parseInt(this.props.match.params.id)
            })
            if(res.error) {
                Toast.fail(res.msg, 1);
                return;
            }
            Toast.success('保存成功', 1);
            setTimeout(() => {
                this.props.history.goBack();
            }, 0);
        });
    }
}

export default createForm()(Farm);