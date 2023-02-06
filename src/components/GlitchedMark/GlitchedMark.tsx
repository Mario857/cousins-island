import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { GlitchedSignIcon } from 'theme/icons';

const GlitchedMark = () => {
  const title = 'Glitched traits in this NFT';

  return (
    <Box ml={1} component="span">
      <Tooltip title={title} arrow placement="top">
        <GlitchedSignIcon
          fontSize="small"
          sx={{
            width: '20px',
            height: '20px',
            marginLeft: '-8px',
            marginBottom: '-6px',
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default GlitchedMark;
