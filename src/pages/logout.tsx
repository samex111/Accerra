import { signOut, auth } from '../../Backend/firebase';

const handleLogout = () => {
  signOut(auth)
    .then(() => console.log("Logged out"))
    .catch((err) => console.error(err));
};
