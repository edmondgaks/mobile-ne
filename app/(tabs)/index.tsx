import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TextInput, Button, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';


interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  name: string;
  body: string;
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); 

  const navigation = useNavigation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setIsRefreshing(false); // Reset refreshing state regardless of success or failure
    }
  };


  const handleDeletePost = async (postId: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setSuccess('Post deleted successfully!');
      setError(null);
      fetchPosts();
    } catch (error) {
      setError('Failed to delete post. Please try again.');
      setSuccess(null);
    }
  };
  

  const handleViewPost = (post: Post) => {
    navigation.navigate('PostDetail', { post });
  };

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true
    fetchPosts(); // Call fetchPosts to refresh the posts
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EDF4F2', dark: '#353636' }}
      headerImage={<Ionicons size={280} name="library" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText type="defaultSemiBold">Here is a list of all posts!</ThemedText>
      <ThemedView>
        {error && <Text style={styles.error}>{error}</Text>}
        {success && <Text style={styles.success}>{success}</Text>}
      </ThemedView>
      <ThemedView>
        {posts.map(post => (
          <View key={post.id} style={styles.postContainer}>
            <TouchableOpacity onPress={() => handleViewPost(post)}>
              <ThemedText type="defaultSemiBold">{post.title}</ThemedText>
              <ThemedText type="default">{post.body}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePost(post.id)} style={styles.button}>
              <Text style={styles.buttonText}>Delete Post</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerImage: {
    color: '#8AAAE5',
    bottom: -80,
    left: -5,
    position: 'absolute',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
  postContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8AAAE5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});