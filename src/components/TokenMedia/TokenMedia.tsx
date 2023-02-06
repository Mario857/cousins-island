import React, { useState } from 'react';
import {
  StyledImageWrapper,
  StyledImagePlaceholder,
  StyledImage,
} from './TokenMedia.styled';
import LazyLoad from 'react-lazyload';
import Fade from '@mui/material/Fade';

interface TokenMediaProps {
  src?: string;
  alt?: string;
  height?: string;
  width?: string;
  offset?: number;
  borderRadius?: string;
}

const TokenMedia: React.FC<TokenMediaProps> = ({
  src,
  alt,
  height = '256px',
  width = '100%',
  offset = 256,
  borderRadius = '8px'
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <StyledImageWrapper height={height} width={width} borderRadius={borderRadius}>
      <StyledImagePlaceholder borderRadius={borderRadius} />
      {src && src.length > 0 && (
        <LazyLoad offset={offset}>
          <Fade in={true}>
            <StyledImage
              src={src}
              alt={alt}
              loaded={loaded}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </Fade>
        </LazyLoad>
      )}
    </StyledImageWrapper>
  );
};

export default TokenMedia;
