import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        borderBottomWidth: 2,
        borderBottomColor: "#d3d3d3",
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        color: 'black',
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        flexDirection: 'row',
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        flex: 1,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 16
    },
    accordianContainer:{
        // padding: 20,
        width: "100%",
        flex: 99,
    }
})