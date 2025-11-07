import { useMemo } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useTheme } from "../../context/ThemeContext.js";
import { typography } from "../../styles/globalStyles.js";
import RoundedButton from "../ui/RoundedButton.js";

export default function ChosenStatus({
    readingStatus = null,
    storyStatus = null,
    onPress = null,
    sectionLabel = null,
}) {
    const { currentTheme } = useTheme();

    const readingStatusList = [
        { id: "reading", label: "En cours" },
        { id: "to-read", label: "A lire" },
        { id: "finished", label: "Terminée" },
    ];

    const storyStatusList = [
        { id: "in-progress", label: "En cours" },
        { id: "completed", label: "Terminée" },
        { id: "one-shot", label: "One-shot" },
        { id: "abandoned", label: "Abandonnée" },
    ];

    const styles = useMemo(() =>
        StyleSheet.create({
            statusSectionContainer: {
            },
            sectionLabel: {
                ...typography.body,
                color: currentTheme.text,
                marginBottom: 8,
            },
            statusContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12, // même espacement pour les 2 composants
            },
        }),
        [currentTheme] // Regenerate styles only when theme or variant changes
    );   

    return (
        <View style={styles.statusSectionContainer}>
            
            {!!sectionLabel && 
                <Text style={styles.sectionLabel}>{sectionLabel}</Text>}
            
            <ScrollView
                horizontal // ScrollView horizontal pour les boutons
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statusContainer}
            >
            
                <View style={styles.statusContainer}>
                
                    {!!readingStatus && readingStatusList.map((r) => (
                        <RoundedButton 
                            key={r.id} 
                            label={r.label} 
                            active={r.id === readingStatus} 
                            onPress={() => onPress?.(r.id)}
                        />
                    ))}

                    {!!storyStatus && storyStatusList.map((r) => (
                        <RoundedButton 
                            key={r.id} 
                            label={r.label} 
                            active={r.id === storyStatus} 
                            onPress={() => onPress?.(r.id)}
                        />
                    ))}

                </View>
            </ScrollView>
        </View>
    );
}
