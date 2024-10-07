import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface RoundAvatarProps {
  src: string;
  alt: string;
  fallback: string;
  style?: React.CSSProperties;
}

const RoundAvatar: React.FC<RoundAvatarProps> = ({ src, alt, fallback, style }) => (
  <div className="inline-block rounded-full overflow-hidden w-8 h-8 bg-gray-200" style={style}>
    <Avatar className="w-full h-full">
      <AvatarImage 
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain"
      />
      <AvatarFallback className="w-full h-full text-gray-700 flex items-center justify-center text-sm font-medium uppercase">
        {fallback}
      </AvatarFallback>
    </Avatar>
  </div>
);

export default RoundAvatar;