import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#fa7399'
    },
    title: {
        fontSize: 18,
        maxWidth: '50%',
        overflow: 'hidden',
        color: '#fff'
    }
})

export default styles;