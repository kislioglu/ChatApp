import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function NewUserBtn() {
  const navigate = useNavigation();
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
        onPress={() => navigate.navigate('ChatScreen')}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>New</Text>
      </Pressable>
    </View>
  );
}
