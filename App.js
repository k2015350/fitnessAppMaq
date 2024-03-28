import React from 'react';
import AppNavigation from './src/navigation/AppNavigation.js';  // Adjust the path according to your file structure
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});
const App = () => {
  return <AppNavigation />;
};

export default App;
