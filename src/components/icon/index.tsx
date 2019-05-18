import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';

interface IProps {
    name: any,
    size?: number | "xxs" | "xs" | "sm" | "md" | "lg",
    color?: string,
    onPress?: () => void
}

const handlePressIcon = (onPress: () => void) => {
    onPress && onPress();
}

const IconComponent: React.FunctionComponent<IProps> = (props) => {
    const { name, size, onPress, color } = props;
    return (
        <TouchableOpacity onPress={() => handlePressIcon(onPress)}>
            <Icon name={name} size={size} color={color}/>
        </TouchableOpacity>
    )
}

export default IconComponent;

