import Layout from 'components/Layout/Layout';
import React from 'react';
import * as ROUTES from 'constants/routes';
import Heading from 'components/Heading/Heading';
import Tabs from 'components/Tabs/Tabs';
import Tab from 'components/Tabs/Tab';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet, WalletStatus } from 'wallet';

const ActivityLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbs = [
    {
      title: 'Homepage',
      href: ROUTES.HOME,
    },
    {
      title: 'Activity',
    },
  ];

  const wallet = useWallet();

  const tabs = [
    {
      label: 'All',
      value: ROUTES.ALL_ACTIVITY,
    },
    {
      label: 'My Activity',
      value: ROUTES.MY_ACTIVITY,
      disabled: wallet.status !== WalletStatus.WALLET_CONNECTED,
    },
  ];

  const handleChange = (event: React.SyntheticEvent, value: string) => {
    navigate(value);
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Heading variant="h800" component="h1" sx={{ mb: 3 }}>
        Activity
      </Heading>
      <Tabs
        value={location.pathname}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        slotProps={{
          indicator: {
            style: {
              background: 'white',
              height: 1,
            },
          },
        }}
        sx={{ mb: 4 }}
      >
        {tabs.map((tab, index) => (
          <Tab
            label={tab.label}
            value={tab.value}
            key={`my-account-tab-${index}`}
            disabled={tab.disabled}
          />
        ))}
      </Tabs>
      {children}
    </Layout>
  );
};

export default ActivityLayout;
