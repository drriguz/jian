import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';

import {tabStyles, flexStyles} from '../styles';
import {API_BASE} from '../constants';

class PostItemHeader extends Component {
    render () {
        return (
            <View style={[flexStyles.flexDirection, flexStyles.flex, styles.headerWrapper]}>
                <Image
                    style={[styles.avatar]}
                    source={{ uri: this.props.avatar }}/>
                <View style={[styles.display, flexStyles.flex, styles.authorWrapper]}>
                    <Text style={[styles.author, flexStyles.flex]}>{this.props.author}</Text>
                    <Text style={[styles.bio, flexStyles.flex]}>{this.props.bio}</Text>
                </View>
                <Text style={[styles.time]}>{this.props.time}</Text>
            </View>
        );
    }
}

class PostItemContent extends Component {
    _renderLink (key, thumb, title, link) {
        const { navigate } = this.props.navigation;
        return (
            <View key={key} style={styles.imageLinkWrapper}>
                <Image
                    style={[styles.linkThumb]}
                    source={{ uri: `${API_BASE}/${thumb}` }}/>
                <TouchableOpacity onPress={
                    () => navigate('Browser', { url: link, title: title })
                }>
                    <Text style={[styles.linkText, flexStyles.flex]}>{title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderMedias (medias) {
        return medias.map(media => {
            if (media.mimeType.indexOf("html") > -1)
                return this._renderLink(media._id, media.thumb, media.title, media.src);
            if (media.mimeType.indexOf("image") > -1)
                return <Image key={media._id} style={[styles.thumb]} source={{ uri: `${API_BASE}/${media.thumb}` }}/>;
            return <Image key={media._id} style={[styles.thumb]} source={require("../assets/default.png")}/>;
        });
    }

    render () {
        return (
            <View style={styles.contentWrapper}>
                <Text>{this.props.content}</Text>
                <View style={styles.mediaWrapper}>
                    {this._renderMedias(this.props.medias)}
                </View>
            </View>
        );
    }
}
export default class PostItem extends Component {
    render () {
        return (
            <View style={[flexStyles.flex, styles.postWrapper]}>
                <PostItemHeader
                    {...this.props}
                    author="红尘の人"
                    time="昨天 21:28"
                    bio="写诗的程序员..."
                    avatar="http://127.0.0.1:3000/images/avatar5.png"/>
                <PostItemContent
                    {...this.props}
                    content={this.props.content}
                    medias={this.props.medias}/>
            </View>
        );
    }
}

PostItem.propTypes = {
    author: React.PropTypes.string,
    content: React.PropTypes.string
};

const styles = StyleSheet.create({
    postWrapper: {
        marginTop: 5,
        paddingTop: 5,
        borderTopWidth: 1,
        borderColor: "#eee"
    },
    headerWrapper: {
        marginBottom: 5
    },
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 15
    },
    thumb: {
        height: 80,
        width: 80,
        marginRight: 5,
        marginBottom: 5
    },
    time: {
        fontSize: 10,
        fontWeight: "bold",
        color: "gray"
    },
    authorWrapper: {
        paddingLeft: 10,
        height: 30,
        alignContent: "space-between",
    },
    author: {
        fontSize: 12,
        fontWeight: "bold",
        color: "black"
    },
    bio: {
        fontWeight: "bold",
        fontSize: 10,
        color: "gray",
    },
    contentWrapper: {
        paddingTop: 5
    },
    mediaWrapper: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10
    },
    imageLinkWrapper: {
        alignContent: "center"
    },
    linkThumb: {
        height: 40,
        width: 40
    },
    linkText: {
        fontSize: 10,
        color: '#0297ff',

    }

});