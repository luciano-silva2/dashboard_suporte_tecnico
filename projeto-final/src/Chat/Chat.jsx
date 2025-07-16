import Header from "./ChatComponentes/Header/Header";
import ChatSideBar from "./ChatAlive/ChatSideBar/ChatSideBar";
import ChatAlive from "./ChatAlive/ChatAlive";
import Login from "./Login/Login"
import "./Chat.css";



import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';





import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3l-0dpZuBMCSzHH98W7O43x5RNwUgQ0c",
  authDomain: "aulapw2-7bf99.firebaseapp.com",
  projectId: "aulapw2-7bf99",
  storageBucket: "aulapw2-7bf99.firebasestorage.app",
  messagingSenderId: "566331324215",
  appId: "1:566331324215:web:b1f8f4e594025b62500cb2"
};

const app = initializeApp(firebaseConfig)
const auth =  getAuth(app);
const firestore = getFirestore(app);







function Chat(){

  
  const [user] = useAuthState(auth);


  return(
    <div>
      <Header />
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
export { auth }; 
export { firestore };
