import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    RefreshControl,
    TouchableOpacity
} from 'react-native';

import PostItem from './PostItem';


export default class PostItemList extends Component {
    componentWillMount () {
        this.props.fetchPosts();
    }

    _renderRows (rows) {
        if (!rows)
            return <Text>No content</Text>;
        return rows.map(post => {
            return <PostItem
                {...this.props}
                key={post._id}
                author="红尘の人"
                content={post.content}
                medias={post.medias}/>;
        })
    }

    _onRefresh = () => {
        console.log("refresh....", this.props.query);
        this.props.fetchPosts(
            this.props.query.search,
            null);
    };

    _loadMore = () => {
        console.log("More...");
        this.props.fetchPosts(
            this.props.query.search,
            this.props.query.last);
    };

    _renderNextButton (hasMore) {
        if (hasMore)
            return (
                <TouchableOpacity onPress={this._loadMore}>
                    <Text style={styles.loadButton}>Load more >></Text>
                </TouchableOpacity>
            );
        return <Text style={styles.loadButton}>No more data</Text>;
    }

    render () {
        let { rows, loading, error } = this.props.postList;
        let content = null;
        if (error)
            content = <Text>Error...</Text>;
        else
            content = this._renderRows(rows);
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this._onRefresh}
                        title="Loading..."
                    />}
            >
                {content}
                {this._renderNextButton(true)}
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    loadButton: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#eee",
        color: "#5bb4ee",
        textAlign: "center"
    }
});