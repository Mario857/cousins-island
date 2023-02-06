import { StyledAppleIcon, StyledAppleIconProps } from './AppleIcon.styled';

interface AppleIconProps extends StyledAppleIconProps {
  icon: 'flame' | 'earth-globe-americas' | 'glowing-star' | 'chart-increasing';
  alt?: string;
}

const AppleIcon: React.FC<AppleIconProps> = ({
  size = 'small',
  icon,
  alt = 'Apple Icon',
}) => {
  return <StyledAppleIcon src={`/images/${icon}.png`} alt={alt} size={size} />;
};

export default AppleIcon;
