import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import styles from './styles';

const Chat = () => {
    const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { id: Date.now().toString(), text: input }]);
            setInput('');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.message}>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Tipo de mensagem"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};


export default Chat;