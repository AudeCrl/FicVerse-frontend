import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Pressable, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import ChosenStatus from './ChosenStatus.js';

export const FictionActionsModal = ({ isVisible, onClose, fiction }) => {

    const { currentTheme } = useTheme();    

    const [ selectedReadingStatus, setSelectedReadingStatus ] = useState(fiction?.readingStatus ?? null);

    const handleReadingStatusChange = (newReadingStatus) => {
        setSelectedReadingStatus(newReadingStatus);
    }

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
        modalContainer: {
            width: '100%',
            backgroundColor: currentTheme.background, 
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            paddingTop: 15,
            paddingBottom: 10,
            elevation: 10,
        },
        header: {
            paddingHorizontal: 15,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.inputBorder,
        },
        optionTitle: {
            ...typography.h3,
            color: currentTheme.text,
        },
        mainContent: {
            paddingVertical: 10,
            paddingHorizontal: 15,
        },
        // --- ACTIONS (Lignes) ---
        actionRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
        },

        // --- FOOTER ---
        footerContainer: {
            flexDirection: 'row',
            justifyContent: 'center', // Centrer les boutons
            paddingTop: 10,
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: currentTheme.inputBorder,
        },
        footerButton: {
            marginLeft: 30,
            paddingVertical: 10,
            paddingHorizontal: 15,
        },
        applyButton: {
            backgroundColor: currentTheme.primary,
            borderRadius: 5,
        },
        buttonText: {
            color: currentTheme.text,
            fontSize: 16,
        },
        applyButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        }
    });
    

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={onClose}
            animationType="slide"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.optionTitle}>{fiction?.title}</Text>
                    </View>

                    <View style={styles.mainContent}>

                        {/* ACTION 1: Update readingStatus and lastChapterRead */}
                        <View style={styles.actionRow}>
                            <ChosenStatus 
                                sectionLabel="Avancement de votre lecture"
                                readingStatus={selectedReadingStatus}
                                onPress={handleReadingStatusChange}
                            />
                        </View>
                    </View>                
                </View>
            </View>
        </Modal>
    )

}