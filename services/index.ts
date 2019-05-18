import axios from 'axios';
import config from './config';

axios.defaults.withCredentials = true;
axios.defaults.method = 'post';
axios.defaults.baseURL = config.BASE_URL;

export { axios };
const ajax = (url: string, data: any = {}): any => {
    return new Promise((resolve, reject) => {
        let options = {
            url,
            data,
            transformRequest: [function(data: any) {
                return JSON.stringify(data)
            }],
            transformResponse: [function(data: any) {
                if (typeof data != 'object') {
                    try {
                        data = JSON.parse(data)
                    } catch (error) {
                        console.log(error)
                    }
                }
                return data
            }],
            responseType: 'json', 
            headers: {
                "Content-Type": 'application/json'
            }
        }
        axios.request(options).then(response => {
            resolve(response.data);
        }).catch((error) => {
            throw Error(error)
        })
    })
}
export default ajax;