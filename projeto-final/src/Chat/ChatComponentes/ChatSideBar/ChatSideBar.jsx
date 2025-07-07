import React from "react";
import "../../Chat.css";
function ChatSideBar(){
    return(
        <div 
        className="ChatSideBar">

            <ul className="contatos">
                <li 
                className="contato">
                    Nome
                </li>
                <li
                className="contato">
                    Nome 2
                </li>
            </ul>

        </div>
    );
}

export default ChatSideBar;