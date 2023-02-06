import IconButton from 'components/Button/IconButton';
import { ArrowUpIcon } from 'theme/icons';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const ScrollUpButton = () => {
  const [visible, setVisible] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 991 });

  const toggleVisible = () => {
    if (isMobile) {
      const position = window.pageYOffset;

      if (position > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);

    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      position="fixed"
      bottom={100}
      right={32}
      display={visible ? 'block' : 'none'}
    >
      <IconButton type="button" onClick={handleClick}>
        <ArrowUpIcon />
      </IconButton>
    </Box>
  );
};

export default ScrollUpButton;
