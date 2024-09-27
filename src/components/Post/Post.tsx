import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon } from 'lucide-react';
import config from '../../config.json';
import { useAuth } from '../../contexts/AuthContext';
import useHttp from '../../hooks/useHttp';
interface PostProps {
  post: {
    id: string;
    caption: string;
    tags: string[];
    location: string;
    image: string;
    likes: number;
    comments: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
  edit: boolean;
  onEditSubmit: ((updatedPost: any) => void) | null;
}

export default function InstagramPost({ post, edit, onEditSubmit }: PostProps) {
  const [caption, setCaption] = useState(post.caption);
  const [tags, setTags] = useState(post.tags);
  const [location, setLocation] = useState(post.location);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const {token} = useAuth();
  const {sendRequest} = useHttp();


  useEffect(() => {
    const fetchUser = async () => {
      const response = await sendRequest(`${config.REACT_APP_SERVER_URL}/api/user/${post.createdBy}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setUser(response);
    };

    fetchUser();
  }, [post.createdBy, sendRequest, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPost = { ...post, caption, tags, location };
    if (onEditSubmit) {
      onEditSubmit(updatedPost);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white border rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex items-center p-3">
        <Avatar className="mr-3">
          <AvatarImage src={`${config.REACT_APP_SERVER_URL+"/"+user.image}`} alt={user.name} className="w-8 h-8 rounded-full" />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{user.name}</p>
          {post.location && <p className="text-xs text-gray-500">{post.location}</p>}
        </div>
    
      </div>
      <img src={`${config.REACT_APP_SERVER_URL}/uploads/${post.image}`} alt="Post" className="w-full h-auto" />
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <HeartIcon
              className={`w-7 h-7 cursor-pointer ${isLiked ? 'fill-red-500 text-red-500' : 'text-black'}`}
              onClick={() => setIsLiked(!isLiked)}
            />
            <MessageCircleIcon className="w-7 h-7 cursor-pointer" />
            <SendIcon className="w-7 h-7 cursor-pointer" />
          </div>
          <BookmarkIcon className="w-7 h-7 cursor-pointer" />
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
              <span className="font-semibold">{user.name}</span> {caption}
            </p>
            {tags.length > 0 && (
              <p className="text-blue-500">
                {tags.map((tag) => `#${tag}`).join(' ')}
              </p>
            )}
          </div>
        )}
        <div className="mt-2 text-sm text-gray-500">
          {/* Render comments */}
        </div>
        <p className="text-xs text-gray-500 mt-2">{new Date(post.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}