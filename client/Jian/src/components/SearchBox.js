import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default class SearchBox extends Component {
    componentWillMount () {
        this.state = { search: "" };
    }

    onSearch = () => {
        console.log('searching...');
        this.props.onSearch(this.state.search);
    };

    render () {
        return (
            <View style={[styles.searchWrapper]}>
                <View style={[styles.searchInput]}>
                    <TextInput
                        style={[styles.TextInput]}
                        returnKeyType="search"
                        placeholder="Search posts..."
                        onChangeText={(val) => this.setState({ search: val })}
                    />
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={this.onSearch}>
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

const styles = StyleSheet.create({
    searchWrapper: {
        flexDirection: "row",
        marginTop: 5,
        height: 35,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchInput: {
        flex: 1,

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
    }
});