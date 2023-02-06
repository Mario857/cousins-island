import styled from 'styled-components';

export const StyledCollectionNFTs = styled.div`
  min-height: calc(100vh - 192px);
`;

export const StyledLoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 126px;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 256px;
  }
`;
