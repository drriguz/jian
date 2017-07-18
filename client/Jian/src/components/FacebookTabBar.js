import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class FacebookTabBar extends Component {
    constructor (props) {
        super(props);
        this.tabIcons = [];
    }

    render () {
        return (
            <View style={[styles.tabs, this.props.style,]}>
                {this.props.tabs.map((tab, i) => {
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            onPress={() => this.props.goToPage(i)}
                            style={styles.tab}>
                            <Icon
                                name={tab.icon}
                                size={30}
                                color={this.props.activeTab === i ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
                                ref={(icon) => {
                                    this.tabIcons[i] = icon;
                                }}
                            />
                            <Text style={styles.tabLabel}>{tab.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}

FacebookTabBar.propTypes = {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
};

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 45,
        flexDirection: 'row',
        paddingTop: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: "bold"
    }
});

export default FacebookTabBar;