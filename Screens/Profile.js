import { View, Text, TextInput, Button, Image, StyleSheet, Keyboard } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native";

const ProfileHeader = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const getUser = async () => {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUser(user);
                setFirstName(user.firstName);
                setLastName(user.lastName);
            }
        };
        getUser();
    }, []);

    if (!user) return null;

    const handleSave = async () => {
        const updatedUser = { firstName, lastName, phone, email, password };
        try {
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            navigation.navigate('Home');
        } catch (error) {
            setErrors({ save: error.message });
        }
    };

    const discardChanges = () => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setPhone('');
        setEmail('');
        setPassword('');
        setErrors({});
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            navigation.replace('Onboarding');
        } catch (error) {
            setErrors({ logout: error.message });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('../assets/little lemon.jpeg')} style={styles.profilephoto} />
            <Text style={styles.user}>Welcome {user.firstName} {user.lastName}</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    keyboardType="default"
                    returnKeyType="next"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    keyboardType="default"
                    returnKeyType="next"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Telephone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    returnKeyType="next"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    keyboardType="default"
                    returnKeyType="go"
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.buttons}>
                <View style={styles.button}>
                    <Button title="Discard" color="red" onPress={discardChanges} />
                </View>

                <View style={styles.separator} />

                <View style={styles.button}>
                    <Button title="Save" onPress={handleSave} />
                </View>

                <View style={styles.separator} />

                <View style={styles.button}>
                    <Button title="Logout" color="yellow" onPress={handleLogout} />
                </View>
            </View>
            {errors.save && <Text style={styles.error}>{errors.save}</Text>}
            {errors.logout && <Text style={styles.error}>{errors.logout}</Text>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'flex-start',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        width: '100%',
    },
    profilephoto: {
        width: 100,
        height: 100,
        marginBottom: 20,
        alignSelf: 'center',
    },
    user: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
    },
    separator: {
        width: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default ProfileHeader;


