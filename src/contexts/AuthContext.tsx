import React, { useState, createContext, ReactNode, useEffect } from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  loading: boolean;
  loadingAuth: boolean;
  signOut: () => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
  });

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      const userInfo = await AsyncStorage.getItem("@sistemaPedidos");
      let hashUser: UserProps = JSON.parse(userInfo || "{}");

      if (Object.keys(hashUser).length > 0) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${hashUser.token}`;
        setUser({
          id: hashUser.id,
          name: hashUser.name,
          email: hashUser.email,
          token: hashUser.token,
        });
      }

      setLoading(false);
    }

    getUser();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);

    try {
      const response = await api.post("/session", {
        email,
        password,
      });
      //console.log(response.data);

      const { id, name, token } = response.data;

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@sistemaPedidos", JSON.stringify(data));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({
        id,
        name,
        email,
        token,
      });
      setLoadingAuth(false);
    } catch (error) {
      console.log("Erro ao acessar", error);
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser({
        id: "",
        name: "",
        email: "",
        token: "",
      });
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, loading, loadingAuth, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
