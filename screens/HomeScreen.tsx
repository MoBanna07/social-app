import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

// Define the type for the navigation prop
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Define the type for the item in the posts list
type Post = {
  id: number;
  user_id: number;
  title: string;
  body: string;
};

// Define the props for the HomeScreen component
type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const colorScheme = useColorScheme(); // Get the system color scheme (light/dark)
  const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

  // Define styles dynamically based on the color scheme
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5', // Dark or light background
    },
    postCard: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Dark or light card background
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 8,
    },
    postTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000', // Dark or light text color
    },
    postBody: {
      fontSize: 14,
      color: isDarkMode ? '#cccccc' : '#333333', // Dark or light text color
    },
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://gorest.co.in/public/v2/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
    >
      <ThemedView style={styles.postHeader}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${item.user_id}` }}
          style={styles.avatar}
        />
        <ThemedText type="defaultSemiBold">{`User ${item.user_id}`}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.postBody}>{item.body}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
}