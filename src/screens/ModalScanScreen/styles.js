import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
    },
    logo: {
        alignSelf: 'center',
        marginVertical: 40
    },
    input: {
        fontSize: 20,
        color: 'black',
        overflow: 'hidden',
        paddingVertical: 10,
        borderBottomColor: '#d3d3d3',
        borderBottomWidth: 2,
        marginBottom: 30,
    },
    label: {
        color: '#a1a1a1'
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        margin: 10,
        height: 48,
        borderRadius: 5,
        backgroundColor: '#788eec',
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
})