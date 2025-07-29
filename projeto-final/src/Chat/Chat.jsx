import ChatSideBar from "./ChatAlive/ChatSideBar/ChatSideBar";
import ChatAlive from "./ChatAlive/ChatAlive";
import "./Chat.css";



import { useState } from "react";




function Chat(){

  const [ticketSelecionado, setTicketSelecionado] = useState(null)

  return(
    <div>
        <div className="ChatContainer">
          <>
          <ChatSideBar setTicketSelecionado={ setTicketSelecionado } />
          {ticketSelecionado && <ChatAlive ticketId={ticketSelecionado} />}
          </>
        </div>
    </div>
  );
}
export default Chat;