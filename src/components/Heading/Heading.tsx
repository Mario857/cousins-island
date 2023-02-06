import Typography, { TypographyProps } from '@mui/material/Typography';
import { StyledHeading } from './Heading.styled';

const Heading: React.FC<TypographyProps> = ({ children, ...rest }) => {
  return <StyledHeading {...rest}>{children}</StyledHeading>;
};

export default Heading as typeof Typography;
