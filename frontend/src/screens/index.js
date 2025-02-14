import {View, Text} from 'react-native';
import React from 'react';
import NewUserBtn from '../components/buttons/newUserBtn';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{position: 'absolute', bottom: 20, right: 20}}>
        <NewUserBtn />
      </View>
    </View>
  );
}
