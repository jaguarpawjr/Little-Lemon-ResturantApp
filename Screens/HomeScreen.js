import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList, ActivityIndicator } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useNavigation } from "@react-navigation/native";
let db;


export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        await initializeDatabase();
        
        // Fetch and save menu data
        const response = await fetch("https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json");
        const jsonData = await response.json();
        // Extract the menu array from the response
        const menuItems = jsonData.menu || [];
        setData(menuItems);
        
        // Save data to SQLite
        await saveMenuData(menuItems);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const initializeDatabase = async () => {
    try {
      // Initialize database
      db = await SQLite.openDatabaseAsync('menu.db');
      
      // Create table if it doesn't exist
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(256),
          price REAL,
          description TEXT,
          image VARCHAR(256),
          category VARCHAR(256)
        );
      `);
      
      console.log("Database and table created successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  };

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


  if (error) return <Text>Error: {error}</Text>;

  return (
    <SectionList
      sections={[
        {
          title: 'Menu',
          data: data,
        }
      ]}
      keyExtractor={(item, index) => item.name + index}
      renderItem={({ item }) => (
        <View style={styles.menuItem}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemCategory}>Category: {item.category}</Text>
        </View>
      )}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
});
