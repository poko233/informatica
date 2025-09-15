import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useUserStore } from "../context/userStore";
import supabase from "../utils/supabase";

export default function SignInScreen() {
 const setUser = useUserStore((state) => state.setUser);
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");

 useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "461165666949-67ec7ri3icttvltt81ohaihl1o3vasbm.apps.googleusercontent.com",
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
  }, []);

  const signIn = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("Response", response);

      if (response.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken,
        });

        console.log("Supabase Auth Response:", { data, error });
        console.log("User metadata", { user: data.user });
        if (error) {
          setErrorMsg(error.message);
        } else {
          setUser(data.user);
          router.replace("/(tabs)/profile");
        }
      } else {
        setErrorMsg("No ID token present!");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            setErrorMsg("Operación en progreso...");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setErrorMsg("Google Play Services no disponible o desactualizado.");
            break;
          default:
            setErrorMsg("Error desconocido de Google SignIn.");
        }
      } else {
        setErrorMsg("Error inesperado al iniciar sesión.");
      }
    }
    setLoading(false);
  };


 return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ingenieria Informática</Text>
        <Text style={styles.subtitle}>Universidad Mayor de San Simón</Text>
        <View style={{ height: 32 }} />
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : null}
        {loading ? (
          <View style={{ marginVertical: 16, alignItems: "center" }}>
            <Text style={{ textAlign: "center", marginBottom: 8 }}>Iniciando sesión...</Text>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <GoogleSigninButton
            style={styles.googleBtn}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          />
        )}
      </View>
    </View>
 );
}


const styles = StyleSheet.create({
 container: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: 16,
 },
 card: {
  width: 320,
  maxWidth: "90%",
  backgroundColor: "#fff",
  borderRadius: 24,
  padding: 32,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  borderWidth: 2,
  borderColor: "#222",
 },
 title: {
  fontSize: 28,
  fontWeight: "bold",
  fontFamily: "monospace",
  marginBottom: 8,
  textAlign: "center",
 },
 subtitle: {
  fontSize: 16,
  color: "#444",
  fontFamily: "monospace",
  textAlign: "center",
 },
 googleBtn: {
  marginTop: 32,
  width: "100%",
  borderRadius: 8,
  overflow: "hidden",
 },
 error: {
  color: "#d00",
  marginBottom: 8,
  textAlign: "center",
  fontWeight: "bold",
 },
});
