import api from "@/lib/api";
import type { userType } from "@/types/userType";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

interface AuthContextType {
  token: string | null;
  user?: userType;
  isLoading: boolean;
  isInitialized: boolean;
  login: (user: userType, email: string, password: string) => Promise<void>;
  logout: (user_type: userType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<userType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // CRITICAL FIX: Initialize auth state on app load - runs only once
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("storedToken");
        const storedUser = localStorage.getItem("user") as userType;

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          // Set API headers for subsequent requests
          api.setSecurityData(storedToken);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        localStorage.removeItem("storedToken");
        localStorage.removeItem("user");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  async function login(user_type: userType, email: string, password: string) {
    setIsLoading(true);
    if (token && user) {
      localStorage.removeItem("storedToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(undefined);
    }

    try {
      const loginUser =
        user_type === "seller"
          ? api.seller.loginSeller
          : api.partner.loginDeliveryPartner;
      //access token
      let {
        data: { access_token },
      } = await loginUser({ username: email, password });

      //Local Storage
      localStorage.setItem("storedToken", access_token);
      localStorage.setItem("user", user_type);

      //State
      setToken(access_token);
      setUser(user_type);

      //Request Header
      api.setSecurityData(access_token);
    } catch (error) {
      // Clear any partially set data on error
      localStorage.removeItem("storedToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(undefined);

      if (axios.isAxiosError(error)) {
        throw new Error(
          error?.response?.data?.message || error?.message || "Login failed"
        );
      }
      throw new Error("An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(user_type: userType) {
    setIsLoading(true);
    try {
      // Try to logout from server (don't fail if this fails)
      try {
        const logoutUser =
          user_type === "seller"
            ? api.seller.logoutSeller
            : api.partner.logoutDeliveryPartner;

        await logoutUser();
      } catch (error) {
        console.warn(
          "Server logout failed, continuing with client logout:",
          error
        );
      }
    } finally {
      // Always clear client-side data
      localStorage.removeItem("storedToken");
      localStorage.removeItem("user");
      api.setSecurityData("");
      setToken(null);
      setUser(undefined);
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isInitialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
export { AuthContextProvider, useAuth };
