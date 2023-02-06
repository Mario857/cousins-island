import React from 'react';
import { StyledArticleContainer } from './ArticleContainer.styled';

const ArticleContainer: React.FC = ({ children }) => {
  return <StyledArticleContainer>{children}</StyledArticleContainer>;
};

export default ArticleContainer;
