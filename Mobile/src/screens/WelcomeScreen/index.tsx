/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Image, ImageProps } from 'react-native';
import { Button, Layout, Text, ViewPager, Icon, useTheme } from '@ui-kitten/components';
// import {useAppDispatch} from '@src/hooks/reduxHooks';
// import {passAppFirstLaunch} from '@src/features/app/appSlice';
import { DimensionScre } from '@src/consts/dimentions';

const onboardingList = [
  {
    id: 1,
    title: 'Dangerous Search',
    description:
      'Collect data from sensors located in multiple locations. Analyze data to provide warnings about hazards',
    img: require('@src/assets/images/onboarding1.png'),
    isActive: true
  },
  {
    id: 2,
    title: 'Instant Notifications',
    description:
      'Notify immediately when danger is detected. Provide accurate warnings to create high reliability',
    img: require('@src/assets/images/onboarding2.png'),
    isActive: false
  },
  {
    id: 3,
    title: 'Time Management',
    description: 'Save management time for large area.',
    img: require('@src/assets/images/onboarding3.png'),
    isActive: false
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Continuous and immediate support team.',
    img: require('@src/assets/images/onboarding4.png'),
    isActive: false
  }
];
interface ISlideProps {
  item: {
    id: number;
    description: string;
    title: string;
    img: ImageProps;
    isActive: boolean;
  };
}
interface IDotProps {
  id: number;
  selectedIndex: number;
}

const NextIconCus = (props: any) => {
  const theme = useTheme();
  return (
    <Icon
      {...props}
      style={{ height: 35, width: 35 }}
      name="arrow-ios-forward-outline"
      fill={theme['color-primary-default']}
    />
  );
};

const Slide = ({ item }: ISlideProps) => {
  return (
    <Layout style={styles.slideContainer}>
      <Image style={styles.image} source={item.img} />
      <Text style={styles.title} category="h4">
        {item.title}
      </Text>
      <Text category="p1" style={styles.description}>
        {item.description}
      </Text>
    </Layout>
  );
};

const Dot = ({ id, selectedIndex }: IDotProps) => {
  const theme = useTheme();
  return (
    <Layout
      style={[
        styles.dot,
        id === selectedIndex && {
          backgroundColor: theme['color-primary-default'],
          width: 40
        }
      ]}
    />
  );
};

export const WelcomeScreen = () => {
  // const dispatch = useAppDispatch();
  // const handleButtonStart = () => dispatch(passAppFirstLaunch());
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <Layout style={styles.container}>
      <ViewPager selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)}>
        {onboardingList.map(item => {
          return <Slide item={item} key={item.id} />;
        })}
      </ViewPager>
      <Layout style={styles.footerContainer}>
        {selectedIndex === onboardingList.length - 1 ? (
          <Layout style={styles.getStartedContainer}>
            {/* <Button onPress={handleButtonStart}>GET STARTED</Button> */}
            <Button>GET STARTED</Button>
          </Layout>
        ) : (
          <Layout style={styles.footerHandle}>
            <Button
              size="giant"
              appearance="ghost"
              status="primary"
              onPress={() => {
                setSelectedIndex(onboardingList.length - 1);
              }}
            >
              SKIP
            </Button>
            <Layout style={styles.dotContainer}>
              {onboardingList.map(item => {
                return <Dot id={item.id} key={item.id} selectedIndex={selectedIndex + 1} />;
              })}
            </Layout>
            <Button
              size="giant"
              appearance="ghost"
              accessoryLeft={NextIconCus}
              onPress={() => {
                !(selectedIndex === onboardingList.length - 1) &&
                  setSelectedIndex(selectedIndex + 1);
              }}
            />
          </Layout>
        )}
      </Layout>
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: 'grey'
  },
  slideContainer: {
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    height: DimensionScre.height * 0.75,
    width: DimensionScre.width
  },
  image: {
    height: '50%',
    width: DimensionScre.width,
    resizeMode: 'contain'
  },
  title: {
    fontWeight: 'bold'
  },
  description: {
    marginTop: 15,
    maxWidth: '90%',
    textAlign: 'center',
    lineHeight: 18
  },
  footerContainer: {
    height: DimensionScre.height * 0.1,
    width: DimensionScre.width,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  footerHandle: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  getStartedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#BDBDBD',
    marginHorizontal: 2.5
  },
  dotActive: {
    width: 40
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
