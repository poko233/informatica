import { useUserStore } from "../../context/userStore";
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import supabase from '../../utils/supabase';

export default function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(async () => {
      await GoogleSignin.signOut(); // Google Sign-Out
      await supabase.auth.signOut(); // Supabase Sign-Out
      logout();
      router.replace("/signin");
      setLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16 }}>Cargando usuario...</Text>
      </View>
    );
  }

  const meta = user.user_metadata || {};
  const avatar = meta.picture || meta.avatar_url;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{meta.full_name || meta.name || "Sin nombre"}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Proveedor:</Text>
          <Text style={styles.value}>{user.app_metadata?.provider || "-"}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>{"Por definir"}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Creado:</Text>
          <Text style={styles.value}>{new Date(user.created_at).toLocaleString()}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Último acceso:</Text>
          <Text style={styles.value}>{new Date(user.last_sign_in_at).toLocaleString()}</Text>
        </View>
        <Button title={loading ? "Cerrando sesión..." : "Cerrar sesión"} onPress={handleLogout} disabled={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    paddingVertical: 32,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: 320,
    maxWidth: "90%",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    textAlign: "center",
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#444",
    width: 120,
  },
  value: {
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
});