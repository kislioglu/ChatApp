import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {connectSocket, disconnectSocket} from '../services/socket';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [recipientUid, setRecipientUid] = useState('');

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
        style={[styles.messageContainer, isMine ? styles.right : styles.left]}>
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

      <TextInput
        value={recipientUid}
        onChangeText={setRecipientUid}
        placeholder="Recipient UID"
        style={styles.input}
      />

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        style={styles.input}
        multiline={true}
      />

      <Button title="Send" onPress={sendMessage} />
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
    marginBottom: 10,
    width: '100%',
    maxHeight: 150,
  },
});

export default ChatScreen;
