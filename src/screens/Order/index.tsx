import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

type RouteDetailParams = {
  Order: {
    order_id: string;
    number: number | string;
  }
}

type OrderRouteProps = RouteProp<RouteDetailParams>

export default function Order() {
  const route = useRoute<OrderRouteProps>();

  return (
    <View style={styles.container}>
      <Text> Tela Order</Text>
      <Text>
        {route.params.order_id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#1d1d2e",
  },
});
