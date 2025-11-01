import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FictionCard from './FictionCard';
import { typography } from '../../styles/globalStyles.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function FandomCard({ fandomName, fictions }) {
    return (
        <View style={styles.fandomCard}>
            <View style={styles.fandomTitleContainer}>
                <Text style={styles.fandomTitle}>{fandomName}</Text>
                <View style={styles.iconsContainer}>
                    <Ionicons name="chevron-collapse-sharp" size={24} color="black" />
                    <MaterialIcons name="sort" size={24} color="black" />
                </View>
            </View>
            <FlatList
                data={fictions}                             // données à afficher
                renderItem={({ item }) =>                // fonction pour chaque élément
                    <FictionCard 
                        fiction={item} 
                        collapsingState={1} 
                        showReadingStatus={true} 
                    />}
                keyExtractor={(fiction) => fiction._id}     // clé unique (obligatoire)
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fandomCard: {
        paddingBottom: 10,
        marginBottom: 14,
    },
    fandomTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#C4C4C4',
    },
    fandomTitle: {
        ...typography.h2,
        marginBottom: 10,
        color: '#000',
    },
    iconsContainer: {
        flexDirection: 'row',
    },
});