import axios from 'axios';

const ajax = (url: string, data: any = {}): any => {
    return new Promise((resolve, reject) => {
        let options = {
            url,
            data,
            method: 'post',
            baseURL: 'http://192.168.43.97:3000',
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
                "Accept": "application/json",
                "Content-Type": 'application/json'
            },
        }
        axios.request(options).then(response => {
            resolve(response.data);
        }).catch((error) => {
            throw Error(error)
        })
    })
}

export default ajax;