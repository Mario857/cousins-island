import { State } from 'store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  StyledCloseButton,
  StyledDescriptionContainer,
  StyledImageWrapper,
} from './ExpandedImage.styled';
import Dialog from '@mui/material/Dialog';
import { CloseIcon } from 'theme/icons';

interface ExpandedImageProps {
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpandedImage: React.FC<ExpandedImageProps> = ({ expand, setExpand }) => {
  const { tokenDetails } = useSelector((state: State) => state.token);

  const imageURL = tokenDetails?.imageURL || '';
  const name = tokenDetails?.name;

  return (
    <Dialog
      open={expand}
      onClose={() => setExpand(false)}
      PaperComponent={(props) => <div {...props}></div>}
      transitionDuration={0}
    >
      <StyledImageWrapper>
        <StyledCloseButton type="button" onClick={() => setExpand(false)}>
          <CloseIcon />
        </StyledCloseButton>
        <img src={imageURL} alt={name} />
        {name && (
          <StyledDescriptionContainer>{name}</StyledDescriptionContainer>
        )}
      </StyledImageWrapper>
    </Dialog>
  );
};

export default ExpandedImage;
