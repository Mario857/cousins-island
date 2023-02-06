import { useState } from 'react';
import { StyledExpandButton } from './Header.styled';
import Box from '@mui/material/Box';
import { ResizeIcon } from 'theme/icons';
import ExpandedImage from './ExpandedImage';
import { useSelector } from 'react-redux';
import { State } from 'store/store';

const Header = () => {
  const [expand, setExpand] = useState(false);

  const { tokenDetails, collection } = useSelector((state: State) => state.token);

  const isVideo = tokenDetails?.imageURL?.includes('.mp4') || collection?.isVideo;

  return (
    <Box px={3} py={2}>
      <StyledExpandButton
        startIcon={<ResizeIcon sx={{ mr: 1 }} />}
        type="button"
        onClick={() => setExpand(true)}
        disabled={isVideo}
      >
        Expand NFT
      </StyledExpandButton>
      <ExpandedImage expand={expand} setExpand={setExpand} />
    </Box>
  );
};

export default Header;
