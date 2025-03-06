import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {connectSocket, disconnectSocket} from '../services/socket';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);

      if (user) {
        connectSocket();
        navigation.navigate('Index');
        console.log('connected');
      } else {
        disconnectSocket();
        console.log('disconnected');
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async () => {
    if (!email || !password) {
      console.error('Email and password fields cannot be empty');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      setUser(userCredential.user);

      await firestore().collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async () => {
    if (!email || !password) {
      console.error('Email and password fields cannot be empty');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      setUser(userCredential.user);

      await firestore().collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    await auth().signOut();
    setUser(null);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'email' && styles.focusedInputContainer,
          ]}>
          <TextInput
            style={[styles.input, {width: '100%'}]}
            placeholder="E-mail"
            onChangeText={setEmail}
            value={email}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'password' && styles.focusedInputContainer,
          ]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={showPassword}
            onChangeText={setPassword}
            value={password}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            style={{
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setShowPassword(!showPassword)}>
            <Image source={require('../../assets/hide.png')} />
          </TouchableOpacity>
        </View>

        <View style={{gap: 10, marginTop: 10}}>
          <Pressable
            style={[styles.signBtn, {backgroundColor: '#1fb141'}]}
            onPress={signUp}>
            <Text style={styles.signText}>Sign Up</Text>
          </Pressable>
          <Pressable
            style={[styles.signBtn, {backgroundColor: '#007bff'}]}
            onPress={signIn}>
            <Text style={styles.signText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signBtn: {
    backgroundColor: 'gray',
    height: 50,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 50,
    padding: 10,
    borderRadius: 5,
    width: '90%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    height: 50,
    marginTop: 10,
    marginHorizontal: 10,
  },
  focusedInputContainer: {
    borderColor: 'blue',
  },
  signText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
