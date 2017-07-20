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
import BrowserPage from './src/components/BrowserPage';
import ImageLightbox from './src/components/ImageLightbox';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import FacebookTabBar from './src/components/FacebookTabBar';
import {tabStyles} from './src/styles';

import {createStore, applyMiddleware, compose} from 'redux';
import promise from 'redux-promise';
import reducer from './src/reducers';
import {Provider} from 'react-redux';

const enhancer = applyMiddleware(promise);
const store = createStore(reducer, {}, enhancer);

import {StackNavigator, TabNavigator} from 'react-navigation';

export default class Jian extends Component {
    static navigationOptions = {
        title: 'Jian',
        headerStyle: {}
    };

    render () {
        return (
            <Provider store={store}>
                <ScrollableTabView
                    initialPage={0}
                    tabBarPosition="bottom"
                    renderTabBar={() => <FacebookTabBar/>}>
                    <View tabLabel={{ icon: "ios-aperture", name: "Home" }} style={tabStyles.tabView}>
                        <HomeTab {...this.props}/>
                    </View>
                    <ScrollView tabLabel={{ icon: "ios-chatbubbles", name: "News" }} style={tabStyles.tabView}>
                        <NewsTab/>
                    </ScrollView>
                    <View tabLabel={{ icon: "ios-contact", name: "Profile" }} style={tabStyles.tabView}>
                        <ProfileTab/>
                    </View>
                </ScrollableTabView>
            </Provider>
        );
    }
}

const AppNavigator = StackNavigator(
    {
        Home: { screen: Jian },
        Browser: { screen: BrowserPage },
        LightBox: { screen: ImageLightbox },
    },
    {
        initialRouteName: 'Home',
        cardStyle: {
            backgroundColor: '#fff',
        }
    }
);
AppRegistry.registerComponent('Jian', () => AppNavigator);
