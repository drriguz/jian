import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';

const Lightbox = require('react-native-lightbox');

export default class ImageLightBox extends Component {
    render () {
        return (
            <Lightbox navigator={this.props.navigator}>
                <Image
                    style={{ height: 300 }}
                    source={{ uri: this.props.navigation.state.params.url }}
                />
            </Lightbox>
        );
    }
}
