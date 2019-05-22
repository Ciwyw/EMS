import React, { ReactNode } from 'react';
import { InputItem } from '@ant-design/react-native';

interface IProps {
    value: number,
    onChange?: (val: number) => void,
    extra?: string | ReactNode
}

interface IState {
    str: string
}

export default class InputNumber extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        console.log(props, 'number');
        this.state = {
            str: `${props.value}`
        }
    }
    
    render() {
        const { str } = this.state;
        return (
            <InputItem 
                clear 
                type="number"
                extra={this.props.extra}
                value={str}
                onChange={this.handleChange}
            >
                {this.props.children}
            </InputItem>            
        )
    }

    handleChange = (str: string) => {
        this.setState({ str }, () => {
            this.triggerChange();
        })
    }

    triggerChange = () => {
        this.props.onChange(parseFloat(this.state.str));
    }
}