import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import { Image, StyleSheet, Platform, View, Button, TextInput, Text, TouchableOpacity } from 'react-native';

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

export default function TabTwoScreen() {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch posts. Please try again.');
    }
  };
  const handleCreatePost = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title,
        body,
        userId: 1,
      });
      setSuccess('Post created successfully!');
      setError(null);
      fetchPosts();
    } catch (error) {
      setError('Failed to create post. Please try again.');
      setSuccess(null);
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EDF4F2', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="create" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Create Post</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Body"
          value={body}
          onChangeText={setBody}
          style={styles.input}
        />
        {/* <Button title="Create Post" onPress={handleCreatePost} /> */}
        <TouchableOpacity onPress={() => handleCreatePost} style={styles.button}>
          <Text style={styles.buttonText}>Create Post</Text>
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
        {success && <Text style={styles.success}>{success}</Text>}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#8AAAE5',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
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
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
});
