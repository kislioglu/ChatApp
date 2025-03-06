import React, {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const GetMessagesFromFirestore = ({recipientUid, setMessages}) => {
  useEffect(() => {
    const user = auth().currentUser;
    if (!user || !recipientUid) return;

    const unsubscribe = firestore()
      .collection('messages')
      .where('participants', 'array-contains', user.uid)
      .onSnapshot(
        querySnapshot => {
          const loadedMessages = [];
          querySnapshot.forEach(doc => {
            const data = doc.data();
            if (
              (data.user === user.uid && data.recipientUid === recipientUid) ||
              (data.user === recipientUid && data.recipientUid === user.uid)
            ) {
              loadedMessages.push(data);
            }
          });
          loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(loadedMessages);
        },
        error => {
          console.error('Firestore query error:', error);
        },
      );

    return () => unsubscribe();
  }, [recipientUid, setMessages]);

  return null;
};

export default GetMessagesFromFirestore;
