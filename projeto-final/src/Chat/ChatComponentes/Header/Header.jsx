import React from "react";

import Logout from "../../Logout/Logout";

import "../../Chat.css";
function Header(){
    return(
        <header>
            <div>
                <div>
                    Ghat
                </div>
                <div>
                    <Logout />
                </div>
            </div>
        </header>
    )
}
export default Header;