import React, {Component} from 'react';
import {
    View,
    Text
} from 'react-native';

import {tabStyles, flexStyles} from '../styles';
import PostItemListContainer from '../containers/PostItemListContainer';
import SearchBoxContainer from '../containers/SearchBoxContainer';

export default class HomeTab extends Component {
    render () {
        return (
            <View style={flexStyles.flex}>
                <SearchBoxContainer/>
                <PostItemListContainer/>
            </View>
        );
    }
}
