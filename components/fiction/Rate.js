import { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons"; // Tu peux changer la lib
import { typography } from "../../styles/globalStyles.js";

export default function Rate({
    iconName = "heart",     // available values: 'heart', 'star', 'flame','diamond'
    value = 0,              // current rate (0 -> 5)
    onPress = null,         // callback: new rate
    hideRate = false,       // bool -> check or not the "Don't display" checkbox (if editable)
    onToggleHide = null,    // function which handles "Don't display" toggle
    editable = false,
    sectionLabel = null,
    style = {},
}) {

    const { currentTheme } = useTheme();

    const styles = useMemo(() =>
        StyleSheet.create({
            rateSectionContainer: {
            },
            sectionLabel: {
                ...typography.body,
                color: currentTheme.text,
                marginBottom: 10,
            },
            iconsContainer: {
                flexDirection: 'row',
            },
            icon: {
                marginRight: editable ? 14 : 0,
            },
            hideRow: {
                marginTop: 10,
                flexDirection: 'row',
            },
            hideLabel: {
                ...typography.body,
                color: currentTheme.text,
                marginLeft: 8,
            },
            ...style
        }),
        [currentTheme] // Regenerate styles only when theme or variant changes
    );

    return (
        <View style={styles.rateSectionContainer}>
            
            {!!sectionLabel && 
                <Text style={styles.sectionLabel}>{sectionLabel}</Text>}

            {/* --- Icons
            If editable = false, the icon can't be pressed (-> View instead of Pressable)
            If editable, we had hitSlop = pressable area around the item (better UX) */}
            <View style={styles.iconsContainer}>
                {[1, 2, 3, 4, 5].map((index) => {

                    const Wrapper = editable ? Pressable : View;

                    return (
                        <Wrapper 
                            key={index} 
                            onPress={() => editable && onPress?.(index)}
                            hitSlop={editable ? { top: 7, bottom: 7, left: 7, right: 7 } : undefined}
                        >
                            <Ionicons
                                name={iconName}
                                size={editable ? 34 : 18}
                                style={styles.icon}
                                color={value >= index ? currentTheme.primaryPlus : currentTheme.inactivePlus}
                            />
                        </Wrapper>
                    );
                })}
            </View>

            {/* Checkbox "Hide the rate" (visible only if editable) */}
            {editable &&
                <Pressable style={styles.hideRow} onPress={onToggleHide}>
                    <Ionicons
                        name={hideRate ? "checkbox-outline" : "square-outline"}
                        size={22}
                        color={currentTheme.text}
                    />
                    <Text style={styles.hideLabel}>Ne pas afficher</Text>
                </Pressable>
            }
        </View>
    );
}