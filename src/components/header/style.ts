import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#5096ff'
    },
    title: {
        fontSize: 18,
        maxWidth: '50%',
        overflow: 'hidden',
        color: '#fff'
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#fff'
    }
})

export default styles;