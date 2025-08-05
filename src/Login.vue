<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Đăng nhập</h1>
      <button
        @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M21.6 12.227c0-.638-.057-1.252-.164-1.84H12v3.48h5.376a4.59 4.59 0 01-1.992 3.008v2.496h3.224c1.886-1.737 2.972-4.292 2.972-7.144z"
            fill="#4285F4"
          />
          <path
            d="M12 22c2.7 0 4.968-.9 6.624-2.448l-3.224-2.496C14.376 17.736 13.296 18 12 18c-2.52 0-4.656-1.704-5.424-4.008H3.256v2.52A9.996 9.996 0 0012 22z"
            fill="#34A853"
          />
          <path
            d="M6.576 13.992A5.988 5.988 0 016 12c0-.696.12-1.368.336-1.992V7.488H3.256A9.996 9.996 0 002 12c0 1.656.396 3.216 1.08 4.512l3.496-2.52z"
            fill="#FBBC05"
          />
          <path
            d="M12 6.48c1.476 0 2.796.504 3.84 1.488l2.88-2.88C16.968 3.672 14.7 2.76 12 2.76A9.996 9.996 0 003.256 7.488l3.504 2.52C7.344 8.184 9.48 6.48 12 6.48z"
            fill="#EA4335"
          />
        </svg>
        Đăng nhập với Google
      </button>
    </div>
  </div>
</template>

<script>
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";
import { auth } from "./firebase";

export default {
    name: "Login",
    setup() {
        const router = useRouter();

        const loginWithGoogle = async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                const isGoogleUser = user.providerData.some(
                    (provider) => provider.providerId === "google.com"
                );

                if (isGoogleUser) {
                    router.push("/dashboard");
                } else {
                    alert("Bạn phải đăng nhập bằng Google");
                }
            } catch (error) {
                console.error("Đăng nhập thất bại:", error);
                alert("Đăng nhập thất bại");
            }
        };

        return {
            loginWithGoogle,
        };
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>
