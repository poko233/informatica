import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
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
    checkUserSignedIn();
  }, []);

  const checkUserSignedIn = async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();

      if (userInfo && userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.idToken,
        });

        if (!error && data?.user) {
          setUser(data.user);
          router.replace("/(tabs)/profile");
        }
      } else {
        console.log("No hay usuario logueado todavía");
      }
    } catch (err) {
      console.log("Error en checkUserSignedIn:", err);
    } finally {
      setLoading(false);
    }
  };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Tarjeta unificada */}
        <View style={styles.card}>
          {/* Sección del header */}
          <View style={styles.headerContent}>
            <Text style={styles.title}>Ingeniería Informática</Text>
            <Text style={styles.subtitle}>Universidad Mayor de San Simón</Text>
          </View>

          {/* Sección de errores */}
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Sección del botón */}
          <View style={styles.buttonSection}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Iniciando sesión...</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    minHeight: 500,
    justifyContent: "space-between",
  },
  headerContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 12,
    textAlign: "center",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    fontFamily: "monospace",
    textAlign: "center",
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffcdd2",
    width: "100%",
    marginVertical: 16,
  },
  error: {
    color: "#c62828",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonSection: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  googleBtn: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});