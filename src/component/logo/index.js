import React from 'react';
import {Text, View, Image} from 'react-native';
import styles from './styles';

export default ({logoStyle, logoTextStyle}) => (
  <View style={[styles.logo, logoStyle]}>
    <Image source={require('./chat.png')} style={{width: 100, height: 100}} />
  </View>
);
