import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
    className="flex-1 items-center justify-center"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to 1/pass</Text>
      <TouchableOpacity onPress={() => {router.push("/home")}}>
        <Text className="text-blue-500">Go to Testing</Text>
      </TouchableOpacity>
    </View>
  );
}
