import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { StyledBadge, StyledIconWrapper } from './TestnetBadge.styled';
import Tooltip from '@mui/material/Tooltip';
import { InfoIcon } from 'theme/icons';

const TestnetBadge = () => {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  if (isMobile) {
    return (
      <Tooltip title="You're on testnet" arrow enterTouchDelay={0}>
        <StyledIconWrapper>
          <InfoIcon viewBox="0 -4 27 27" />
        </StyledIconWrapper>
      </Tooltip>
    );
  }

  return <StyledBadge>Testnet</StyledBadge>;
};

export default TestnetBadge;
