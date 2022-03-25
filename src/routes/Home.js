import Nweet from 'components/Nweet';
import { dbService} from 'fbase';

import {
    collection,
    onSnapshot,
    query,
    orderBy,
    } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import NweetFactory from 'components/NweetFactory';

function Home({userObj}) {
    
    const [nweets, setNweets] = useState([]);
    

    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "asc")
        );
        
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArr);
        });
    },[]);
    
    

  return (
    <div>
        <NweetFactory userObj={userObj} />
        <div>
            {nweets.map((nweet) => (
                <Nweet 
                    key={nweet.id} 
                    nweetObj={nweet} 
                    isOwner={nweet.creatorId === userObj.uid}
                />
            ))}
        </div>
    </div>
  )
}

export default Home