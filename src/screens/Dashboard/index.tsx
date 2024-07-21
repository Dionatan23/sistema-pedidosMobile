import React, { useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

export default function Dashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
  const { signOut } = useContext(AuthContext);

  const [number, setNumber] = useState("");

  async function handleOpenOrder() {
    if (number === "") {
      return;
    }

    const response = await api.post("/order", {
      table: Number(number),
    });

    navigation.navigate("Order", {number: number, order_id: response.data.id})
    setNumber("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Novo Pedido</Text>
      <TextInput
        placeholder="Numero da mesa"
        placeholderTextColor="#f0f0f0"
        keyboardType="numeric"
        style={styles.input}
        value={number}
        onChangeText={setNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleOpenOrder}>
        <Text style={styles.btnText}>Abrir mesa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d1d2e",
    paddingVertical: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
  },
  input: {
    width: "90%",
    height: 60,
    backgroundColor: "#101026",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 8,
    textAlign: "center",
    fontSize: 22,
    color: "#fff",
  },
  button: {
    width: "90%",
    height: 40,
    backgroundColor: "#3fffa3",
    borderRadius: 4,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101026",
  },
});
