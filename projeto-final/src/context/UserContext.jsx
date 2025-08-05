import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../Firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userAuth) return;

    const fetchUser = async () => {
      try {
        const docRef = doc(firestore, "usuarios", userAuth.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      } catch (err) {
        console.error("Erro ao pegar dados do usuário:", err);
      }
    };

    fetchUser();
  }, [userAuth]);

  return (
    <UserContext.Provider value={{ user: userAuth, userData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
