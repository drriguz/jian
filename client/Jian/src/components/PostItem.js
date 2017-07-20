import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    WebView
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
    componentWillMount () {
        this.state = { preview: false };
    }

    _openLinkInWebView = (title, link, video, poster) => {
        const { navigate } = this.props.navigation;
        navigate('Browser', { url: link, title: title, video: video, poster: poster });
    };

    _openImageLightBox = (src) => {
        const { navigate } = this.props.navigation;
        navigate('LightBox', { url: `${API_BASE}/${src}` });
    };

    _renderLink = (key, thumb, title, link) => {
        return (
            <View key={key} style={styles.imageLinkWrapper}>
                <TouchableOpacity onPress={() => this._openLinkInWebView(title, link)}>
                    <Image
                        style={[styles.linkThumb]}
                        source={{ uri: `${API_BASE}/${thumb}` }}/>
                    <Text style={[styles.linkText, flexStyles.flex]}>{title}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    _renderImage (key, thumb, src) {
        return (
            <TouchableOpacity key={key} onPress={() => this._openImageLightBox(src)}>
                <Image style={[styles.thumb]} source={{ uri: `${API_BASE}/${thumb}` }}/>
            </TouchableOpacity>
        );
    }

    _renderVideo (key, poster, title, videoUrl) {
        const thumb = `${API_BASE}/${poster}`;
        const source = `${API_BASE}/${videoUrl}`;
        const embeddedVideo = {
            html: `<video style="width:100px;height:100px;background-size: cover;" controls="controls" poster="${thumb}"><source src="${source}" type="video/mpeg"></video>`
        };
        /*
        <TouchableOpacity key={key} onPress={() => this._openLinkInWebView(title, null, source, thumb)}>

            <Image style={[styles.thumb]} source={{ uri: thumb }}/>
        </TouchableOpacity>
        */
        return (
            <View key={key} style={{ width: 100, height: 100, flex: 1 }}>
                <WebView source={embeddedVideo}/>
            </View>
        );
    }

    _renderMedias (medias) {
        return medias.map(media => {
            if (media.mimeType.indexOf("html") > -1)
                return this._renderLink(media._id, media.thumb, media.title, media.src);
            if (media.mimeType.indexOf("image") > -1)
                return this._renderImage(media._id, media.thumb, media.src);
            if (media.mimeType.indexOf("video") > -1)
                return this._renderVideo(media._id, media.thumb, 'Video', media.src);
            return (
                <TouchableOpacity key={media._id}>
                    <Image style={[styles.thumb]} source={require("../assets/default.png")}/>
                </TouchableOpacity>
            );
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