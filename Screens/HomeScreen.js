import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const navigation = useNavigation();
  // Initialize state variables
  const [db, setDb] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        const db = await SQLite.openDatabaseAsync('menu.db');
        
        // Create table if it doesn't exist
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(256),
            price REAL,
            description TEXT,
            image TEXT,
            category VARCHAR(256)
          );
        `);
        
        // Fetch and save menu data
        const response = await fetch("https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json");
        const jsonData = await response.json();
        // Extract the menu array from the response
        const menuItems = jsonData.menu || [];
        setData(menuItems);
        
        // Set the first category as default selected
        if (menuItems.length > 0) {
          const categories = [...new Set(menuItems.map(item => item.category || 'Other'))];
          setSelectedCategory(categories[0]);
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const saveMenuData = async (menuItems) => {
    try {
      // Clear existing data
      await db.runAsync('DELETE FROM menu;');
      
      // Insert new data
      for (const item of menuItems) {
        await db.runAsync(
          'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
          [item.name, item.price, item.description, item.image, item.category]
        );
        console.log(`Inserted ${item.name}`);
      }
      
      console.log("All menu data saved successfully");
    } catch (error) {
      console.error("Error saving menu data:", error);
      throw error;
    }
  };


  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  // Group data by category for SectionList
  const groupedData = data.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedData);
  const selectedItems = selectedCategory ? groupedData[selectedCategory] || [] : [];

  return (
    
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.TopContainer}>
        <Image
          source={require('../assets/little_lemon_resturant.webp')}
          style={{ width: '100%', height: 150 }}
          resizeMode="cover"
        />
      </View>
      
      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContentContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              selectedCategory === category && styles.activeTab
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.tabText,
              selectedCategory === category && styles.activeTabText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => {
            
            // Navigate to ProfileScreen with an image
            // Assuming you have a ProfileScreen set up in your navigation stack
           
            navigation.navigate('Profilescreen')
          }}
        >
          <Text>Profile</Text>
          </TouchableOpacity>
      </ScrollView>
      
      {/* Menu Items for Selected Category */}
      <ScrollView style={styles.menuContainer}>
        {selectedItems.map((item, itemIndex) => (
          <View key={itemIndex} style={styles.menuItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TopContainer: {
    marginBottom: 10,
  },
  tabContainer: {
    maxHeight: 60,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContentContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 80,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textTransform: 'capitalize',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    padding: 15,
  },
  menuItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

