import styled from 'styled-components';
import { palette } from 'theme/palette';

export const StyledFilters = styled.div`
  padding: 24px 24px 8px 24px;
  border-bottom: 1px solid ${palette.alphaLight[200]};
`;

export const StyledTypeButton = styled.button<{ isActive?: boolean }>`
  padding: 10px 16px;
  background: ${(props) =>
    props.isActive ? palette.alphaLight[100] : palette.alphaLight[50]};
  border: 1px solid
    ${(props) =>
      props.isActive ? palette.alphaLight[400] : palette.alphaLight[200]};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  line-height: 20px;
  color: ${(props) => props.theme.palette.text.primary};
  cursor: pointer;
  transition: 350ms;
  margin-bottom: 16px;
  height: 40px;

  &:hover {
    background: ${palette.alphaLight[100]};
    border: 1px solid ${palette.alphaLight[400]};
  }
`;
