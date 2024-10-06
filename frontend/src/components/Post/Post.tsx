import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon } from 'lucide-react';
import config from '../../config.json';
import { useAuth } from '../../contexts/AuthContext';
import useHttp from '../../hooks/useHttp';
import Comment from '../Comment';
import { useTheme } from '../../contexts/AppThemeContext';
import { useUser } from '../../contexts/UserContext';
import CommentPopUp from '../CommentPopUp';
interface PostProps {
  post: any;
  edit: boolean;
  onEditSubmit: ((updatedPost: any) => void) | null;
}

export default function Post({ post, edit, onEditSubmit }: PostProps) {
  const [caption, setCaption] = useState(post.caption);
  const [tags, setTags] = useState(post.tags);
  const [location, setLocation] = useState(post.location);
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [postUser, setPostUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const {token} = useAuth();
  const{ theme } = useTheme();
  const {sendRequest} = useHttp();
  const {user} = useUser();

  


  useEffect(() => {
    const fetchUser = async () => {
      const response = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/user/${post.createdBy}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setPostUser(response);
      setIsSaved(user?.savedPosts?.includes(post._id) || false);
    };
    fetchUser();
  }, [post.createdBy, sendRequest, token]);



  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const comment = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ author: user?.id, text: message, post_id: post._id }),
      });
      setMessage('');
      console.log(comment);
      setComments((prevComments: any) => [...prevComments, comment._id]);
     
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  const handleLikeClicked = async () => {
    try {
      
      const url = config.REACT_APP_SERVER_URL + "/api/post/" + (isLiked ? "like" : "unlike");
      await sendRequest(url, {
        method: 'POST',
        body: JSON.stringify({postId: post._id, author: user?.id}),
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setIsLiked(!isLiked);
    } catch(e) {
    }
  }

  const savePost = async() => {
    try {
      const url = config.REACT_APP_SERVER_URL + "/api/user/" + (isSaved ? "unsave" : "save");
      await sendRequest(url, {
        method: 'POST',
        body: JSON.stringify({postId: post._id, userId: user?.id}),
        headers: { 'Authorization': 'Bearer ' + token }
      });
     
    } catch(e) {
      
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPost = { ...post, caption, tags, location };
    if (onEditSubmit) {
      onEditSubmit(updatedPost);
    }
  };

  if (!postUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'} border rounded-lg shadow-md max-w-md mx-auto`}>
      <div className="flex items-center p-3">
        <Avatar className="mr-3">
          <AvatarImage src={`${config.REACT_APP_SERVER_URL + "/" + postUser.image}`} alt={postUser.name} className="w-8 h-8 rounded-full" />
          <AvatarFallback>{postUser.name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{postUser.name}</p>
          {post.location && <p className="text-xs text-gray-500">{post.location}</p>}
        </div>
      </div>
      <img src={`${config.REACT_APP_SERVER_URL}/uploads/${post.image}`} alt="Post" className="w-full h-auto" />
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <HeartIcon
              className={`w-7 h-7 cursor-pointer ${isLiked ? 'fill-red-500 text-red-500' : theme === 'dark' ? 'text-white' : 'text-black'}`}
              onClick={() => handleLikeClicked()}
            />
            <MessageCircleIcon onClick={() => setIsOpen(!isOpen)} className="w-7 h-7 cursor-pointer" />
            <p> {comments.length} </p>
            <SendIcon className="w-7 h-7 cursor-pointer" />
          </div>
          <BookmarkIcon 
      onClick={savePost} 
      className={`w-7 h-7 cursor-pointer ${isSaved ? 'fill-current' : ''}`} 
    />
        </div>
        <p className="text-sm font-semibold mb-2">{post.likes} likes</p>
        {edit ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="border rounded-lg p-2 w-full text-sm"
            />
            <input
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(', '))}
              placeholder="Add tags..."
              className="border rounded-lg p-2 w-full text-sm"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location..."
              className="border rounded-lg p-2 w-full text-sm"
            />
            <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 text-sm">
              Save
            </button>
          </form>
        ) : (
          <div className="text-sm">
            <p>
              <span className="font-semibold">{postUser.name}</span> {caption}
            </p>
            {tags.length > 0 && (
              <p className="text-blue-500">
                {tags.map((tag: any) => `@${tag}`).join(' ')}
              </p>
            )}
          </div>
        )}
       <div className="mt-2 text-sm text-gray-500 space-y-2">
          <CommentPopUp comments={comments} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>


        <form onSubmit={handleMessageSubmit} className="flex items-center space-x-2 mt-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a comment..."
            className="border rounded-lg p-2 flex-grow text-sm"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 text-sm">
            Send
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">{new Date(post.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}