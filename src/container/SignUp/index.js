import React, {useState} from 'react';
import {Text, SafeAreaView, View} from 'react-native';
import {Logo, InputField, RoundCornerButton} from '../../component';
import {globalStyle, color} from '../../utility';

const SignUp = ({navigation}) => {
  const [credential, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const {name, email, password, confirmPassword} = credential;
  const handleOnChange = (name, value) => {
    setCredentials({
      ...credential,
      [name]: value,
    });
  };
  const onLoginPress = () => {
    if (!name) {
      alert('Name is required');
    } else if (!email) {
      alert('Email is required');
    } else if (!password) {
      alert('Password is required');
    } else if (password !== confirmPassword) {
      alert('Password did not match');
    } else {
      alert(JSON.stringify(credential));
    }
  };

  return (
    <SafeAreaView style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
      <View style={globalStyle.containerCentered}>
        <Logo />
      </View>
      <View style={(globalStyle.flex2, globalStyle.sectionCentered)}>
        <InputField
          placeholder="Enter Name"
          value={name}
          onChangeText={(text) => handleOnChange('name', text)}
        />
        <InputField
          placeholder="Enter Email"
          value={email}
          onChangeText={(text) => handleOnChange('email', text)}
        />
        <InputField
          placeholder="Enter Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => handleOnChange('password', text)}
        />
        <InputField
          placeholder="Confirm Password"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={(text) => handleOnChange('confirmPassword', text)}
        />
        <RoundCornerButton title="SignUp" onPress={() => onLoginPress()} />
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: color.LIGHT_GREEN,
          }}
          onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
