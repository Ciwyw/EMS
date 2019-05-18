import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import config from '../../../services/config';

const emptyUri = `${config.BASE_URL}/images/301056.jpg`;
interface IProps {
    hint: string
}
const Empty: React.FunctionComponent<IProps> = (props) => {
    return (
        <View style={styles.empty}>
            <Image style={styles.image} source = {{ uri: emptyUri }} />
            <Text>{props.hint}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    empty: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 240,
        marginBottom: 20,
    }
})

export default Empty;