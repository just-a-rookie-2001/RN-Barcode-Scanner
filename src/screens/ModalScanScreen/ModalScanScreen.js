import React, { useEffect } from 'react';
import { AppState, Text, View, TouchableOpacity, StatusBar } from 'react-native';

import {
    BarcodeCaptureSettings,
    BarcodeCapture,
    BarcodeCaptureOverlay,
    Symbology,
} from 'scandit-react-native-datacapture-barcode';
import {
    Camera,
    CameraSettings,
    DataCaptureContext,
    DataCaptureView,
    FrameSourceState,
    VideoResolution,
} from 'scandit-react-native-datacapture-core';

import { requestCameraPermissionsIfNeeded } from './cameraPermissionHandler';
import styles from './styles';


export default function ModalScanScreen(props) {

    const dataCaptureContext = DataCaptureContext.forLicenseKey('AcSQxxiaOGgQPJDN+CGT8nU41XcdNK3krkWNj7lZrLWBVxV3Cw5FrO9IawyrVM5ruCurc4NPGlv4RClvK2RU++hai4P8UqsmcAoBCKN4/PqVesKiV1dOIrw17B9zCTOLxAm0ejsme9X4kwpJXd70wpdNBgLdmqzF1kBT1Nx1pYYf4UkdxyWOuRRUpcunXexyfe92ddOG71BTUFCDT53+4ea0oZHFpkCxIF5XjrTgvrpd1pc+hT/ZOeCF0kXTKqUhJYvwR/zmATaAndIjdU+FT8t/w+JlcC+8U/tQFwu/P3fKM/kF+rzIoO+bbfp46Q1wvc13v69CgbrnDnETUy2WRR/w22RZUXWnDg6opdgWOBLlbbzB7NiPHKDFTmROfavEcXvg1em7x7iUWxIBrfTq0Q3uwBX4c3hHqeoWTwuSDKmCniIEX6iVz8Rpo2iHwyMXL5Bq6cBvxMqyJ/yO/t9tCF+KMsG95ozhIPwSsHdAdCwb5U4eeaTdEB2Z0wC+SvehO91J86SPdAOpvtvICeb8bnxRZXnm0hDF1E1zmooilPYV4z1dNrHKfwlld9ogeWhMfWlRSUGodpuzNRZp28ZKZZz9gOm+U7md4rJIQudqbDqFipfHQMKCzKt9BHo66LrwKSnGDqfCjL1wnwfWPjUkgQzyZQwEbEq9rwC3xdh7B0a1q/YjFSkDLVHdwUkiYi/StlUOzJyxchSkDI7jR0djwzrdkyQNYltf48RBE9FireFKP3TbSsdPW3peN4QbWK/DgTh7FB/MjynzuxQ2Uu+CrP/G4D/VZ2uA7F7AHLk8pJZnOM/fU+9w');
    const viewRef = React.createRef();
    let capturedCodes = [];
    let camera = false;
    let barcodeCaptureMode = null;
    let barcodeCaptureOverlay = null;
    let barcodeCaptureListener = null;

    useEffect(() => {
        setupProductScanning();
        AppState.addEventListener('change', handleAppStateChange);
        var unsubscribeFocusListener = props.navigation.addListener('focus', () => {
            capturedCodes = []
            startCamera();
            barcodeCaptureMode.isEnabled = true;
        })

        var unsubscribeBlurListener = props.navigation.addListener('blur', () => {
            stopCamera();
            barcodeCaptureMode.isEnabled = false;
        })

        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
            unsubscribeFocusListener;
            unsubscribeBlurListener;
            dataCaptureContext.dispose();
        }
    }, [])

    async function handleAppStateChange(nextAppState) {
        if (!props.navigation.isFocused()) { return }

        if (nextAppState.match(/inactive|background/)) {
            stopCamera();
        } else {
            startCamera();
        }
    }

    function stopCamera() {
        if (camera) {
            camera.switchToDesiredState(FrameSourceState.Off);
        }
    }

    function startCamera() {
        if (!camera) {
            camera = Camera.default;
            dataCaptureContext.setFrameSource(camera);
            const cameraSettings = new CameraSettings();
            cameraSettings.preferredResolution = VideoResolution.FullHD;
            camera.applySettings(cameraSettings);
        }

        requestCameraPermissionsIfNeeded()
            .then(() => camera.switchToDesiredState(FrameSourceState.On))
            .catch(() => BackHandler.exitApp());
    }

    function setupProductScanning() {
        barcodeCaptureMode = BarcodeCapture.forContext(dataCaptureContext, settings);
        const settings = new BarcodeCaptureSettings();
        settings.enableSymbologies([Symbology.EAN13UPCA, Symbology.EAN8, Symbology.QR, Symbology.Code128]);
        settings.codeDuplicateFilter = 2000;
        barcodeCaptureMode.applySettings(settings);
        barcodeCaptureOverlay = BarcodeCaptureOverlay.withBarcodeCaptureForView(barcodeCaptureMode, null);
        barcodeCaptureListener = {
            didScan: (_, session) => {
                capturedCodes.push(session.newlyRecognizedBarcodes[0].data)
            }
        };
        dataCaptureContext.addMode(barcodeCaptureMode);
        barcodeCaptureMode.addListener(barcodeCaptureListener);
        viewRef.current.addOverlay(barcodeCaptureOverlay);
    }

    return (
        <>
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            <DataCaptureView style={{ flex: 9 }} context={dataCaptureContext} ref={viewRef} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={(e) => { props.navigation.goBack() }}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={(e) => {props.navigation.navigate("ModalResult", {scannedCodesList: capturedCodes}) }}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </>
    );

};