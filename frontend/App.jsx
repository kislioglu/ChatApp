import React from 'react';
import {SafeAreaView, View} from 'react-native';
import ChatScreen from './src/screens/ChatScreen';

function App() {
  return (
    <SafeAreaView>
      <View style={{height: '100%'}}>
        <ChatScreen />
      </View>
    </SafeAreaView>
  );
}

export default App;
