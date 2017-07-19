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

    renderRows (rows) {
        if (!rows)
            return <Text>No content</Text>;
        return rows.map(post => {
            return <PostItem
                key={post._id}
                author="红尘の人"
                content={post.content}
                medias={post.medias}/>;
        })
    }

    onRefresh = () => {
        console.log("refresh....", this.props.query);
        this.props.refreshPosts();
    };

    loadMore = () => {
        console.log("More...");
    };


    render () {
        let { rows, loading, error } = this.props.postList;
        let content = null;
        if (error)
            content = <Text>Error...</Text>;
        else
            content = this.renderRows(rows);
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this.onRefresh}
                        title="Loading..."
                    />}
            >
                {content}
                <TouchableOpacity onPress={this.loadMore}>
                    <Text style={styles.loadButton}>Load more >>{this.props.postList.search}</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    loadButton: {
        borderWidth: 1,
        borderColor: "#eee",
        color: "#5bb4ee",
        textAlign: "center"
    }
});