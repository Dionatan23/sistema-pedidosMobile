import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"
import { string } from "prop-types";

interface ItemsProps {
    data: {
        id: string;
        product_id: string;
        name: string;
        amount: string | number
    },
    deleteItem: (item_id: string) => void;
}


export function ListItem({ data, deleteItem  }: ItemsProps) {

    function handleDeleteItem() {
        deleteItem(data.id)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.item}>{data.amount} - {data.name}</Text>

            <TouchableOpacity onPress={handleDeleteItem}>
                <Feather name="trash-2" color="#ff3f4b" size={25} />
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101026',
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        borderRadius: 4,
        borderWidth: 0.3,
        borderColor: "#8a8a8a",
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 12
    },
    item: {
        color: "#fff",
    }
})