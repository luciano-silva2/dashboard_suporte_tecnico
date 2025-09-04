import { auth } from "../../../Firebase/firebase";
import socket from "../../../socket/socket"
export default function BotaoSair() {
    const handleLogOut = async () => {
        const user = auth.currentUser;
        if(user){
    
        
            socket.emit("logout", {email: user.email})    
        }
        await auth.signOut();
    }
    return (
        <button
            className="btn btn-danger"
            title="Sair"
            onClick={handleLogOut}
        >
            Sair
        </button>
    );
}
