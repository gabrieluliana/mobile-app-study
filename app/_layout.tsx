import { Text, View } from "react-native";
import { Slot, Stack } from "expo-router";
import "../global.css"

function RootLayout() {
  // return <Stack />;
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  )
}


export default RootLayout