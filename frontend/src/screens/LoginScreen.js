import auth from '@react-native-firebase/auth';
import {useState} from 'react';
import {View, TextInput, Button, Text} from 'react-native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const signUp = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      setUser(userCredential.user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const signIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      setUser(userCredential.user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const signOut = async () => {
    await auth().signOut();
    setUser(null);
  };

  return (
    <View>
      {user ? (
        <View>
          <Text>Welcome, {user.email}</Text>
          <Button title="Sign out" onPress={signOut} />
        </View>
      ) : (
        <View>
          <TextInput
            placeholder="E-mail"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            placeholder="password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <Button title="Signup" onPress={signUp} />
          <Button title="Signin" onPress={signIn} />
        </View>
      )}
    </View>
  );
}
