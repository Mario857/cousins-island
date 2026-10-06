import Typography from '@mui/material/Typography';
import MuiBox from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';
import Heading from 'components/Heading/Heading';
import { StyledUSTImage } from './Information.styled';
import BuyForm from './BuyForm';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import { BlueCheckIcon } from 'theme/icons';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';

const Trade = () => {
  const statistics = [
    {
      name: 'Total opened',
      value: 84000,
    },
    {
      name: 'The biggest reward',
      value: 'NFT XYZ',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <MuiBox sx={{ p: 3 }}>
          <Typography
            variant="body4"
            sx={{ color: 'text.secondary', mb: 1 }}
            component="p"
          >
            Luart.io <BlueCheckIcon viewBox="-5 -9 27 27" />
          </Typography>
          <Heading variant="h600" component="h2" sx={{ mb: 2 }}>
            The name of the chest
          </Heading>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {statistics.map(({ name, value }, index) => (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }}
                key={`statistics-${index}`}
              >
                {name}{' '}
                <Typography
                  variant="body2"
                  sx={{ color: 'text.primary' }}
                  component="span"
                >
                  {value}
                </Typography>
              </Typography>
            ))}
          </Stack>
        </MuiBox>
      </CardHeader>
      <CardBody>
        <MuiBox sx={{ p: 3 }}>
          <Typography variant="body3" sx={{ color: 'text.primary', mb: 1 }} component="p">
            Current Price
          </Typography>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', mb: { xs: 3, md: 2 } }}
            spacing={1}
          >
            <StyledUSTImage src="/images/ust.png" alt="UST" />
            <Typography variant="h600" sx={{ color: 'text.primary' }} component="h2">
              100.00 $UST
            </Typography>
          </Stack>
          <BuyForm />
          <ProgressBar
            variant="determinate"
            value={100}
            sx={{ opacity: 0.5, mt: { xs: 4, md: 7 } }}
          />
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}
          >
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              LUA Power required
            </Typography>
            <Typography variant="h200" sx={{ color: 'text.primary' }} component="h6">
              4000
            </Typography>
          </Stack>
        </MuiBox>
      </CardBody>
    </Card>
  );
};

export default Trade;
