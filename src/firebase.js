import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  apiKey: "AIzaSyCo92sMEsZhDeVSEIEnC9Rc-K0wxtRc8TI",
  authDomain: "projet-4446e.firebaseapp.com",
  databaseURL: "https://projet-4446e.firebaseio.com",
  projectId: "projet-4446e"
  // enlever les caractéristiques inutiles

});

export const db = firebaseApp.database();
