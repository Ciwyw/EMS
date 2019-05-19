import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    login: {
        alignItems: 'center',
        paddingLeft: 32,
        paddingRight: 32
    },
    header: {
        marginTop: 65,
        marginBottom: 35,
        marginRight: -400
    },
    inputArea: {
        width: '100%',
        marginBottom: 20
    },
    input: {
        fontSize: 16,
    },
    rolepicker: {
        width: 150,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'flex-end',
    },
    btn: {
        width: '100%',
        backgroundColor: '#f45a8d',
        borderWidth: 0,
    },
    activeBtn: {
        backgroundColor: '#f45a8d'
    }
})

export default styles;