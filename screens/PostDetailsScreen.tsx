import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type PostDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PostDetails'>;

type Post = {
  id: number;
  user_id: number;
  title: string;
  body: string;
};

type Comment = {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
};

type PostDetailsScreenProps = {
  route: PostDetailsScreenRouteProp;
};

export default function PostDetailsScreen({ route }: PostDetailsScreenProps) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensure the container takes up the full height
      padding: 16,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    postContainer: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
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
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    postBody: {
      fontSize: 14,
      color: isDarkMode ? '#cccccc' : '#333333',
    },
    commentCard: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    commentBody: {
      fontSize: 14,
      color: isDarkMode ? '#cccccc' : '#333333',
    },
  });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`https://gorest.co.in/public/v2/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://gorest.co.in/public/v2/comments?post_id=${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <ThemedView style={styles.commentCard}>
      <ThemedView style={styles.commentHeader}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${item.email}` }}
          style={styles.avatar}
        />
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.commentBody}>{item.body}</ThemedText>
    </ThemedView>
  );

  if (!post) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <ThemedView style={styles.postContainer}>
            <ThemedView style={styles.postHeader}>
              <Image
                source={{ uri: `https://i.pravatar.cc/150?u=${post.user_id}` }}
                style={styles.avatar}
              />
              <ThemedText type="defaultSemiBold">{`User ${post.user_id}`}</ThemedText>
            </ThemedView>
            <ThemedText style={styles.postTitle}>{post.title || 'No Title'}</ThemedText>
            <ThemedText style={styles.postBody}>{post.body || 'No Body'}</ThemedText>
          </ThemedView>
        }
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }} // Ensure the content can scroll
      />
    </View>
  );
}