import React, {useEffect} from 'react';
import {View} from 'react-native';
import {globalStyle, appStyle, color} from '../../utility';
import {Logo} from '../../component';
import {getAsyncStorage, keys} from '../../asyncStorge';
import {setUniqueValue} from '../../utility/constants';

const Splash = ({navigation}) => {
  useEffect(() => {
    const redirect = setTimeout(() => {
      getAsyncStorage(keys.uuid)
        .then((uuid) => {
          if (uuid) {
            setUniqueValue(uuid);
            navigation.replace('Dashboard');
          } else {
            navigation.replace('Login');
          }
        })
        .catch((err) => {
          console.log(err);
          navigation.replace('Login');
        });
    }, 200);
    return () => clearTimeout(redirect);
  }, [navigation]);
  return (
    <View
      style={[globalStyle.containerCentered, {backgroundColor: color.L_BLUE}]}>
      <Logo />
    </View>
  );
};

export default Splash;
