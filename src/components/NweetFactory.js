import { dbService, storageService } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React,{useState} from 'react'

function NweetFactory({userObj}) {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] =useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
        //파일 경로 참조 만들기
        const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        //storage 참조 경로로 파일 업로드 하기
        const uploadFile = await uploadString(attachmentRef, attachment, "data_url");
        console.log(uploadFile);
        //storage에 있는 파일 URL로 다운로드 받기
        attachmentUrl = await getDownloadURL(uploadFile.ref);
        }
        
        //트윗할때, 메시지와 사진도 같이 firestore에 생성
        const nweetPosting = {
        text : nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
        };
        await addDoc(collection(dbService, "nweets"), nweetPosting);
        setNweet("");
        setAttachment("");
        };
    const onChange=(event)=>{
        const { 
            target : {value},
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) =>{
        const {
            target:{files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) =>{
            const { currentTarget : { result },
         } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    } ;

    const onClearAttachment =()=> setAttachment(null);
  return (
    <div>
        <form onSubmit={onSubmit}>
            <input 
                value={nweet} 
                onChange={onChange} 
                type="text" 
                placeholder="What's on your mind?" 
                maxLength={120}
            />
            <input type="file" accept='image/*' onChange={onFileChange}/>
            <input type="submit" value="NWeeter" />
            {attachment && (<div>
                <img src={attachment} width="50px" height="50px" alt=""/>
                <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    </div>
  )
}

export default NweetFactory