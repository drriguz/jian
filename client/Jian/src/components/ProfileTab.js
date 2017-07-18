import React, {Component} from 'react';
import {
    Text,
    View,
} from 'react-native';
import {flexStyles} from '../styles';

export default class ProfileTab extends Component {
    render () {
        return (
            <View style={[flexStyles.flex]}>
                <Text>ME</Text>
            </View>
        );
    }
}
