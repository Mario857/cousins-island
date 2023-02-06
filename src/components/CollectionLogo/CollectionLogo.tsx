import React from 'react';
import {
  StyledCollectionLogo,
  StyledCollectionLogoProps,
} from './CollectionLogo.styled';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export interface CollectionLogoProps extends StyledCollectionLogoProps {
  src: string;
  alt: string;
}

const CollectionLogo: React.FC<CollectionLogoProps> = ({
  src,
  alt,
  size = 'medium',
}) => {
  return (
    <StyledCollectionLogo size={size}>
      <LazyLoadImage src={src} alt={alt} />
    </StyledCollectionLogo>
  );
};

export default CollectionLogo;
