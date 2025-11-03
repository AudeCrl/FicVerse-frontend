import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import FictionCard from './FictionCard';
import { useTheme } from '../../context/ThemeContext.js';
import { typography } from '../../styles/globalStyles.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SortModal } from './SortModal'


export default function FandomCard({ fandomName, fictions, onGlobalSortChange, currentGlobalSort }) {
    const { currentTheme } = useTheme();

    const [isSortModalVisible, setIsSortModalVisible] = useState(false);

    // Memorize styles so they only update when the theme changes
    const styles = useMemo(() =>
        StyleSheet.create({
            fandomCard: {
                paddingBottom: 10,
            },
            fandomTitleContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                borderColor: currentTheme.segmentation,
            },
            fandomTitle: {
                ...typography.h2,
                color: currentTheme.text,
                marginBottom: 10,
            },
            iconsContainer: {
                flexDirection: 'row',
            },
            collapseIcon: {
                color: currentTheme.text,
                paddingLeft: 10,
            },
            sortIcon: {
                color: currentTheme.text,
                paddingLeft: 10,
            },
        }),
        [currentTheme] // Regenerate styles only when theme or variant changes
    );
    
    const openSortModal = () => {
        setIsSortModalVisible(true);
    };

    const handleSortChange = (newSortType, newSortOrder) => {
        onGlobalSortChange(newSortType, newSortOrder);
        setIsSortModalVisible(false);
    }
    
    return (
        <View style={styles.fandomCard}>
            <View style={styles.fandomTitleContainer}>
                <Text style={styles.fandomTitle}>{fandomName}</Text>
                <View style={styles.iconsContainer}>
                    <Ionicons name="chevron-collapse-sharp" size={24} style={styles.collapseIcon} />
                    <TouchableOpacity onPress={openSortModal}>
                        <MaterialIcons name="sort" size={24} style={styles.sortIcon} />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={fictions}                             // données à afficher
                renderItem={({ item }) =>                   // fonction pour chaque élément
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
            <SortModal
                isVisible={isSortModalVisible}
                onClose={() => setIsSortModalVisible(false)}
                defaultSort={currentGlobalSort}
                onApplySort={handleSortChange}
            />
        </View>
    );
}