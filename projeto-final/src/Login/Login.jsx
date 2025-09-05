import React, { useState } from "react";
<<<<<<< HEAD
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, firestore } from "../Firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 
import socket from "../socket/socket.js"
import useUser from "../context/UserContext.jsx"

function Login() {
    const [modo, setModo] = useState(false);
    const navigate = useNavigate();
=======
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { auth, firestore } from "../Firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Login() {
    const [modo, setModo] = useState(false); // false = cliente, true = funcionário
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386

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

<<<<<<< HEAD
            // Avisa o servidor que o usuário está online, enviando apenas o e-mail

     
            
=======
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
        } catch (erro) {
            console.error("Erro no login com Google:", erro);
        }
    };

<<<<<<< HEAD
=======
    const loginAnonimo = async () => {
        try {
            const resultado = await signInAnonymously(auth);
            const usuario = resultado.user;

            const docRef = doc(firestore, "usuarios", usuario.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    tipo: modo ? "funcionario" : "cliente",
                    anonimo: true,
                    criadoEm: new Date()
                });
                console.log("Usuário anônimo registrado");
            } else {
                console.log("Usuário anônimo já existe");
            }

        } catch (erro) {
            console.error("Erro no login anônimo:", erro);
        }
    };

>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
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
<<<<<<< HEAD
=======

                        <button
                            onClick={loginAnonimo}
                            className="login-button"
                        >
                            Entrar como Anônimo
                        </button>
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
                    </div>
                </div>
            </div>
        </div>
    );
}

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
