import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, firestore } from "../Firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Login(){
    const loginGoogle = async () => {
        try {
        const provedor = new GoogleAuthProvider();
        const resultado = await signInWithPopup(auth, provedor);
        const usuario = resultado.user;


        const docRef = doc(firestore, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
            email: usuario.email,
            tipo: "cliente"
            });
            console.log("Usuário registrado como cliente.");
        } else {
            console.log("Usuário já cadastrado.");
        }

        } catch (erro) {
        console.error("Erro no login com Google:", erro);
        }
    };
    return(
        <div className="cont-Login">
            <div className="login">
                <button onClick={loginGoogle}>
                    Login com o Google
                </button>
            </div>
        </div>
    )
}
export default Login;