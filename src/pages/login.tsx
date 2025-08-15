import { auth, provider, signInWithPopup } from '../../Backend/firebase';

export default function GoogleLogin() {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <button onClick={loginWithGoogle} style={{ padding: "10px 20px", background: "#4285F4", color: "#fff" }}>
      Sign in with Google
    </button>
  );
}
