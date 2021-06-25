import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';

import firestore from '@react-native-firebase/firestore';

import styles from './styles';


export default function ModalResultScreen(props) {

    const [isUploading, setIsUploading] = useState(false)
    let scannedCodesList = props.route.params.scannedCodesList;
    let employeeID = props.extraData.id;
    var lastCartID = 0;
    useEffect(() => {
        if (scannedCodesList.length > 0) {
            setIsUploading(true)
            const barcodesRef = firestore().collection('Barcodes')
            barcodesRef.orderBy("cartID", 'desc').limit(1).get()
                .then((doc) => {
                    doc.forEach((item) => {
                        lastCartID = item.data().cartID
                        console.log(lastCartID);
                    })
                }).then(() => {
                    scannedCodesList.forEach((scannedCode) => {
                        barcodesRef.add({
                            Barcode: parseInt(scannedCode),
                            cartID: lastCartID + 1,
                            employeeID: employeeID,
                        }).catch((err) => console.log(err))
                    })
                }).then(() => { setIsUploading(false) })
                .catch((error) => {
                    console.log(error)
                    alert(error)
                    setIsUploading(false)
                });
        }
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isUploading ?
                <>
                    <ActivityIndicator size={64} color="#788eec" />
                    <Text>Uploading....</Text>
                </>
                :
                <>
                    <Text>Uploaded Successfully</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('MainTab')} style={styles.button}>
                        <Text style={styles.buttonTitle}>Go Home</Text>
                    </TouchableOpacity>
                    <Text style={{display:'none'}}>{setTimeout(() => {props.navigation.navigate('MainTab')}, 1000)}</Text>
                </>
            }
        </View>
    )
}