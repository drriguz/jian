import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';
import {flexStyles} from '../styles';

export default class NewsTab extends Component {
    render () {
        return (
            <ScrollView style={[flexStyles.flex]}>
                <Text>News</Text>
            </ScrollView>
        );
    }
}
