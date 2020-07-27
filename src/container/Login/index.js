import React, {useState, useContext} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {Logo, InputField, RoundCornerButton} from '../../component';
import {globalStyle, color} from '../../utility';
import {Store} from '../../context/store';
import {LOADING_START, LOADING_STOP} from '../../context/actions/type';
import {LoginRequest} from '../../network';
import {setAsyncStorage, keys} from '../../asyncStorge';
import {setUniqueValue, keyboardVerticalOffset} from '../../utility/constants';

const Login = ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;
  const [credential, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [showLogo, toggleLogo] = useState(true);
  const {email, password} = credential;

  // const setInitialState = () => {
  //   setCredential({email: '', password: ''});
  // };
  const handleOnChange = (name, value) => {
    setCredentials({
      ...credential,
      [name]: value,
    });
  };
  const onLoginPress = () => {
    if (!email) {
      alert('Email is required');
    } else if (!password) {
      alert('Password is required');
    } else {
      dispatchLoaderAction({
        type: LOADING_START,
      });
      LoginRequest(email, password)
        .then((res) => {
          if (!res.additionalUserInfo) {
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            alert(res);
            return;
          }
          setAsyncStorage(keys.uuid, res.user.uid);
          setUniqueValue(res.user.uid);
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          // setInitialState();
          navigation.replace('Dashboard');
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
            <RoundCornerButton title="Login" onPress={() => onLoginPress()} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: color.BLACK,
              }}
              onPress={() => navigation.navigate('SignUp')}>
              Sign Up
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
