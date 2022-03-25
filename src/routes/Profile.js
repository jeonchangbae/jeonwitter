import { authService } from 'fbase';
import React,{ useState}from 'react'
import { useNavigate} from 'react-router-dom';
import { updateProfile } from "@firebase/auth";

function Profile({refreshUser, userObj}) {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/")
        refreshUser();
    }

    const onChange=(event) => {
        const {
            target : {value},
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async(event) =>{
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
        }
        refreshUser();
    }
    
    return (
        <>
        <form onSubmit={onSubmit}>
            <input
                onChange={onChange}
                type='text' 
                placeholder="Display name" 
                value={newDisplayName}
            />
            <input type='submit' value='Update Profile' />
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}
export default Profile;