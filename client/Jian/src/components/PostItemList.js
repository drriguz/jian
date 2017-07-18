import React, {Component} from 'react';
import {
    ScrollView,
    Text,
} from 'react-native';

import PostItem from './PostItem';


export default class PostItemList extends Component {
    componentWillMount () {
        console.log('loading,,,,,,', this.props);
        this.props.fetchPosts();
    }

    renderRows (rows) {
        return rows.map(post => {
            return <PostItem key={post._id} author="红尘の人" content={post.content}/>;
        })
    }

    render () {
        console.log('postList:', this.props.postList);
        let { rows, loading, error } = this.props.postList;
        if (loading)
            return <Text>Loading...</Text>;
        if (error)
            return <Text>Error...</Text>;
        return (
            <ScrollView>
                {this.renderRows(rows)}
            </ScrollView>
        );
    }
}
