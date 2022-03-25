import AppRouter from "components/Router";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj({
          displayName : user.displayName,
          uid: user.uid,
          updateProfile : (args) => user.updateProfile(args),
        });
        } else {
          setUserObj(null);
        }
          setInit(true);
          });
        },[]);
        const refreshUser=()=>{
          const user = authService.currentUser;
          setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
            });
        }
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> :"Initializing.."}
    </>
  );
}

export default App;
