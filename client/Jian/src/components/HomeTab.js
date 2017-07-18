import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView
} from 'react-native';

import PostItem from './PostItem';
import {tabStyles, flexStyles} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import PostItemListContainer from '../containers/PostItemListContainer';

class SearchBox extends Component {
    render () {
        return (
            <View style={[styles.flexDirection, styles.searchWrapper]}>
                <View style={[styles.searchInput]}>
                    <TextInput style={[styles.TextInput]} returnKeyType="search"/>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <Icon
                        name="ios-search"
                        size={30}
                        color="#eee"
                    />
                </TouchableOpacity>
            </View>
        );
    }
}
export default class HomeTab extends Component {
    render () {
        return (
            <View style={flexStyles.flex}>
                <SearchBox/>
                <PostItemListContainer/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    flexDirection: {
        flexDirection: "row"
    },
    searchWrapper: {
        marginTop: 5,
        height: 35,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: "center",
    },
    searchButton: {
        width: 55,
        backgroundColor: "#207bbc",
        justifyContent: "center",
        alignItems: "center"
    },
    searchText: {
        color: "#fff",
        fontSize: 15
    },
    postWrapper: {}
});