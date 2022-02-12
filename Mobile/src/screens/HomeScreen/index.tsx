import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, Image } from 'react-native';
import { HomeIcon } from '@src/components/Icons';
export const HomeScreen = () => (
  <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text category="h1">Home</Text>
    <HomeIcon style={{ width: 16 }} />
  </SafeAreaView>
);
