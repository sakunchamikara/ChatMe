import Firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDQ-B0u98wry10O6GRfuZu-sDgZNpiXjSI',
  databaseURL: 'https://simplaechat-3c94a.firebaseio.com/',
  projectId: 'simplaechat-3c94a',
  appId: '1:72252170019:android:2f81207e342f4044c7f696',
};
export default Firebase.initializeApp(firebaseConfig);
