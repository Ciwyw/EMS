import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

interface IProps {
    hint: string
}
const Empty: React.FunctionComponent<IProps> = (props) => {
    return (
        <View style={styles.empty}>
            <Image style={styles.image} source = {require('../../assets/empty.png')} />
            <Text>{props.hint}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    empty: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
    image: {
        width: 240,
        marginBottom: 20,
    }
})

export default Empty;