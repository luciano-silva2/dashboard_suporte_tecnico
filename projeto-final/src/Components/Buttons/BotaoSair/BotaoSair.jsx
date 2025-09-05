import { auth } from "../../../Firebase/firebase";
<<<<<<< HEAD
import socket from "../../../socket/socket"
export default function BotaoSair() {
    const handleLogOut = async () => {
        const user = auth.currentUser;
        if(user){
    
        
            socket.emit("logout", {email: user.email})    
        }
        await auth.signOut();
    }
=======
export default function BotaoSair() {
        
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
    return (
        <button
            className="btn btn-danger"
            title="Sair"
<<<<<<< HEAD
            onClick={handleLogOut}
=======
            onClick={() => auth.signOut()}
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
        >
            Sair
        </button>
    );
}
