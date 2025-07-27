import ChatSideBar from "./ChatAlive/ChatSideBar/ChatSideBar";
import ChatAlive from "./ChatAlive/ChatAlive";
import Login from "./Login/Login"
import { auth } from "../Firebase/firebase";
import "./Chat.css";







import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';











function Chat(){

  
  const [user] = useAuthState(auth);


  return(
    <div>
        <div className="ChatContainer">
          {user? (
            <>
            <ChatSideBar />
            <ChatAlive />
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