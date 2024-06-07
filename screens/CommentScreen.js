import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import Colors from '../constants/colors';

const CommentScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [userData, setUserData] = useState(null); // State to store user data
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No current user found.');
      return;
    }

    console.log('Current User:', currentUser); // Debugging

    const fetchComments = async () => {
      try {
        const productDocRef = doc(FIREBASE_FIRESTORE, 'FoodPost', productId);
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          setComments(productDoc.data().comments || []);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        Alert.alert('Error', 'Failed to fetch comments. Please try again later.');
      }
    };

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log('Fetched User Data:', data); // Debugging
          setUserData(data);
        } else {
          console.error('No such user document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      }
    };

    fetchComments();
    fetchUserData();
  }, [productId, currentUser]);

  const submitComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      console.log('Submitting Comment with User Data:', userData); // Debugging
      if (userData && userData.purchasedProducts && userData.purchasedProducts.includes(productId)) {
        if (!userData.commentedProducts || !userData.commentedProducts.includes(productId)) {
          const productDocRef = doc(FIREBASE_FIRESTORE, 'FoodPost', productId);

          const username = userData.fullName || 'Anonymous';
          const userProfilePicture = userData.profilePic || 'https://example.com/default-avatar.png';

          await updateDoc(productDocRef, {
            comments: arrayUnion({
              userId: currentUser.uid,
              username: username, // Ensure username is not undefined
              userProfilePicture: userProfilePicture, // Ensure profile picture is not undefined
              text: comment,
              timestamp: new Date(),
            }),
          });

          await updateDoc(doc(FIREBASE_FIRESTORE, 'users', currentUser.uid), {
            commentedProducts: arrayUnion(productId),
          });

          setComment('');
          Alert.alert('Success', 'Your comment has been added!');
          navigation.goBack();
        } else {
          Alert.alert('Error', 'You have already commented on this product.');
        }
      } else {
        Alert.alert('Error', 'You can only comment on products you have purchased.');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit comment. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Image
              source={{ uri: item.userProfilePicture || 'https://example.com/default-avatar.png' }} // Default avatar if not provided
              style={styles.avatar}
            />
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentAuthor}>{item.username}</Text>
              <Text>{item.text}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Submit Comment" onPress={submitComment} />
    </View>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.navy,
    marginBottom: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: Colors.navy,
  },
  input: {
    height: 40,
    borderColor: Colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: 20,
  },
});
