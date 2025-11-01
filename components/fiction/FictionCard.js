import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// import FictionCard from './FictionCard';
import { typography } from '../../styles/globalStyles.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Linking from "expo-linking";

export default function FictionCard({ fiction, collapsingState, showReadingStatus }) {

    const readingStatusLabels = {
        'to-read': 'A lire',
        'reading': 'En cours',
        'finished': 'Terminée',
    };
    
    const storyStatusLabels = {
        'in-progress': 'En cours de publication',
        'completed': 'Publication terminée',
        'one-shot': 'One-shot',
        'abandoned': 'Publication abandonée',
    };

    const handleNavigate = () => {
        fiction.link && Linking.openURL(fiction.link);
    };

    const metadata =
        (fiction.lang || fiction.storyStatus || fiction.numberOfChapters || fiction.numberOfWords) ? (
            <View style={styles.metadataContainer}>
                <View style={styles.metadataLeftCol}>
                    {fiction.lang && <Text style={styles.metadataLeft}>{fiction.lang}</Text>}
                    {fiction.storyStatus && <Text style={styles.metadataLeft}>{storyStatusLabels[fiction.storyStatus]}</Text>}
                </View>
                <View style={styles.metadataRightCol}>
                    {fiction.numberOfChapters && <Text style={styles.metadataRight}>{fiction.numberOfChapters} chapitres</Text>}
                    {fiction.numberOfWords && <Text style={styles.metadataRight}>{fiction.numberOfWords} mots</Text>}
                </View>
            </View>
        ) : null;

    return (
        <View style={styles.fictionCard}>
            {showReadingStatus &&
                <Text style={styles.readingStatus}>{readingStatusLabels[fiction.readingStatus]}</Text>
            }
            <View style={styles.titleContainer}>
                <Text style={styles.title} onPress={handleNavigate}>{fiction.title}</Text>
                <MaterialIcons name="more-horiz" size={24} color="black" />
            </View>
            {(fiction.author || fiction.rate.display) && 
                <View style={styles.authorRateContainer}>
                    {fiction.author && 
                        <View style={styles.authorContainer}>
                            <Text>par </Text>
                            <View style={styles.authorChip}><Text>{fiction.author}</Text></View>
                        </View>
                    }
                    {fiction.rate.display && 
                        <View style={styles.rate}>
                            <Ionicons name="heart" size={24} color="black" />
                        </View>
                    }
                </View>
            }
            {metadata}
            {fiction.summary &&
                <Text style={styles.summary}>{fiction.summary}</Text>
            }
            {fiction.personalNotes &&
                <Text style={styles.personalNotes}>{fiction.personalNotes}</Text>
            }
            {fiction.lastChapterRead &&
                <Text style={styles.lastChapterRead}>Dernier chapitre lu : {fiction.lastChapterRead}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    fictionCard: {
        ...typography.body,
        paddingVertical: 10,
        marginBottom: 14,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#C4C4C4',
    },
    readingStatus: {

    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        ...typography.h3,
        color: '#000',
    },
    authorRateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    authorContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 2,
    },
    authorChip: {
        backgroundColor: '#C6DCFF',
        height: 27,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 6,
    },
    rate: {
        height: 27,
        justifyContent: 'center',
    },
    metadataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    metadataLeftCol: {
        alignItems: 'flex-start',        
    },
    metadataRightCol: {
        alignItems: 'flex-end',        
    },
    summary: {
        ...typography.body,
        marginBottom: 8,
    },
    personalNotes: {
        ...typography.bodyItalic,
        marginBottom: 8,
    },
    lastChapterRead: {
        ...typography.body,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
});