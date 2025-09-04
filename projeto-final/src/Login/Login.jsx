import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, firestore } from "../Firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 
import socket from "../socket/socket.js"
import useUser from "../context/UserContext.jsx"

function Login() {
    const [modo, setModo] = useState(false);
    const navigate = useNavigate();

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
                    tipo: modo ? "funcionario" : "cliente",
                    anonimo: false,
                    criadoEm: new Date()
                });
                console.log("Usuário registrado");
            } else {
                await setDoc(docRef, {
                    tipo: modo ? "funcionario" : "cliente"
                }, { merge: true });
                console.log("Usuário já cadastrado");
            }

            // Avisa o servidor que o usuário está online, enviando apenas o e-mail

     
            
        } catch (erro) {
            console.error("Erro no login com Google:", erro);
        }
    };

    return (
        <div className="container">
            <div className="cont-Login">
                <div className="div-login">
                    <div className="login">
                        <div className="Titulo">
                            <span>
                                Bem-vindo(a) à assistência técnica
                            </span>
                            <p>
                                Escolha com que tipo de conta você gostaria de logar:
                            </p>
                        </div>

                        <button
                            onClick={() => setModo(prev => !prev)}
                            className="button-modo"
                        >
                            {modo ? "Funcionário" : "Cliente"}
                        </button>

                        <button
                            onClick={loginGoogle}
                            className="login-button"
                        >
                            Login com o Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;