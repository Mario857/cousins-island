import { StyledCard } from './Card.styled';
import { CardProps as MuiCardProps } from '@mui/material/Card';

interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'primary' | 'secondary';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'primary',
  sx = {},
  ...rest
}) => {
  return (
    <StyledCard
      sx={
        variant === 'secondary'
          ? { padding: 0, background: 'transparent' }
          : { padding: '24px', background: 'rgba(255, 255, 255, 0.04)', ...sx }
      }
      {...rest}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
