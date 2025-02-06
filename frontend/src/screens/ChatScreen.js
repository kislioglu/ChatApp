import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import socket from '../services/socket';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const userId = socket.id;

  useEffect(() => {
    socket.on('receiveMessage', data => {
      setMessages(prevMessages => {
        const isDuplicate = prevMessages.some(msg => msg.id === data.id);
        return isDuplicate ? prevMessages : [...prevMessages, data];
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      id: `${socket.id}-${Date.now()}`,
      user: socket.id,
      text: message,
    };

    socket.emit('sendMessage', messageData);
    setMessage('');
  };

  const renderItem = ({item}) => {
    const isMine = item.user === userId;
    console.log(item)
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
