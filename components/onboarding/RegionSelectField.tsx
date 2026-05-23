import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { getRegionsForCountry } from '@/constants/profileSetup';

type Props = {
  colors: AppColors;
  country: string;
  value: string | null;
  onChange: (region: string) => void;
  label?: string;
};

export function RegionSelectField({
  colors,
  country,
  value,
  onChange,
  label = 'Région *',
}: Props) {
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const options = useMemo(() => getRegionsForCountry(country), [country]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((r) => r.toLowerCase().includes(q));
  }, [options, query]);

  const regionLabel = country === 'France' ? 'Département *' : label;

  const pick = (region: string) => {
    onChange(region);
    setOpen(false);
    setQuery('');
  };

  return (
    <View>
      <Text style={styles.label}>{regionLabel}</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {value ?? 'Choisir dans la liste'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { paddingTop: insets.top + 8 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{regionLabel.replace(' *', '')}</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={12}>
              <Ionicons name="close" size={28} color={colors.text} />
            </Pressable>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Rechercher…"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            {...(Platform.OS === 'ios' ? { clearButtonMode: 'while-editing' as const } : {})}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, value === item && styles.optionOn]}
                onPress={() => pick(item)}
              >
                <Text style={[styles.optionText, value === item && styles.optionTextOn]}>
                  {item}
                </Text>
                {value === item ? (
                  <Ionicons name="checkmark" size={22} color={colors.pink} />
                ) : null}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>Aucun résultat pour « {query} »</Text>
            }
          />
        </View>
      </Modal>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    label: {
      color: c.text,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 10,
      marginTop: 8,
    },
    selector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    selectorText: {
      flex: 1,
      color: c.text,
      fontSize: 16,
      marginRight: 8,
    },
    placeholder: {
      color: c.textMuted,
    },
    modal: {
      flex: 1,
      backgroundColor: c.bg,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    modalTitle: {
      color: c.text,
      fontSize: 18,
      fontWeight: '700',
    },
    search: {
      marginHorizontal: 16,
      marginVertical: 12,
      backgroundColor: c.surface,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: c.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    optionOn: {
      backgroundColor: c.card,
    },
    optionText: {
      color: c.text,
      fontSize: 16,
      flex: 1,
    },
    optionTextOn: {
      fontWeight: '700',
      color: c.pink,
    },
    empty: {
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 32,
      paddingHorizontal: 24,
    },
  });
}
