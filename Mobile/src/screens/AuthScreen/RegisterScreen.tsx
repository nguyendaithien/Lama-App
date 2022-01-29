import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { HomeIcon } from '@src/components/Icons';
export const RegisterScreen = () => (
  <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text category="h1">Sign Up</Text>
    <HomeIcon style={{ width: 16 }} />
  </Layout>
);
