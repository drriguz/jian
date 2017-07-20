import {StyleSheet} from 'react-native';
export const tabStyles = StyleSheet.create({
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#444',
        margin: 5,
        height: 150,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    }
});

export const flexStyles = StyleSheet.create({
    flex: {
        flex: 1
    },
    flexDirection: {
        flexDirection: "row"
    },
    debug1: {
        backgroundColor: "#839496"
    },
    debug2: {
        backgroundColor: "#207bbc"
    },
    debug3: {
        backgroundColor: "#c45e28"
    },
    debug4: {
        backgroundColor: "#d33682"
    }
});
