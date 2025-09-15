import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import supabase from "../utils/supabase";
// Somewhere in your code
const signIn = async () => {
  const navigation = useNavigation();

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
      navigation.replace('HomeScreen', { user: data.user });
      if (error) {
        console.log("Error", error.message);
      } else {
        console.log("Signed in with Google successfully");
      }
    } else {
      throw new Error("No ID token present!");
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android only, play services not available or outdated
          break;
        default:
        // some other error happened
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
};

export default function Auth() {
  useEffect(() => {
    GoogleSignin.configure(
      {
        webClientId:
          "461165666949-67ec7ri3icttvltt81ohaihl1o3vasbm.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        scopes: [
          /* what APIs you want to access on behalf of the user, default is email and profile
    this is just an example, most likely you don't need this option at all! */
          "https://www.googleapis.com/auth/drive.readonly",
        ],
      },
    );
  },[]);
  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
    />
  );
}
