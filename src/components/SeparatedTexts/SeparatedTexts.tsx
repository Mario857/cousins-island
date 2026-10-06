import Typography, { TypographyProps } from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/system';

interface SeparatedTexts {
  left?: string | React.JSX.Element | number;
  right?: string | React.JSX.Element | number;
  sx?: SxProps;
  color?: TypographyProps['color'];
}

const SeparatedTexts: React.FC<SeparatedTexts> = ({
  left,
  right,
  sx = { mb: '12px' },
  color = 'text.primary',
}) => {
  return (
    <Box sx={sx}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color }}>
          {left}
        </Typography>
        <Typography variant="body2" sx={{ color }}>
          {right}
        </Typography>
      </Stack>
    </Box>
  );
};

export default SeparatedTexts;
