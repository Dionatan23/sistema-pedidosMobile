import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../screens/SignIn";

const  Stack = createNativeStackNavigator();

function  AuthRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Sign In" component={SignIn} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default  AuthRoutes;