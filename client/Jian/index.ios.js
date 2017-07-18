import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    ScrollView,
} from 'react-native';

import {tabNames} from './src/constants';
import HomeTab from './src/components/HomeTab';
import NewsTab from './src/components/NewsTab';
import ProfileTab from './src/components/ProfileTab';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import FacebookTabBar from './src/components/FacebookTabBar';
import {tabStyles} from './src/styles';

export default class Jian extends Component {
    render () {
        return (
            <ScrollableTabView
                style={{ marginTop: 20, }}
                initialPage={0}
                tabBarPosition="bottom"
                renderTabBar={() => <FacebookTabBar />}>
                <View tabLabel={{ icon: "ios-aperture", name: "Home" }} style={tabStyles.tabView}>
                    <HomeTab/>
                </View>
                <ScrollView tabLabel={{ icon: "ios-chatbubbles", name: "News" }} style={tabStyles.tabView}>
                    <NewsTab/>
                </ScrollView>
                <View tabLabel={{ icon: "ios-contact", name: "Profile" }} style={tabStyles.tabView}>
                    <ProfileTab/>
                </View>
            </ScrollableTabView>
        );
    }
}
AppRegistry.registerComponent('Jian', () => Jian);
