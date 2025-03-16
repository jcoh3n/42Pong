import React from 'react';
import LoadingState from './home/LoadingState';

interface LoadingProps {
  title?: string;
  message?: string;
  fullScreen?: boolean;
  showPaddle?: boolean;
}

export default function Loading({ 
  title,
  message,
  fullScreen = false,
  showPaddle = false
}: LoadingProps) {
  return (
    <LoadingState
      title={title}
      message={message}
      fullScreen={fullScreen}
      showPaddle={showPaddle}
    />
  );
}