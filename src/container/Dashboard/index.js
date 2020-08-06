import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {Alert, SafeAreaView, FlatList, View} from 'react-native';
import {color} from '../../utility';
import ImagePicker from 'react-native-image-picker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {clearAsyncStorage} from '../../asyncStorge';
import {LogOutUser, UpdateUser, RemoveUser} from '../../network';
import {Profile, ShowUsers, StickyHeader} from '../../component';
import firebase from '../../firebase/config';
import {Store} from '../../context/store';
import {LOADING_STOP, LOADING_START} from '../../context/actions/type';
import {uuid, smallDeviceHeight} from '../../utility/constants';
import {deviceHeight} from '../../utility/styleHelper/appStyle';

const Dashboard = ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;

  const [getScrollPosition, setScrollPosition] = useState(0);
  const [userDetail, setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: '',
  });

  const [allUsers, setAllUsers] = useState([]);
  const {profileImg, name} = userDetail;

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
      headerLeft: () => (
        <SimpleLineIcons
          name="settings"
          size={26}
          color={color.WHITE}
          style={{right: -10}}
          onPress={() =>
            Alert.alert(
              'Delete Account',
              'Are you sure want to delete your account ?',
              [
                {
                  text: 'Yes',
                  onPress: () => deleteAccount(),
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
    try {
      firebase
        .database()
        .ref('users')
        .on('value', (dataSnapshot) => {
          let users = [];
          let currentUser = {
            id: '',
            name: '',
            profileImg: '',
          };
          dataSnapshot.forEach((child) => {
            if (uuid === child.val().uuid) {
              currentUser.id = uuid;
              currentUser.name = child.val().name;
              currentUser.profileImg = child.val().profileImg;
            } else {
              users.push({
                id: child.val().uuid,
                name: child.val().name,
                profileImg: child.val().profileImg,
              });
            }
          });
          setUserDetail(currentUser);
          setAllUsers(users);
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
        });
    } catch (error) {
      alert(error);
      dispatchLoaderAction({
        type: LOADING_STOP,
      });
    }
  }, []);

  const deleteAccount = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };
    dispatchLoaderAction({
      type: LOADING_START,
    });
    RemoveUser(uuid)
      .then(() => {
        dispatchLoaderAction({
          type: LOADING_STOP,
        });
        navigation.replace('SignUp');
      })
      .catch((err) => {
        alert(err);
        dispatchLoaderAction({
          type: LOADING_STOP,
        });
      });
  };

  const deletePhotoTapped = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };

    Alert.alert(
      'Remove Profile Image',
      'Do you really want to remove profile image ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            let source = '';
            dispatchLoaderAction({
              type: LOADING_START,
            });
            UpdateUser(uuid, source)
              .then(() => {
                setUserDetail({
                  ...userDetail,
                  profileImg: '',
                });
                dispatchLoaderAction({
                  type: LOADING_STOP,
                });
              })
              .catch((err) => {
                alert(err);
                dispatchLoaderAction({
                  type: LOADING_STOP,
                });
              });
          },
        },
      ],
      {cancelable: false},
    );
  };
  const selectPhotoTapped = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // Base 64 image:
        let source = 'data:image/jpeg;base64,' + response.data;
        dispatchLoaderAction({
          type: LOADING_START,
        });
        UpdateUser(uuid, source)
          .then(() => {
            setUserDetail({
              ...userDetail,
              profileImg: source,
            });
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
          })
          .catch((err) => {
            alert(err);
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
          });
      }
    });
  };

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

  const imgTap = (profileImg, name) => {
    if (!profileImg) {
      navigation.navigate('ShowFullImg', {
        name,
        imgText: name.charAt(0),
      });
    } else {
      navigation.navigate('ShowFullImg', {
        name,
        img: profileImg,
      });
    }
  };

  const nameTap = (profileImg, name, guestUserId) => {
    if (!profileImg) {
      navigation.navigate('Chat', {
        name,
        imgText: name.charAt(0),
        guestUserId,
        currentUserId: uuid,
      });
    } else {
      navigation.navigate('Chat', {
        name,
        img: profileImg,
        guestUserId,
        currentUserId: uuid,
      });
    }
  };

  const getOpacity = () => {
    if (deviceHeight < smallDeviceHeight) {
      return deviceHeight / 4;
    } else {
      return deviceHeight / 6;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.WHITE}}>
      {getScrollPosition > getOpacity() && (
        <StickyHeader
          name={name}
          img={profileImg}
          onImgTap={() => imgTap(profileImg, name)}
        />
      )}
      <FlatList
        alwaysBounceVertical={false}
        data={allUsers}
        keyExtractor={(_, index) => index.toString()}
        onScroll={(event) =>
          setScrollPosition(event.nativeEvent.contentOffset.y)
        }
        ListHeaderComponent={
          <View
            style={{
              opacity:
                getScrollPosition < getOpacity()
                  ? (getOpacity() - getScrollPosition) / 100
                  : 0,
            }}>
            <Profile
              img={profileImg}
              name={name}
              onEditImgTap={() => selectPhotoTapped()}
              onDeleteImgTap={() => deletePhotoTapped()}
              onImgTap={() => imgTap(profileImg, name)}
            />
          </View>
        }
        renderItem={({item}) => (
          <ShowUsers
            name={item.name}
            img={item.profileImg}
            onImgTap={() => imgTap(item.profileImg, item.name)}
            onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Dashboard;
