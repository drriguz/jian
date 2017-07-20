import React, {Component} from 'react';
import {
    Text,
    View,
    WebView,
} from 'react-native';
import {flexStyles} from '../styles';

export default class BrowserPage extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    render () {
        return (
            <View style={[flexStyles.flex]}>
                <WebView source={{ uri: this.props.navigation.state.params.url }}>

                </WebView>
            </View>
        );
    }
}
