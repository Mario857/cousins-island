import {
  StyledImage,
  StyledImagePlaceholder,
  StyledImageWrapper,
} from './Image.styled';
import LazyLoad from 'react-lazyload';
import { useState } from 'react';
import Fade from '@mui/material/Fade';
import VideoToken from 'components/VideoToken/VideoToken';
import { useSelector } from 'react-redux';
import { State } from 'store/store';

interface ImageProps {
  isVideo: boolean;
}

const Image: React.FC<ImageProps> = ({ isVideo = false }) => {
  const { tokenDetails } = useSelector((state: State) => state.token);

  const imageURL = tokenDetails?.imageURL || '';

  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  if (!isVideo && imageURL.includes('.mp4')) isVideo = true;

  return !isVideo ? (
    <StyledImageWrapper>
      <StyledImagePlaceholder />
      {imageURL && imageURL.length > 0 && (
        <LazyLoad>
          <Fade in={true}>
            <StyledImage
              src={imageURL}
              alt="NFT"
              onLoad={handleLoad}
              onError={handleLoad}
              loaded={loaded}
            />
          </Fade>
        </LazyLoad>
      )}
    </StyledImageWrapper>
  ) : (
    <VideoToken src={imageURL} size="large" controls={true} />
  );
};

export default Image;
