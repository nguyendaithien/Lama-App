import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export const ProjectScreen = () => (
  <Layout style={style.container}>
    <Text category="h1">Project list</Text>
  </Layout>
);

const style = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
