import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {View, Text, Alert} from 'react-native';
import {color} from '../../utility';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {clearAsyncStorage} from '../../asyncStorge';
import {LogOutUser} from '../../network';
import {Profile, ShowUsers, StickyHeader} from '../../component';
import firebase from '../../firebase/config';
import {Store} from '../../context/store';
import {LOADING_STOP, LOADING_START} from '../../context/actions/type';
import {uuid, smallDeviceHeight} from '../../utility/constants';

const Dashboard = ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;

  const [userDetail, setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: '',
  });

  const [allUsers, setAllUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SimpleLineIcons
          name="logout"
          size={26}
          color={color.WHITE}
          style={{right: 10}}
          onPress={() =>
            Alert.alert(
              'Logout',
              'Are you sure to log out',
              [
                {
                  text: 'Yes',
                  onPress: () => logout(),
                },
                {
                  text: 'No',
                },
              ],
              {cancelable: false},
            )
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    dispatchLoaderAction({
      type: LOADING_START,
    });
  });

  const logout = () => {
    LogOutUser()
      .then(() => {
        clearAsyncStorage()
          .then(() => {
            navigation.replace('Login');
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(err));
  };

  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  );
};

export default Dashboard;
