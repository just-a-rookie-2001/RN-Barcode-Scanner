import React from 'react';
import { StatusBar, Text, View, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';


export default function HomeScreen(props) {

    const userID = props.extraData.id

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            <Icon name="user-circle" size={250} color="#788eec" style={styles.logo} regular/>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.input}>{props.extraData.name}</Text>
            <Text style={styles.label}>E-Mail</Text>
            <Text style={styles.input}>{props.extraData.email}</Text>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.input}>{props.extraData.role}</Text>
            <TouchableOpacity style={styles.button} onPress={(e) => props.handleSignOut(e)}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}