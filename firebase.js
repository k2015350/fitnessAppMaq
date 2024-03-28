import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getAuth, signInWithEmailAndPassword, getReactNativePersistence, ReactNativeAsyncStorage} from '@firebase/auth';


const firebaseConfig = {
apiKey: "AIzaSyCWG8U7tHWJ8S8TLwtK16lj9L2MbkazxZU",
  authDomain: "fitness-app-36ccf.firebaseapp.com",
  databaseURL: "https://fitness-app-36ccf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fitness-app-36ccf",
  storageBucket: "fitness-app-36ccf.appspot.com",
  messagingSenderId: "256798493305",
  appId: "1:256798493305:web:059585e24cbe47114b62a8",
  measurementId: "G-5GRSPDZWC0"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export default {firebaseApp, database};