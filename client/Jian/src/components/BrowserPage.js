import React, {Component} from 'react';
import {
    Text,
    View,
    WebView,
    Dimensions
} from 'react-native';
import {flexStyles} from '../styles';

const { height, width } = Dimensions.get('window');

export default class BrowserPage extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    render () {
        const { url, video, poster } = this.props.navigation.state.params;
        let args = {};
        if (url)
            args.source = { uri: url };
        if (video)
            args.source = {
                html: `<video style="width:100px" controls="controls" poster="${poster}"><source src="${video}" type="video/mpeg"></video>`
            };
        console.log(args);
        return (
            <View style={[flexStyles.flex]}>
                <WebView {...args} style={{}}/>
            </View>
        );
    }
}
