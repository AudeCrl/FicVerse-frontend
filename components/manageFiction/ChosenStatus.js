import { useMemo } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
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
                marginBottom: 10,
            },
            sectionLabel: {
                ...typography.body,
                color: currentTheme.text,
                marginBottom: 8,
            },
            statusContainer: {
                flexDirection: 'row',
            },
        }),
        [currentTheme] // Regenerate styles only when theme or variant changes
    );   

    return (
        <View style={styles.statusSectionContainer}>
            {!!sectionLabel && <Text style={styles.sectionLabel}>{sectionLabel}</Text>}
            <View style={styles.statusContainer}>
            {!!readingStatus && readingStatusList.map((r) => (
                <RoundedButton 
                    key={r.id} 
                    label={r.label} 
                    active={r.id === readingStatus} 
                    onPress={() => onPress?.(r.id)}
                    style={{marginRight: 14}}
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
        </View>
    );
}
