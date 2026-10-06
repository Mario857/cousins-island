import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { StyledBox } from './BoxContent.styled';

const BoxContent = () => {
  return (
    <>
      <Typography variant="h300" sx={{ color: 'text.primary', mb: 2 }} component="h6">
        Case contains
      </Typography>
      <Grid container spacing={4}>
        {new Array(10).fill('x100 tokens $LUA').map((content, index) => (
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 'grow' }}>
            <StyledBox>
              <img src="/images/box2.png" alt="" />
            </StyledBox>
            <Typography
              variant="body2"
              sx={{ color: 'text.primary', mt: 2 }}
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
