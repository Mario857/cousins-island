import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';
import { Link } from 'react-router-dom';
import Fade from '@mui/material/Fade';
import { StyledDescriptionWrapper } from './NotFound.styled';
import * as ROUTES from 'constants/routes';

interface NotFoundProps {
  heading?: string;
  description?: string;
  buttonHref?: string | null;
  buttonTitle?: string;
  buttonOnClick?: (e: React.MouseEvent<HTMLElement>) => void;
  mt?: number;
  children?: React.ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({
  heading = 'No items',
  description = 'Come back soon! Or try to browse something for you on our marketplace',
  children,
  buttonHref = ROUTES.HOME,
  buttonTitle = 'Browse Marketplace',
  buttonOnClick,
  mt = 8,
}) => {
  return (
    <Fade in={true}>
      <Box sx={{ mt: mt, textAlign: 'center' }}>
        <Typography variant="h600" sx={{ color: 'text.primary', mb: 1 }} component="h3">
          {heading}
        </Typography>
        <StyledDescriptionWrapper>
          <Typography variant="h400" sx={{ color: 'text.secondary' }} component="h5">
            {description}
          </Typography>
        </StyledDescriptionWrapper>
        {buttonTitle && (buttonHref || buttonOnClick) && (
          <>
            {buttonOnClick && (
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={buttonOnClick}
              >
                {buttonTitle}
              </Button>
            )}
            {buttonHref && !buttonOnClick && (
              <Link to={buttonHref}>
                <Button variant="contained" color="primary" type="button">
                  {buttonTitle}
                </Button>
              </Link>
            )}
          </>
        )}
        {children}
      </Box>
    </Fade>
  );
};

export default NotFound;
