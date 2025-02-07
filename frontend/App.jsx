import React from 'react';
import {SafeAreaView, View} from 'react-native';
import Navigation from './src/navigations/Navigations';

function App() {
  return (
    <SafeAreaView>
      <View style={{height: '100%'}}>
        <Navigation />
      </View>
    </SafeAreaView>
  );
}

export default App;
