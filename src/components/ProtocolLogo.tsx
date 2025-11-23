import { useState } from 'react';

interface ProtocolLogoProps {
  project: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProtocolLogo({ project, size = 'md' }: ProtocolLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const imageUrl = `https://icons.llama.fi/protocols/${project.toLowerCase()}.jpg`;

  if (imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {project[0]?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${project} logo`}
      className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0 bg-gray-800`}
      onError={() => setImageError(true)}
    />
  );
}
