import config from '../../services/config';

const upload = async ( uri: string ) => {
    const formData = new FormData();
    const name = `${Math.random().toString().slice(-6)}.${uri.split('.')[1]}`;
    const file: any = {
        uri,
        name,
        type: 'multipart/form-data'
    }
    formData.append('file', file);
    const res = await fetch(`${config.BASE_URL}/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    })
    const data: IResponse = await res.json();
    return data;
}

export default upload;