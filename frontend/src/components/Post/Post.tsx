import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, Share2Icon, TwitterIcon, FacebookIcon, LinkIcon } from 'lucide-react';
import config from '../../config.json';
import { useAuth } from '../../contexts/AuthContext';
import useHttp from '../../hooks/useHttp';
import Comment from '../Comment';
import { useTheme } from '../../contexts/AppThemeContext';
import { useUser } from '../../contexts/UserContext';
import CommentPopUp from '../CommentPopUp';
import RoundAvatar from '../ui/RoundAvatar';
import { useNavigate } from 'react-router-dom';
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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const {token, isAuthenticated} = useAuth();
  const{ theme } = useTheme();
  const {sendRequest} = useHttp();
  const {user} = useUser();
  const navigate = useNavigate();

  if(!isAuthenticated) {
    navigate("/");
  }

  


  useEffect(() => {
    const fetchUser = async () => {
      const response = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/users/${post.createdBy}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setPostUser(response);
    };
    setIsSaved(user?.savedPosts?.includes(post._id) || false);
    console.log(user?.savedPosts)
    setIsLiked(post.likes.includes(user?.id));

    fetchUser();
  }, [user, post, sendRequest, token]);


  const gotoProfile = () =>  {
      navigate("/profile", {state: {user: {...postUser, id: postUser._id}}}); 
  }

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const comment = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ author: user?.id, text: message, postId: post._id }),
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
      const url = `${config.REACT_APP_SERVER_URL}/api/posts/${post._id}/${isLiked ? "unlike" : "like"}`;
      const response = await sendRequest(url, {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id })
      });
  
      if (response) {
        setIsLiked(!isLiked);
        post.likes = isLiked ? post.likes - 1 : post.likes + 1;
      }
    } catch (e) {
      
    }
  };

  const savePost = async () => {
    try {
      const newSavedState = !isSaved;
      const url = `${config.REACT_APP_SERVER_URL}/api/users/${user?.id}/saved-posts`;
      
      if (newSavedState) {
        await sendRequest(url, {
          method: 'POST',
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ postId: post._id })
        });
      } else {
        await sendRequest(`${url}/${post._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      }
      
      setIsSaved(newSavedState);
    } catch (e) {
      console.error('Error saving/unsaving post:', e);
      // Optionally, notify the user of the error
    }
  }

  const handleShare = (platform: string) => {
    const postUrl = `${window.location.origin}/post/${post._id}`; // Adjust this URL structure as needed
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=Check out this post!&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(postUrl).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    setShowShareOptions(false);
  };

  const sendIconClicked = (e: any) => {
    e.stopPropagation();
    setShowShareOptions(!showShareOptions);
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
    <div onClick={() => setShowShareOptions(false)} className={`${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'} border rounded-lg shadow-md max-w-md mx-auto`}>
      <div className="flex items-center p-3">
      <div onClick={() => gotoProfile()}>
      <RoundAvatar
  style={{ marginRight: '10px' }}
  src={`${config.REACT_APP_SERVER_URL}/${postUser.photo}`}
  alt={postUser.username}
  fallback={postUser.username?.charAt(0).toUpperCase()}
/>
      </div>
        <div>
     
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
            <p> {post?.likes?.length}</p>
            <MessageCircleIcon onClick={() => setIsOpen(!isOpen)} className="w-7 h-7 cursor-pointer" />
            <p> {comments.length} </p>
            <SendIcon onClick={sendIconClicked} className="w-7 h-7 cursor-pointer" />
          </div>
          <BookmarkIcon 
      onClick={savePost} 
      className={`w-7 h-7 cursor-pointer ${isSaved ? 'fill-current' : ''}`} 
    />
   {showShareOptions && (
  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
    <div className="py-2">
      <button 
        onClick={() => handleShare('twitter')} 
        className="flex items-center justify-center px-4 py-3 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
      >
        <TwitterIcon className="mr-3" size={18} />
        Share on Twitter
      </button>
      <button 
        onClick={() => handleShare('facebook')} 
        className="flex items-center justify-center px-4 py-3 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
      >
        <FacebookIcon className="mr-3" size={18} />
        Share on Facebook
      </button>
      <button 
        onClick={() => handleShare('copy')} 
        className="flex items-center justify-center px-4 py-3 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
      >
        <LinkIcon className="mr-3" size={18} />
        Copy Link
      </button>
    </div>
  </div>
)}
        </div>
      
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

         {copySuccess && (
                <div className="absolute left-0 mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                  Link copied!
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