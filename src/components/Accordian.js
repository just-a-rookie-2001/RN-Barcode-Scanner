import React, { Component } from 'react';
import { View, TouchableOpacity, Text, FlatList, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class Accordian extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            expanded: this.props.isExpanded,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    render() {
        return (
            <>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.row} onPress={() => this.toggleExpand()}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color='gray' />
                    </TouchableOpacity>
                    {
                        this.state.expanded &&
                        <View style={{ width: "100%" }}>
                            <FlatList
                                data={this.state.data}
                                scrollEnabled={true}
                                renderItem={({ item, index }) =>
                                    <View>
                                        <View style={styles.childHr} />
                                        <TouchableOpacity style={styles.childRow}>
                                            <Text style={styles.item}>{item.value}</Text>
                                        </TouchableOpacity>
                                    </View>
                                } />
                        </View>
                    }
                </View>
                <View style={styles.parentHr} />
            </>
        )
    }

    toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded })
    }

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'white',
        elevation: 3,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666666',
    },
    item:{
        color: '#666666',
    },
    row: {
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        paddingHorizontal: 18,
        alignItems: 'center',
        width: "100%",
    },
    childRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 15, 
        height: 54,
        alignItems: 'center',
        paddingHorizontal: 35,
        fontSize: 12,
        width: "100%",
    },
    parentHr: {
        height: 10,
        color: 'white',
        width: '100%'
    },
    childHr: {
        height: 1,
        borderTopColor: '#e3e3e3',
        borderTopWidth: 1,
        width: '100%'
    },
});