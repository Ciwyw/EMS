declare interface ReduxAction {
    type: string,
    data: any
}
declare interface IResponse {
    error: boolean,
    data?: any,
    msg?: string
}

declare interface IFile {
    url: string
}

declare interface IFarm {
    id?: number,
    farm_name?: string,
    image?: string,
    address?: string,
    stall_num?: number,
    temp_thres?: number,
    humi_thres?: number,
    illum_thres?: number,
    amm_thres?: number,
    h2s_thres?: number,
    co2_thres?: number,
    create_time?: string
}

declare interface IEnv {
    id?: number,
    farm_id?: number,
    temperature?: number, //温度
    humidity?: number, //湿度
    illuminance?: number, //光照度
    ammonia?: number, //氨气
    h2s?: number, 
    co2?: number,
    update_time?: string
}

declare module 'rc-form';

declare module 'rc-input-number';

declare module '*.png';

declare module 'native-echarts';

declare module 'react-native-datepicker';

declare module 'react-native-table-component';
