import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import { RootStackParamList } from './types'; // Import RootStackParamList

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
    </Stack.Navigator>
  );
}