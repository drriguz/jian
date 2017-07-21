import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import Image from 'react-native-image-progress';

export default class ImageLightBox extends Component {
    render () {
        return (
            <TouchableOpacity style={{ flex: 1, alignContent: "center", justifyContent: "center" }} onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image
                    style={{ height: 300 }}
                    source={{ uri: this.props.navigation.state.params.url }}
                />
            </TouchableOpacity>
        );
    }
}
