import ChatSideBar from "./ChatAlive/ChatSideBar/ChatSideBar";
import ChatAlive from "./ChatAlive/ChatAlive";
import Login from "./Login/Login"
import { auth } from "../Firebase/firebase";
import "./Chat.css";







import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from "react";











function Chat(){

  
  const [user] = useAuthState(auth);
  const [ticketSelecionado, setTicketSelecionado] = useState(null)

  return(
    <div>
        <div className="ChatContainer">
          {user? (
            <>
            <ChatSideBar setTicketSelecionado={ setTicketSelecionado } />
            {ticketSelecionado && <ChatAlive ticketId={ticketSelecionado} />}
            </>
            )
            : (
              <Login />
              )
            }
        </div>
    </div>
  );
}
export default Chat;