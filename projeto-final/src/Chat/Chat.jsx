import ChatSideBar from "./ChatAlive/ChatSideBar/ChatSideBar";
import ChatAlive from "./ChatAlive/ChatAlive";
import "./Chat.css";



import { useState } from "react";




function Chat({ ticketSelecionado, setTicketSelecionado}){
<<<<<<< HEAD
  return(
      <div className="ChatContainer">
        <>
        <ChatSideBar setTicketSelecionado={ setTicketSelecionado } />
        {ticketSelecionado && <ChatAlive ticketId={ticketSelecionado} />}
        </>
      </div>
=======

  

  return(
    <div>
        <div className="ChatContainer">
          <>
          <ChatSideBar setTicketSelecionado={ setTicketSelecionado } />
          {ticketSelecionado && <ChatAlive ticketId={ticketSelecionado} />}
          </>
        </div>
    </div>
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
  );
}
export default Chat;