import firebase from '../../firebase/config';

export const AddUser = async (name, email, uid, profileImg) => {
  try {
    return await firebase
      .database()
      .ref('users/' + uid)
      .set({
        name: name,
        email: email,
        uuid: uid,
        profileImg: profileImg,
      });
  } catch (error) {
    return error;
  }
};

export const UpdateUser = async (uuid, imgSource) => {
  try {
    return await firebase
      .database()
      .ref('users/' + uuid)
      .update({
        profileImg: imgSource,
      });
  } catch (error) {
    return error;
  }
};

export const RemoveUser = async (uuid) => {
  try {
    return await firebase
      .auth()
      .currentUser.delete()
      .then(
        function () {
          console.log('Remove succeeded.' + firebase.auth().currentUser);
        },
        function (error) {
          console.log('Remove failed: ' + error.message);
        },
      );
  } catch (error) {
    return error;
  }
};
