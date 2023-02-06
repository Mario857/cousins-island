import Input from 'components/Input/Input';
import styled from 'styled-components';

export const StyledCountInput = styled(Input)`
  input {
    text-align: center;
  }
`;

export const StyledCountButton = styled.button<{
  active?: boolean;
}>`
  padding: 0;
  width: 14px;
  height: 14px;
  cursor: pointer;
  background: transparent;
  border: 0;
  color: ${(props) =>
    props.active
      ? props.theme.palette.text.primary
      : props.theme.palette.text.secondary};
  &:focus {
    outline: none;
  }
`;
