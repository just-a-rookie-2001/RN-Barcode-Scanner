import React from 'react'
import { Image, View } from 'react-native'

import styles from './styles';


export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../../assets/icon.png')}
            />
        </View>
    )
}