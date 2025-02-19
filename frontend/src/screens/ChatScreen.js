import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {connectSocket, disconnectSocket} from '../services/socket';
import uuid from 'react-native-uuid';

const ChatScreen = ({recipientUid}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const socket = connectSocket();
    const user = auth().currentUser;

    if (socket && user) {
      socket.on('connect', () => {
        setUserId(socket.id);
        socket.emit('register', user.uid);
      });

      socket.on('receiveMessage', data => {
        setMessages(prevMessages => {
          const isDuplicate = prevMessages.some(msg => msg.id === data.id);
          return isDuplicate ? prevMessages : [...prevMessages, data];
        });
      });

      return () => {
        socket.off('connect');
        socket.off('receiveMessage');
        disconnectSocket();
      };
    }

    // get messages from firebase
    const unsubscribe = firestore()
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
        const loadedMessages = [];
        querySnapshot.forEach(doc => {
          loadedMessages.push(doc.data());
        });
        setMessages(loadedMessages);
      });

    return () => unsubscribe();
  }, []);

  const sendMessage = () => {
    const socket = connectSocket();
    if (
      !message.trim() ||
      !socket ||
      !recipientUid.trim() ||
      recipientUid === auth().currentUser.uid
    )
      return;

    const messageData = {
      id: uuid.v4(),
      user: auth().currentUser.uid,
      recipientUid,
      text: message,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    setMessages(prevMessages => [...prevMessages, messageData]);

    socket.emit('sendMessage', messageData);
    setMessage('');
  };

  const renderItem = ({item}) => {
    const isMine = item.user === auth().currentUser.uid;
    return (
      <View
        style={[styles.messageContainer, isMine ? styles.right : styles.left]}
        key={item.id}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
          style={styles.input}
          multiline={true}
        />

        <Pressable
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#0084ff',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 16,
          }}
          onPress={sendMessage}>
          <Image
            source={require('../../assets/send.png')}
            style={{width: 20, height: 20}}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  left: {
    alignSelf: 'flex-start',
    backgroundColor: 'red',
  },
  right: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
  },
  messageText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: '80%',
    maxHeight: 150,
    borderRadius: 10,
  },
});

export default ChatScreen;
