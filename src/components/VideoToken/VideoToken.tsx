import React from 'react';
import { StyledVideoToken, StyledVideoTokenProps } from './VideoToken.styled';

interface VideoTokenProps extends StyledVideoTokenProps {
  src: string;
  controls?: boolean;
}

const VideoToken: React.FC<VideoTokenProps> = ({
  src,
  size = 'medium',
  controls = false,
  borderRadius = '0px',
}) => {
  return (
    <StyledVideoToken size={size} borderRadius={borderRadius}>
      <video
        autoPlay={false}
        preload="metadata"
        src={src}
        controls={controls}
      ></video>
    </StyledVideoToken>
  );
};

export default VideoToken;
