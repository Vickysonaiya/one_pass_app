import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
    className="flex-1 items-center justify-center bg-red-100"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <TouchableOpacity onPress={() => {router.push("/testing")}}>
        <Text className="text-blue-500">Go to Testing</Text>
      </TouchableOpacity>
    </View>
  );
}
