import React, { useState, useEffect } from 'react'
import { FlatList, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import { v4 as uuidv4 } from 'uuid';

import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import Accordian from "../../components/Accordian";
import styles from './styles';


export default function HomeScreen(props) {

    const [entities, setEntities] = useState([])
    const [menu, setMenu] = useState([])

    const entityRef = firestore().collection('Barcodes')
    const userID = props.extraData.id
    var isMounted = false;

    useEffect(() => {
        isMounted = true
        console.log("mounted")
        return () => {
            isMounted = false
            console.log("unmounted")
        }
    }, [])

    useFocusEffect(React.useCallback(() => {
        console.log("focused");
        if (isMounted === true) {
            entityRef.where("employeeID", "==", userID).get()
                .then(
                    dat => {
                        const newEntities = []
                        dat.forEach(doc => {
                            const entity = doc.data()
                            entity.id = doc.id
                            newEntities.push(entity)
                        });
                        if (isMounted) setEntities(newEntities);
                    }
                ).catch(err => alert(err))
        }

        return () => { console.log("blurred") }
    }, []))

    useEffect(() => {
        const dat = {}
        const temp = []
        entities.forEach((value) => {
            const cartID = value.cartID;
            const bcode = value.Barcode
            if (!dat[cartID]) dat[cartID] = []
            dat[cartID].push({ key: uuidv4(), value: bcode })
        })
        for (var key in dat) {
            temp.push({ title: `Cart ID: ${key}`, data: dat[key] })
        }
        temp.sort(function (a, b) {
            const ti_a = a.title.slice(9)
            const ti_b = b.title.slice(9)
            return parseInt(ti_a) < parseInt(ti_b);
        })
        setMenu(temp)
    }, [entities])

    const renderAccordians = ({ item, index }) => {
        return (
            <Accordian
                key={index}
                isExpanded={!index}
                title={item.title}
                data={item.data}
            />
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            <View style={styles.formContainer}>
                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("ModalScan")}>
                    <Text style={styles.buttonText}>New Scan</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.accordianContainer}>
                <FlatList
                    data={menu}
                    renderItem={renderAccordians}
                    keyExtractor={(item) => item.title}
                    removeClippedSubviews={true}
                    style={{marginTop: 20}}
                />
            </View>
        </View>
    )
}