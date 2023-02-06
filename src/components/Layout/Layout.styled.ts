import styled from 'styled-components';
import MuiBox from '@mui/material/Box';

export const StyledLayout = styled.div<{
  bg?: 'primary' | 'secondary';
  hide?: boolean;
}>`
  background: #1d2343;

  ${(props) => props.theme.breakpoints.up('md')} {
    background: #1d2343
      url(${(props) =>
        props.bg === 'primary' ? '/images/bg2.jpg' : '/images/bg1.jpg'})
      no-repeat;
    background-size: cover;
  }

  display: ${(props) => (props.hide ? 'none' : 'block')};
`;

export const StyledWrappedContent = styled.div`
  margin-top: 20px;
  margin-bottom: 128px;

  ${(props) => props.theme.breakpoints.up('md')} {
    min-height: calc(100vh - 200px);
  }
`;

export const StyledContainer = styled(MuiBox)`
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 128px;
  padding: 0 24px;
  position: relative;
  max-width: 1352px;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0 16px;
    min-height: calc(100vh - 200px);
  }
`;

export const StyledLoaderContainer = styled.div`
  min-height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
