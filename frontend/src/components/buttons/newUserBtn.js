import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function NewUserBtn({onUserSelect}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = await firestore().collection('users').get();
        const usersList = usersCollection.docs.map(doc => doc.data());
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error); 
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    onUserSelect(user.uid);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User signed out!');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View>
      <Pressable
        style={{
          backgroundColor: '#689f38',
          padding: 10,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
        }}
        onPress={() => setModalVisible(true)}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>New</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View style={{width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20}}>
            <FlatList
              data={users}
              keyExtractor={item => item.uid}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => handleUserSelect(item)}>
                  <Text style={{padding: 10, fontSize: 18}}>{item.email}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable
        style={{
          backgroundColor: '#d32f2f',
          padding: 10,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
          marginTop: 10,
        }}
        onPress={handleLogout}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Logout</Text>
      </Pressable>
    </View>
  );
}