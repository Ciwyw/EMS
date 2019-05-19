import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from '../../../components/icon';
interface IProps {
    history: {
        push: (path: string) => void
    },
    info: IFarm
}

class Card extends React.Component<IProps> {
    render() {
        const { info } = this.props;
        return (
                <TouchableOpacity onPress={() => this.handleGetDetail(info.id)}>
                    <View style={styles.card}>
                        <Image style={styles.image} source={{ uri: info.image || ''}} />
                        <View style={styles.info}>
                            <View>
                                <Text style={styles.name}>{info.farm_name}</Text>
                                <View style={styles.address}>
                                    <Icon size="xs" name="environment" color="#f45a8d"/>
                                    <Text>{info.address}</Text>
                                </View>
                            </View>
                            <View style={styles.link}>
                                <Text style={{ color: '#f45a8d' }}>详情</Text><Icon name="right" color="#f45a8d" />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
    }
    handleGetDetail = (id: number) => {
        this.props.history.push(`/farm/${id}`);
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginBottom: 15,
        flexDirection: 'row',
        padding: 20,
        borderRadius: 10
    },
    image: {
        width: 90,
        height: 90,
        marginRight: 10
    },
    info: {
        flex: 1,
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 18,
        marginBottom: 7,
        color: '#000'
    },
    address: {
        flexDirection: 'row'
    },
    link: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
})

export default Card;