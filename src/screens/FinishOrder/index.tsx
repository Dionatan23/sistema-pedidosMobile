import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";

type RouteDetailParams = {
    FinishOrder: {
        number: number | string,
        order_id: string
    }
}

type FinishRouteProp = RouteProp<RouteDetailParams, "FinishOrder">

export default function FinishOrder() {

    const route = useRoute<FinishRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    async function handleFinishOrder() {
        try {
            await api.put("/sendOrder", {
                order_id: route.params?.order_id
            });

            navigation.popToTop()
        } catch (error) {
            console.log("Erro ao finalizar! Reinicie o APP", error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.alert}>Você deseja finalizar o Pedido ?</Text>
            <Text style={styles.title}>Mesa: {route.params?.number}</Text>

            <TouchableOpacity style={styles.btnFinish} onPress={handleFinishOrder}>
                <Text style={styles.btnText}>Finalizar o Pedido?</Text>
                <Feather name="shopping-cart" size={20} color={"#1d1d2e"} /> 
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1d1d2e",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "4%",
        paddingVertical: "5%"
    },
    alert: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12
    },
    title: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 12
    },
    btnFinish: {
        backgroundColor: "#3fffa3",
        flexDirection: "row",
        width: "65%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4
    },
    btnText: {
        color: "#1d1da3",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 8
    }
})