import Card from 'components/Card/Card';
import { StyledBoxImage, StyledImageContainer } from './BoxImage.styled';

const BoxImage = () => {
  return (
    <StyledBoxImage>
      <Card>
        <StyledImageContainer>
          <img src="/images/box1-large.png" alt="" />
        </StyledImageContainer>
      </Card>
    </StyledBoxImage>
  );
};

export default BoxImage;
