import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { StyledBox } from './BoxContent.styled';

const BoxContent = () => {
  return (
    <>
      <Typography variant="h300" color="text.primary" component="h6" mb={2}>
        Case contains
      </Typography>
      <Grid container spacing={4}>
        {new Array(10).fill('x100 tokens $LUA').map((content, index) => (
          <Grid item xs={12} sm={4} md={3} lg>
            <StyledBox>
              <img src="/images/box2.png" alt="" />
            </StyledBox>
            <Typography
              variant="body2"
              color="text.primary"
              mt={2}
              component="p"
              align="center"
            >
              {content}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BoxContent;
