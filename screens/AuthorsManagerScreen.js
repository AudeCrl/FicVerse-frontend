import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "../styles/globalStyles";

export default function AuthorsManagerScreen({ navigation }) {
  const [userAuthors, setUserAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [authorInput, setAuthorInput] = useState("");

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      const newAuthor = {
        id: Date.now().toString(),
        name: authorInput.trim(),
      };
      setUserAuthors([...userAuthors, newAuthor]);
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (authorId) => {
    setUserAuthors(userAuthors.filter((a) => a.id !== authorId));
  };

  const filteredAuthors = userAuthors.filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes auteurs</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un auteur..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#D1D5DB"
        />
      </View>

      {/* Add Author */}
      <View style={styles.addContainer}>
        <TextInput
          style={styles.authorInput}
          placeholder="Ajouter un auteur..."
          value={authorInput}
          onChangeText={setAuthorInput}
          placeholderTextColor="#D1D5DB"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddAuthor}>
          <Feather name="plus" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Authors List */}
      <Text style={styles.sectionTitle}>
        Mes auteurs ({userAuthors.length})
      </Text>
      <FlatList
        data={filteredAuthors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.authorItem}>
            <Text style={styles.authorName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveAuthor(item.id)}>
              <Feather name="trash-2" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
        ListEmptyMessage={
          <Text style={styles.emptyText}>Aucun auteur pour le moment</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fcfff8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  title: {
    ...typography.input,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#1F2937",
  },

  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  authorInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
    color: "#1F2937",
  },

  addButton: {
    backgroundColor: "#9C27B0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    ...typography.input,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  authorItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  authorName: {
    ...typography.input,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },

  emptyText: {
    ...typography.input,
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginVertical: 16,
  },
});
