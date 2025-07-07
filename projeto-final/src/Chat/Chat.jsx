import Header from "./ChatComponentes/Header/Header";
import ChatSideBar from "./ChatComponentes/ChatSideBar/ChatSideBar";
import ChatAlive from "./ChatAlive/ChatAlive";
import "./Chat.css";



function Chat(){
  return(
    <div>
      <Header />
        <div className="ChatContainer">
          <ChatSideBar /> <ChatAlive />
        </div>
    </div>
  );
}
export default Chat;

