// Import useState for keep track of the change
// Import useEffect to run when the App loads
import React, { useState, useEffect } from "react";
// Imported the required components for the UI
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// Import the api to communicate with the backend
import api from './services/api';
// Start the App
export default function App() {
  // Set the array of repositories and create func to set
  const [repositories, setRepositories] = useState([]);
  // Load data from the backend of data when the app loads
  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);
  // Handle the addition of like to repositories
  async function handleLikeRepository(id) {
    // Post the like to the backend by the id
    const response = await api.post(`repositories/${id}/like`);
    // Get the updated data for the repository
    const likedRepository = response.data;
    // Update the array changing the data for the updated repo
    const repositoriesUpdated = repositories.map(repository => {
      // Check if the repositoy id is equal to the one changed
      if(repository.id === id) {
        // Return the updated object (likedRepository)
        return likedRepository;
      } else {
        // Else, return the repository that is currently in the array
        return repository;
      }
    });
    // Set the repository data in the UI with the updated array
    setRepositories(repositoriesUpdated);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
              
              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>{tech}</Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                testID={`repository-likes-${repository.id}`}
              >
                {repository.likes} curtida{repository.likes> 1 ? 's' : ''}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
              </View>
            </View>
          )}
        >
        </FlatList>
      </SafeAreaView>
    </>
  );
}

// Style sheet for the App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
