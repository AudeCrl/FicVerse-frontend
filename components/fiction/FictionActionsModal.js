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
  left: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  roundButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  input: {
    width: 50,
    textAlign: "center",
    marginHorizontal: 8,
    borderBottomWidth: 1,
  },
  heartsRow: {
    flexDirection: "row",
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

                        {/* ACTION 2: Update lastChapterRead */}
                        <View style={styles.actionRow}>
                            <View style={styles.left}>
                            <Text style={styles.actionText}>Dernier chapitre lu</Text>
                        </View>

                            <View style={styles.rightRow}>
                            <Pressable style={styles.roundButton}><Text>-</Text></Pressable>
                            <TextInput
                                style={styles.input}
                                value={String(fiction?.lastChapterRead ?? 0)}
                                keyboardType="numeric"
                            />
                            <Pressable style={styles.roundButton}><Text>+</Text></Pressable>
                            </View>
                        </View>

                        {/* --- ACTION 3 : Modifier sa note (1 à 5 coeurs) --- */}
                        <View style={styles.actionRow}>
                            <View style={styles.left}>
                            <Text style={styles.actionText}>Votre note</Text>
                            </View>

                            <View style={styles.heartsRow}>
                            {[1,2,3,4,5].map(index => (
                                <Ionicons
                                key={index}
                                name="heart"
                                size={32} // taille plus grande
                                style={{ marginHorizontal: 4 }}
                                color={index <= (fiction?.rate?.value ?? 0) ? "#E91E63" : "gray"}
                                />
                            ))}
                            </View>
                        </View>

                        {/* --- ACTION 4 : Modifier infos fanfiction --- */}
                        <Pressable style={styles.actionRow} onPress={() => console.log("TODO modify info")}>
                            <MaterialIcons name="edit" size={22} />
                            <Text style={styles.actionText}>Modifier les informations</Text>
                        </Pressable>

                        {/* --- ACTION 5 : Dupliquer la fiction --- */}
                        <Pressable style={styles.actionRow} onPress={() => console.log("TODO duplicate")}>
                            <Ionicons name="copy" size={22} />
                            <Text style={styles.actionText}>Dupliquer la fanfiction</Text>
                        </Pressable>

                        {/* --- ACTION 6 : Supprimer la fiction --- */}
                        <Pressable style={styles.actionRow} onPress={() => console.log("TODO delete")}>
                            <MaterialIcons name="delete" size={22} color="red" />
                            <Text style={[styles.actionText, { color: "red" }]}>Supprimer la fanfiction</Text>
                        </Pressable>


                    </View>
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={styles.footerButton}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.footerButton, styles.applyButton]}
                        >
                            <Text style={styles.buttonText}>Appliquer</Text>
                        </TouchableOpacity>
                    </View>                
                </View>
            </View>
        </Modal>
    )

}

                        // {/* --- ACTION 2 : Modifier le dernier chapitre lu --- */}
                        // <View style={styles.actionRow}>
                        //     <View style={styles.left}>
                        //     <Text style={styles.actionText}>Dernier chapitre lu</Text>
                        //     </View>

                        //     <View style={styles.rightRow}>
                        //     <Pressable style={styles.roundButton}><Text>-</Text></Pressable>
                        //     <TextInput
                        //         style={styles.input}
                        //         value={String(fiction?.lastChapterRead ?? 0)}
                        //         keyboardType="numeric"
                        //     />
                        //     <Pressable style={styles.roundButton}><Text>+</Text></Pressable>
                        //     </View>
                        // </View>

                        // {/* --- ACTION 3 : Modifier sa note (1 à 5 coeurs) --- */}
                        // <View style={styles.actionRow}>
                        //     <View style={styles.left}>
                        //     <Text style={styles.actionText}>Votre note</Text>
                        //     </View>

                        //     <View style={styles.heartsRow}>
                        //     {[1,2,3,4,5].map(index => (
                        //         <Ionicons
                        //         key={index}
                        //         name="heart"
                        //         size={32} // taille plus grande
                        //         style={{ marginHorizontal: 4 }}
                        //         color={index <= (fiction?.rate?.value ?? 0) ? "#E91E63" : "gray"}
                        //         />
                        //     ))}
                        //     </View>
                        // </View>

                        // {/* --- ACTION 4 : Modifier infos fanfiction --- */}
                        // <Pressable style={styles.actionRow} onPress={() => console.log("TODO modify info")}>
                        //     <MaterialIcons name="edit" size={22} />
                        //     <Text style={styles.actionText}>Modifier les informations</Text>
                        // </Pressable>

                        // {/* --- ACTION 5 : Dupliquer la fiction --- */}
                        // <Pressable style={styles.actionRow} onPress={() => console.log("TODO duplicate")}>
                        //     <Ionicons name="copy" size={22} />
                        //     <Text style={styles.actionText}>Dupliquer la fanfiction</Text>
                        // </Pressable>

                        // {/* --- ACTION 6 : Supprimer la fiction --- */}
                        // <Pressable style={styles.actionRow} onPress={() => console.log("TODO delete")}>
                        //     <MaterialIcons name="delete" size={22} color="red" />
                        //     <Text style={[styles.actionText, { color: "red" }]}>Supprimer la fanfiction</Text>
                        // </Pressable>
