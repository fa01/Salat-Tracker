// import moment from 'moment';
import ErrorMessages from '../constants/errors';
import statusMessage from './status';
import { Firebase, FirebaseRef } from '../lib/firebase';
import { syncLocalToRemote } from './habits';
// import { syncLocalToRemote, getHabits, formatWeek } from './habits';

const getUserRef = uid => FirebaseRef.child(`users/${uid}`).once('value').then(snap => snap.val());
const updateUserLastLoggedIn = uid => FirebaseRef.child(`users/${uid}`).update({ lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP });
// const setUserDetails = (uid, userName, lastName) => FirebaseRef.child(`users/${uid}`).set({
const setUserDetails = (uid, userName) => FirebaseRef.child(`users/${uid}`).set({
  userName,
  // lastName,
  signedUp: Firebase.database.ServerValue.TIMESTAMP,
  lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
});
// const updateUserFirstLastName = (uid, userName, lastName)
// => FirebaseRef.child(`users/${uid}`).update({ userName, lastName });
const updateUserFirstLastName = (uid, userName) => FirebaseRef.child(`users/${uid}`).update({ userName });

const userDetailsUpdate = async (dispatch, data) => dispatch({ type: 'USER_DETAILS_UPDATE', data });
const userLogin = async (dispatch, data) => dispatch({ type: 'USER_LOGIN', data });
const userReset = async dispatch => dispatch({ type: 'USER_RESET' });
const dataReset = async dispatch => dispatch({ type: 'DATA_RESET' });
/**
  * Sign Up to Firebase
  */
export const signUp = formData => async (dispatch) => {
  try {
    // const {
    //   email, password, password2, userName, lastName,
    // } = formData;
    const {
      email, password, password2, userName,
    } = formData;

    console.log('formData = ', formData);

    // Validation checks
    if (!userName) throw new Error(ErrorMessages.missingFirstName);
    // if (!lastName) throw new Error(ErrorMessages.missingLastName);
    if (!email) throw new Error(ErrorMessages.missingEmail);
    if (!password) throw new Error(ErrorMessages.missingPassword);
    if (!password2) throw new Error(ErrorMessages.missingPassword);
    if (password !== password2) throw new Error(ErrorMessages.passwordsDontMatch);

    await statusMessage(dispatch, 'loading', true);

    const res = await Firebase.auth().createUserWithEmailAndPassword(email, password);
    // Send user details to Firebase database
    if (res && res.uid) {
      // await setUserDetails(res.uid, userName, lastName);
      await setUserDetails(res.uid, userName);
    }

    await statusMessage(dispatch, 'loading', false);
    return Promise.resolve();
  } catch (error) {
    await statusMessage(dispatch, 'error', error.message);
    return Promise.reject();
  }
};

/**
  * Get this User's Details
  */

const getUserData = async (dispatch) => {
  if (loggedIn()) {
    const user = Firebase.auth().currentUser;
    const userDetails = await getUserRef(user.uid);
    userDetailsUpdate(dispatch, userDetails);
    return Promise.resolve();
  }
  return Promise.reject();
};

/**
  * Login to Firebase with Email/Password
  */
export const login = formData => async (dispatch, getState) => {
  try {
    let { email } = formData;
    const { password } = formData;
    console.log('login formData =', formData);
    email = `${email}@test.com`;
    console.log('email = ', email);
    await statusMessage(dispatch, 'loading', true);

    // Validation checks
    if (!email) throw new Error(ErrorMessages.missingEmail);
    if (!password) throw new Error(ErrorMessages.missingPassword);

    // Go to Firebase
    await Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
    const res = await Firebase.auth().signInWithEmailAndPassword(email, password);

    if (res && res.uid) {
      // Update last logged in data
      updateUserLastLoggedIn(res.uid);
      // Send verification Email when email hasn't been verified
      // if (res.emailVerified === false) Firebase.auth().currentUser.sendEmailVerification();
      // Get User Data
      getUserData(dispatch);
      await syncLocalToRemote(dispatch, getState);
    }
    await statusMessage(dispatch, 'loading', false);
    await userLogin(dispatch, res);
    return Promise.resolve();
  } catch (error) {
    await statusMessage(dispatch, 'error', error.message);
    return Promise.reject();
  }
};

/**
  * Reset Password
  */
export const resetPassword = formData => async (dispatch) => {
  try {
    const { email } = formData;
    // Validation checks
    if (!email) throw new Error(ErrorMessages.missingEmail);
    await statusMessage(dispatch, 'loading', true);

    await Firebase.auth().sendPasswordResetEmail(email);
    await userReset(dispatch);
    await statusMessage(dispatch, 'loading', false);

    return Promise.resolve();
  } catch (error) {
    await statusMessage(dispatch, 'error', error.message);
    return Promise.reject();
  }
};

/**
  * Update Profile
  */
export const updateProfile = formData => async (dispatch) => {
  try {
    const {
      email,
      password,
      password2,
      userName,
      // lastName,
      changeEmail,
      changePassword,
    } = formData;

    // Are they a user?
    const user = Firebase.auth().currentUser;
    if (!user.uid) throw new Error(ErrorMessages.missingFirstName);

    // Validation checks
    if (!userName) throw new Error(ErrorMessages.missingFirstName);
    // if (!lastName) throw new Error(ErrorMessages.missingLastName);
    if (changeEmail) {
      if (!email) throw new Error(ErrorMessages.missingEmail);
    }
    if (changePassword) {
      if (!password) throw new Error(ErrorMessages.missingPassword);
      if (!password2) throw new Error(ErrorMessages.missingPassword);
      if (password !== password2) throw new Error(ErrorMessages.passwordsDontMatch);
    }

    await statusMessage(dispatch, 'loading', true);

    // await updateUserFirstLastName(user.uid, userName, lastName);
    await updateUserFirstLastName(user.uid, userName);
    if (changeEmail) await Firebase.auth().currentUser.updateEmail(email);
    if (changePassword) await Firebase.auth().currentUser.updatePassword(password);
    await getUserData(dispatch);

    await statusMessage(dispatch, 'success', 'Profile Updated');

    return Promise.resolve();
  } catch (error) {
    await statusMessage(dispatch, 'error', error.message);
    return Promise.reject();
  }
};


/**
  * Logout
  */
export const logout = () => async (dispatch) => {
  await Firebase.auth().signOut();
  await userReset(dispatch);
  await dataReset(dispatch);
};

export const verifyAuth = () => (dispatch) => {
  Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getUserData(dispatch);
    }
    // } else {
    //   dispatch(logout());
    // }
  });
};

/**
  * returns true if Firebase is initialised and user object exists (i.e. logged-in)
  */
export const loggedIn = () => {
  const user = Firebase.auth().currentUser;
  return (Firebase !== null && user !== null);
};
