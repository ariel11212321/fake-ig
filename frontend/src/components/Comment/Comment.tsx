import { useEffect, useState } from "react";
import config from '../../config.json';
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export default function Comment({id}: {id: String}) {
  const [comment, setComment] = useState({author: "", text: ""});
  const {sendRequest} = useHttp();
  const {token} = useAuth();    
  

  async function fetchComment() {
    try {
      const response = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/comment/`+id, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
  
      setComment({
        ...response
      });
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchComment();
  }, [id]);

  return (
    <div className="flex items-start space-x-2 mb-2">
      <Avatar className="mt-1">

      </Avatar>
      <div>
        <p className="text-sm"> 
          <span className="font-semibold">{comment.author}</span> {comment.text}
        </p>
      </div>
    </div>
  );
}