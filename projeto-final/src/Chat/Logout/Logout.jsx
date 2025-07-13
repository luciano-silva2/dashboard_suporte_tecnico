import React from "react";
import { auth } from "../Chat";
function Logout(){
    return(
        <div>
            <button onClick={() => auth.signOut()}>Log-out</button>
        </div>
    );
}
export default Logout;