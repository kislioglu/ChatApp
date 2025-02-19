import {View} from 'react-native';
import React, {useState} from 'react';
import NewUserBtn from '../components/buttons/newUserBtn';
import ChatScreen from './ChatScreen';

export default function Index() {
  const [recipientUid, setRecipientUid] = useState('');

  return (
    <View style={{flex: 1}}>
      {recipientUid ? (
        <ChatScreen recipientUid={recipientUid} />
      ) : (
        <View style={{flex: 1, bottom: 20, right: 20, position: 'absolute'}}>
          <NewUserBtn onUserSelect={setRecipientUid} />
        </View>
      )}
    </View>
  );
}
