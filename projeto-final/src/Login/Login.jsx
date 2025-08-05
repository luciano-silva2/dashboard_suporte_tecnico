import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { auth, firestore } from "../Firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Login() {
    const [modo, setModo] = useState(false); // false = cliente, true = funcionário

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

        } catch (erro) {
            console.error("Erro no login com Google:", erro);
        }
    };

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

                        <button
                            onClick={loginAnonimo}
                            className="login-button"
                        >
                            Entrar como Anônimo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
