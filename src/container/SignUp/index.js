import React, {useState, useContext} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Logo, InputField, RoundCornerButton} from '../../component';
import {globalStyle, color} from '../../utility';
import {Store} from '../../context/store';
import {LOADING_START, LOADING_STOP} from '../../context/actions/type';
import {SignUpRequest, AddUser} from '../../network';
import firebase from '../../firebase/config';
import {setAsyncStorage, keys} from '../../asyncStorge';
import {setUniqueValue, keyboardVerticalOffset} from '../../utility/constants';

const SignUp = ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;

  const [credential, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showLogo, toggleLogo] = useState(true);
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
      dispatchLoaderAction({
        type: LOADING_START,
      });
      SignUpRequest(email, password)
        .then((res) => {
          if (!res.additionalUserInfo) {
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            alert(res);
            return;
          }
          console.log(firebase.auth().currentUser);
          let uid = firebase.auth().currentUser.uid;
          let profileImg = '';
          AddUser(name, email, uid, profileImg)
            .then(() => {
              setAsyncStorage(keys.uuid, uid);
              setUniqueValue(uid);
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
              navigation.replace('Dashboard');
            })
            .catch((err) => {
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
              alert(err);
            });
        })
        .catch((err) => {
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          alert(err);
        });
    }
  };

  const handleFocus = () => {
    setTimeout(() => {
      toggleLogo(false);
    }, 200);
  };

  const handleBlur = () => {
    setTimeout(() => {
      toggleLogo(true);
    }, 200);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={[globalStyle.flex1, {backgroundColor: color.WHITE}]}>
          {showLogo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )}
          <View style={(globalStyle.flex2, globalStyle.sectionCentered)}>
            <InputField
              placeholder="Enter Name"
              value={name}
              onChangeText={(text) => handleOnChange('name', text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter Email"
              value={email}
              onChangeText={(text) => handleOnChange('email', text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => handleOnChange('password', text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Confirm Password"
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={(text) => handleOnChange('confirmPassword', text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <RoundCornerButton title="SignUp" onPress={() => onLoginPress()} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: color.BLACK,
              }}
              onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
