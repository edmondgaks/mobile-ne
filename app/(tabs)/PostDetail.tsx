import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
type RootStackParamList = {
  PostDetail: { post: Post };
};

interface Comment {
    id: number;
    name: string;
    body: string;
    email: string;
}

interface Post {
    id: number;
    title: string;
    body: string;
  }

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<PostDetailRouteProp>();
    const { post } = route.params;
    const [comments, setComments] = useState<Comment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
      }, []);
    
      const fetchComments = async () => {
        try {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
          );
          setComments(response.data);
        } catch (error) {
          setError('Failed to fetch comments. Please try again.');
        }
      };
    
      const handleGoBack = () => {
        navigation.goBack();
      };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EDF4F2', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="bar-chart" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Specific Post</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{post.title}</ThemedText>
        <ThemedText type="default">{post.body}</ThemedText>
        <TouchableOpacity onPress={handleGoBack} style={styles.button}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
        <Text style={styles.commentsTitle}>Comments:</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {comments.map(comment => (
          <View key={comment.id} style={styles.commentContainer}>
            <ThemedText type="defaultSemiBold">{comment.email}</ThemedText>
            <ThemedText type="defaultSemiBold">{comment.name}</ThemedText>
            <ThemedText type="default">{comment.body}</ThemedText>
          </View>
        ))}
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      commentsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
      },
      commentContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 8,
      },
      commentName: {
        fontWeight: 'bold',
        marginBottom: 4,
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
    error: {
      color: 'red',
      marginTop: 10,
    },
    success: {
      color: 'green',
      marginTop: 10,
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
  