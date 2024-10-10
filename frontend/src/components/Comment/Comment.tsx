import React, { useEffect, useState } from "react";
import config from '../../config.json';
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Heart } from 'lucide-react';
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface CommentData {
  author: string;
  text: string;
  createdAt: string;
  likes: [string] | [];
}

interface CommentAuthor {
  username: string;
  photo?: string;
}

export default function Comment({id}: {id: string}) {
  const [comment, setComment] = useState<CommentData>({author: "", text: "", createdAt: "", likes: []});
  const [commentAuthor, setCommentAuthor] = useState<CommentAuthor>({username: ""});
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const {sendRequest} = useHttp();
  const {token, isAuthenticated} = useAuth();
  const {user} = useUser();
  const navigate = useNavigate();


  if(!isAuthenticated) {
    navigate("/");
  }


  async function fetchComment() {
    try {
      const response = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/comments/${id}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      }); 
      setComment(response);
      setError(null);

    } catch(e) {
      console.error(e);
      setError("Failed to fetch comment");
    }
  };

  async function likeComment() {
    setIsLiked(!isLiked);
   try {
    if(isLiked) {
      const response = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/comments/${id}/${user?.id}/like`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if(!response.ok) {
        setIsLiked(!isLiked);
      }
     } else {
      const response = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/comments/${id}/${user?.id}/like`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if(!response.ok) {
        setIsLiked(!isLiked);
      }
     }
   } catch(e) {
      
   }
  }

  async function fetchCommentUser() {
    if (!comment.author) return;
    try {
      const responseAuthor = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/users/${comment.author}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setCommentAuthor(responseAuthor);
      setError(null);
    } catch(e: any) {
      console.error(e?.message);
      setError("Failed to fetch user information");
    }
  }

  useEffect(() => {
    fetchComment();
  }, [id]);

  useEffect(() => {
    if (comment.author) {
      fetchCommentUser();
    }
  }, [comment]);

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <div key={id} className="flex items-start space-x-3 mb-3 text-sm">
      <Avatar className="w-8 h-8">
        <AvatarImage src={config.REACT_APP_SERVER_URL + "/" + commentAuthor?.photo} alt={commentAuthor.username} />
        <AvatarFallback>{commentAuthor.username?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p className="leading-snug">
          <span className="font-semibold mr-2">{commentAuthor.username || comment.author}</span>
          {comment.text}
        </p>
        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
          <span>{timeAgo(comment.createdAt)}</span>
          {comment.likes?.length > 0 && (
            <span>{comment.likes} {comment.likes?.length === 1 ? 'like' : 'likes'}</span>
          )}
          <button className="font-semibold">Reply</button>
        </div>
      </div>
      <button 
        className={`text-gray-500 hover:text-gray-700 ${isLiked ? 'fill-current text-red-500' : ''}`}
        onClick={() => likeComment()}>
        <Heart size={16} />
      </button>
    </div>
  );
}