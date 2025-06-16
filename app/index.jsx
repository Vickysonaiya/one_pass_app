// import { useRouter } from "expo-router";
// import { Text, TouchableOpacity, View } from "react-native";

// export default function Index() {
//   const router = useRouter();
//   return (
//     <View
//     className="flex-1 items-center justify-center"
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Welcome to 1/pass</Text>
//       <TouchableOpacity onPress={() => {router.push("/testing")}}>
//         <Text className="text-blue-500">Go to Testing</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// --- Mock Geolocation for demonstration ---
// In a real app, replace this with @react-native-community/geolocation or expo-location
// Make sure to handle permissions properly.
const Geolocation = {
    getCurrentPosition: (success, error) => {
        // Simulate a delay for location fetching
        setTimeout(() => {
            // Simulate success for demo (e.g., Surat, India coordinates)
            success({
                coords: {
                    latitude: 21.170240,
                    longitude: 72.831062,
                },
            });
            // Simulate error for demo (uncomment to test error path)
            // error({ code: 1, message: "Location permission denied" });
        }, 1500);
    },
};
// --- End Mock Geolocation ---

// Dial code map
const dialCodeMap = {
    IN: "+91",
    DE: "+49",
    US: "+1",
    GB: "+44",
    FR: "+33",
    // Add more as needed
};

// Placeholder for TopAppBar
const TopAppBar = () => (
    <View style={styles.topAppBar}>
        <Text style={styles.topAppBarText}>1/Pass</Text>
    </View>
);

export default function CountrySelection() {
    const [country, setCountry] = useState("");
    const [countryCode, setCountryCode] = useState(""); // ISO country code (e.g., 'IN')
    const [dialCode, setDialCode] = useState(""); // Dialing code (e.g., '+91')
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation(); // useNavigation hook

    useEffect(() => {
        const fetchCountry = async (lat, lon) => {
            try {
                // Using Nominatim for reverse geocoding, adjust if you have a different API
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );
                const data = await res.json();
                const countryName = data?.address?.country || "";
                const isoCode = data?.address?.country_code?.toUpperCase() || "";
                const dial = dialCodeMap[isoCode] || "";

                setCountry(countryName);
                setCountryCode(isoCode);
                setDialCode(dial);
            } catch (err) {
                console.error("Error fetching location:", err);
                // Handle error gracefully, maybe set a default country or show retry option
            } finally {
                setLoading(false);
            }
        };

        const requestLocation = async () => {
            // For Expo:
            // let { status } = await Location.requestForegroundPermissionsAsync();
            // if (status !== 'granted') {
            //   console.error('Location permission denied');
            //   setLoading(false);
            //   return;
            // }
            // let location = await Location.getCurrentPositionAsync({});
            // fetchCountry(location.coords.latitude, location.coords.longitude);

            // For @react-native-community/geolocation (requires manual linking on bare React Native)
            // Or use the mock Geolocation directly for immediate testing
            Geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    fetchCountry(latitude, longitude);
                },
                (err) => {
                    console.error("Location access denied:", err);
                    setLoading(false);
                },
                // Options for Geolocation.getCurrentPosition
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        requestLocation();
    }, []);

    const handleNext = () => {
        // Pass data via navigation params
        navigation.navigate("Login", {
            screen: 'LoginScreen', // If Login is a stack navigator, specify initial screen
            params: {
                country: country,
                isoCode: countryCode,
                dialCode: dialCode,
            },
        });
    };

    const getFlagUrl = (code) =>
        code ? `https://flagcdn.com/48x36/${code.toLowerCase()}.png` : "";

    return (
        <View style={styles.outerContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <TopAppBar />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Country of residence</Text>
                <Text style={styles.cardText}>
                    The terms and services which apply to you will depend on your country
                    of residence.
                </Text>

                <View style={styles.row}>
                    <View style={styles.col}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text style={styles.loadingText}>Detecting location...</Text>
                            </View>
                        ) : country ? (
                            <View style={styles.countryInputContainer}>
                                {countryCode && (
                                    <Image
                                        source={{ uri: getFlagUrl(countryCode) }}
                                        style={styles.flagImage}
                                        resizeMode="contain"
                                    />
                                )}
                                <TextInput
                                    style={styles.countryTextInput}
                                    value={`${country} (${dialCode})`}
                                    editable={false} // Equivalent to readOnly
                                />
                            </View>
                        ) : (
                            <Text style={styles.errorMessage}>
                                Could not detect your country. Please refresh.
                            </Text>
                        )}
                    </View>

                    {!loading && country && (
                        <View style={styles.buttonCol}>
                            <TouchableOpacity
                                onPress={handleNext}
                                style={styles.nextButton}
                            >
                                <Text style={styles.nextButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Text style={styles.loginText}>
                    Already have an account?{" "}
                    <Text
                        style={styles.loginLink}
                        onPress={() => navigation.navigate("Login")} // Navigate to login screen
                    >
                        Log in
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1, // Takes full height of the screen
        paddingHorizontal: 20, // Replaces sideSpace class
        paddingVertical: 10,
        backgroundColor: '#fff', // Or your desired background color
    },
    topAppBar: {
        height: 100, // Common app bar height
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        // You can add a background color or border to this if needed
    },
    topAppBarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        flex: 1, // Allows card content to expand
        // React Native doesn't have a direct Card component like Bootstrap
        // So we style a View to look like a card
        // No border-0 needed if you don't add a border
        // No direct w-100; flex will handle width or use width: '100%'
    },
    cardTitle: {
        fontSize: 24, // Equivalent to h2
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 15,
    },
    cardText: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 10,
        color: '#555',
    },
    row: {
        flexDirection: 'column', // Stacks elements vertically like Bootstrap's Row with default Col behavior
        marginTop: 20,
    },
    col: {
        marginBottom: 15, // Replaces mb-3
        marginTop: 15, // Replaces mt-3
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#757575',
    },
    countryInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#f9f9f9', // Slightly grey background for input
    },
    flagImage: {
        width: 30,
        height: 20,
        marginRight: 10,
        borderRadius: 3, // For rounded flags
    },
    countryTextInput: {
        flex: 1, // Takes remaining space
        fontSize: 16,
        color: '#333',
        paddingVertical: 0, // Remove default vertical padding from TextInput
        // No shadow-none or border-0 needed as it's a TextInput not a Form.Control
        // background: "transparent" is default for TextInput
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    buttonCol: {
        width: '100%', // Replaces w-100
        paddingBottom: 20, // Replaces pb-2
        alignItems: 'center', // Replaces m-auto for centering
    },
    nextButton: {
        backgroundColor: '#1B3631',
        paddingVertical: 12, // Replaces py-2
        paddingHorizontal: 50, // Replaces px-5 (adjust as needed)
        borderRadius: 8,
        width: '100%', // Replaces w-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        textAlign: 'right', // Replaces text-end
        marginTop: 10, // Replaces mt-2
        fontSize: 15,
        color: '#555',
    },
    loginLink: {
        color: '#007bff', // Bootstrap primary blue
        textDecorationLine: 'none', // No underline for links by default
        fontSize: 16, // Consistent with original
    },
});