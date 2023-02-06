import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from 'components/Button/Button';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import * as ROUTES from 'constants/routes';

const SafetyNotice = () => {
  const [openModal, setOpenModal] = useState(
    !Boolean(Cookies.get('notice_accepted'))
  );
  const [checked, setChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleAccept = () => {
    setOpenModal(false);
    Cookies.set('notice_accepted', 'true', { expires: 365 });
  };

  const location = useLocation();

  const showModal = location.pathname !== ROUTES.TOS;

  return (
    <div>
      {showModal && (
        <Modal
          open={openModal}
          setOpen={setOpenModal}
          heading="Safety Notice"
          allowClose={false}
          width={707}
        >
          <>
            <Typography
              variant="body4"
              color="text.primary"
              mb={4}
              component="p"
            >
              The Cousin Island platform is currently in beta, our Developers and
              Designers are working around the clock to add more features that
              can be viewed here. By proceeding, you are accepting our terms of
              use and understand the risks.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Checkbox checked={checked} onChange={handleChange} />
              <Typography
                variant="body3"
                color="text.primary"
                component="p"
                sx={{
                  cursor: 'pointer',
                }}
              >
                <span onClick={() => setChecked(!checked)}>
                  By moving forward, you accept our{' '}
                </span>
                <a href="https://marketplace.cousin-island.io/tos" target="blank">
                  terms of use
                </a>{' '}
                <span onClick={() => setChecked(!checked)}>
                  and understand that our platform is in beta.
                </span>
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="button"
              sx={{ mt: 4 }}
              disabled={!checked}
              onClick={handleAccept}
            >
              Accept
            </Button>
          </>
        </Modal>
      )}
    </div>
  );
};

export default SafetyNotice;
