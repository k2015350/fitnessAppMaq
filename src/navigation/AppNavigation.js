import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import TraineeHome from '../screens/trainee/TraineeHome';
import TrainerHome from '../screens/trainer/TrainerHome';
import ViewSessions from '../screens/trainee/ViewSessions';
import ChooseTrainer from '../screens/trainee/ChooseTrainer';
import NewSession from '../screens/trainer/NewSession';
import MyMembership from '../screens/trainee/MyMembership';
import TrainerProfile from '../screens/trainer/TrainerProfile';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Register"
          component={SignUp}
          options={{ headerShown: true }}
        />
        {/* Include BottomNavigation as a screen */}
        <Stack.Screen
          name="TraineeHome" 
          component={TraineeHome} // Use BottomNavigation as a screen
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrainerHome" // Give a name to the screen containing the bottom tab navigator
          component={TrainerHome} // Use BottomNavigation as a screen
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewSessions" // Give a name to the screen containing the bottom tab navigator
          component={ViewSessions} // Use BottomNavigation as a screen
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name='ChooseTrainer'
        component={ChooseTrainer}
        options={{headerShown: false}}/>
      <Stack.Screen
        name='AddNewSessions'
        component={NewSession}
        options={{headerShown: false}}/>

        <Stack.Screen
        name='TrainerProfile'
        component={TrainerProfile}
        options={{headerShown: false}}/>
        <Stack.Screen
        name='MyMembership'
        component={MyMembership}
        options={{headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
