import * as ROUTES from 'constants/routes';
import {
  DiscordIcon,
  MediumIcon,
  TelegramIcon,
  TwitterIcon,
} from 'theme/icons';
import { StyledSocialLinks } from './SecondaryFooter.styled';

const SocialLinks = () => {
  const socialLinks = [
    {
      href: ROUTES.TELEGRAM,
      icon: <TelegramIcon />,
    },
    {
      href: ROUTES.TWITTER,
      icon: <TwitterIcon viewBox="0 3 24 24" />,
    },
    {
      href: ROUTES.MEDIUM,
      icon: <MediumIcon />,
    },
    {
      href: ROUTES.DISCORD,
      icon: <DiscordIcon />,
    },
  ];

  return (
    <StyledSocialLinks>
      {socialLinks.map((link, index) => (
        <li key={`social-link-${index}`}>
          <span>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.icon}
            </a>
          </span>
        </li>
      ))}
    </StyledSocialLinks>
  );
};

export default SocialLinks;
