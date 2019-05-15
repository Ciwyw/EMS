import { PermissionsAndroid, Platform } from 'react-native';

const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
        return;
    }
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'title': '访问相册',
                'message': '需要访问相册以便选择图片',
                buttonPositive: '好的'
            },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }
        return false;
    } catch (err) {
        console.error(err)
    }
    return false;
}

export {
    requestCameraPermission
};
