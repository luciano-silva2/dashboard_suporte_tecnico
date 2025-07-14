import React from "react";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Chat";

function Login(){
    const loginGoogle = () => {
        const provedor = new GoogleAuthProvider()
        signInWithPopup(auth, provedor)
    }
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