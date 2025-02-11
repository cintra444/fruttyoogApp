import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 12,
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "black",
        width: "80%",
        borderRadius: 40,
        marginTop: 215,
    },
    icon: {
        marginBottom: 10,
    },
    cardContent: {
        marginTop: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "gray",
    }
});