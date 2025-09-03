import ChatSideBar from "./ChatAlive/ChatSideBar/ChatSideBar";
import ChatAlive from "./ChatAlive/ChatAlive";
import "./Chat.css";



import { useState } from "react";




function Chat({ ticketSelecionado, setTicketSelecionado}){
  return(
      <div className="ChatContainer">
        <>
        <ChatSideBar setTicketSelecionado={ setTicketSelecionado } />
        {ticketSelecionado && <ChatAlive ticketId={ticketSelecionado} />}
        </>
      </div>
  );
}
export default Chat;