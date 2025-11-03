import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";

const sortType = [
    { key: 'title', label: 'Titre de la fiction'},
    { key: 'author', label: 'Auteur/Autrice'},
    { key: 'rate', label: 'Note'},
    { key: 'lastReadAt', label: 'Date de dernière lecture'},
    { key: 'createdAt', label: 'Date d\'ajout'},
    { key: 'numberOfWords', label: 'Nombre de mots'},
];

const sortOrderOptions = [
    { key: 'asc', label: 'Croissant'},
    { key: 'desc', label: 'Décroissant'},
];

export const SortModal = ({ isVisible, onClose, defaultSort, onApplySort }) => {

    const { currentTheme } = useTheme();
    
    
    //Etat temporaire des choix fais dans la modale
    const [tempSortType, setTempSortType] = useState(defaultSort.sort);
    const [tempSortOrder, setTempSortOrder] = useState(defaultSort.order)

    useEffect(() => {
        if (isVisible) {
            setTempSortType(defaultSort.sort);
            setTempSortOrder(defaultSort.order);
        }
    }, [isVisible, defaultSort]);
    
    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',        
            alignItems: 'flex-end',
            backgroundColor: '#646464af',        
            paddingTop: 60,
        },
        modalView: {
            width: 'auto',
            minWidth: 300,
            backgroundColor: currentTheme.background, 
            borderRadius: 8,
            paddingTop: 15,
            paddingBottom: 10,
            marginRight: 15,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
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
            flexDirection: 'row',
            height: 245,
            paddingVertical: 10,
            paddingHorizontal: 15,
        },
        // Colonne de Gauche (Types de tri)
        sortTypeContainer: {
            flex: 1,
            paddingRight: 15,
        },
        // Séparateur Vertical
        separator: {
            width: 1,
            backgroundColor: currentTheme.inputBorder,
            marginLeft: 15,
            marginRight: 15,
        },
        // Colonne de Droite (Ordre de tri)
        sortOrderContainer: {
            flex: 1, 
        },

        // --- OPTIONS (Lignes) ---
        optionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
        },
        optionText: {
            ...typography.small,
            color: currentTheme.secondaryText,
        },
        // Style de l'option sélectionnée
        selectedText: {
            ...typography.small,
            fontSize: 15,
            color: currentTheme.primaryPlus, 
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
            backgroundColor: currentTheme.primaryPlus,
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
    })
    

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.optionTitle}>Options de tri</Text>
                    </View>
                    <View style={styles.mainContent}>
                        <View style={styles.sortTypeContainer}>
                            {sortType.map((type) => (
                                <TouchableOpacity
                                    key={type.key}
                                    style={styles.optionRow}
                                    onPress={() => setTempSortType(type.key)}
                                >
                                    <Text style={[styles.optionText, tempSortType === type.key && styles.selectedText]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* Séparateur vertical */}
                        <View style={styles.separator} />

                        <View style={styles.sortOrderContainer}>
                            {sortOrderOptions.map((order) => (
                            <TouchableOpacity
                                key={order.key}
                                style={styles.optionRow}
                                onPress={() => setTempSortOrder(order.key)}
                            >
                                <Text style={[styles.optionText, tempSortOrder === order.key && styles.selectedText]}>
                                    {order.label}
                                </Text>
                            </TouchableOpacity>                    
                            ))}
                        </View>
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
                            onPress={() => onApplySort(tempSortType, tempSortOrder)}
                            disabled={!tempSortType || !tempSortOrder}
                        >
                            <Text style={styles.buttonText}>Appliquer</Text>
                        </TouchableOpacity>
                    </View>                
                </View>
            </View>
        </Modal>
    )

}