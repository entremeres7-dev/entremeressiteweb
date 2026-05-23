# Extrait FlatList du Salon (pour audit)

> Extrait demandé par le relecteur pour vérifier la structure du chat et les optimisations possibles.

---

## Structure globale

```
ImageBackground
  LinearGradient (pointerEvents="none")
  SafeAreaView
    KeyboardAvoidingView
      [Header, GroupSwitcher]
      FlatList        ← messages (PAS de ScrollView parent)
      [Bouton scroll bas, JoinFooter, inputBar]
    [Modals, Overlays]
```

✅ **Pas de ScrollView autour de FlatList** – la structure est correcte.

---

## Extrait FlatList (structure actuelle)

*Inclut désormais : `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`, et `onContentSizeChange` conditionné par `ENABLE_CONTENT_SIZE_RESTORE`.*

```tsx
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={displayedMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListHeaderComponent={
            displayedMessages.length > 0 ? (
              <View style={styles.loadOlderContainer}>
                {hasMoreOlderMessages ? (
                  <TouchableOpacity
                    style={[
                      styles.loadOlderButton,
                      isLoadingOlderMessages && styles.loadOlderButtonDisabled,
                    ]}
                    onPress={handleLoadOlderMessages}
                    disabled={isLoadingOlderMessages}
                    activeOpacity={0.85}
                  >
                    {isLoadingOlderMessages ? (
                      <ActivityIndicator size="small" color="#3B0B25" />
                    ) : (
                      <Text style={styles.loadOlderButtonText}>Voir plus</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.loadOlderDoneText}>Vous avez atteint le début du salon</Text>
                )}
              </View>
            ) : null
          }
          ListEmptyComponent={listEmpty}
          refreshing={refreshing}
          onScroll={(event) => {
            const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
            scrollOffsetRef.current = Math.max(0, contentOffset.y);
            schedulePersistScrollOffset();
            persistScrollOffsetThrottled();
            const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
            const atBottom = distanceFromBottom < 40;
            isAtBottomRef.current = atBottom;
            setIsAtBottom(atBottom);
            if (atBottom && newMessagesCount > 0) {
              setNewMessagesCount(0);
            }
          }}
          onMomentumScrollEnd={persistScrollOffset}
          onScrollEndDrag={persistScrollOffset}
          scrollEventThrottle={16}
          onRefresh={() => {
            setRefreshing(true);
            loadMessages();
            if (SHOW_SALON_STORIES) {
              loadStories();
            }
          }}
          onContentSizeChange={
            ENABLE_CONTENT_SIZE_RESTORE
              ? () => {
                  if (hasRestoredScrollRef.current) return;
                  const offsetToRestore = restoreOffsetRef.current ?? 0;
                  if (offsetToRestore > 0) restoreScrollOffset(offsetToRestore);
                }
              : undefined
          }
        />
```

---

## État actuel vs recommandations

| Point | Actuel | Statut |
|-------|--------|--------|
| `setMessages` | Utilise `(prev) => [...prev, newMessage]` | ✅ Correct |
| `keyExtractor` | `(item) => item.id` | ✅ OK |
| `renderItem` | `useCallback` avec deps | ✅ Appliqué |
| Optimisations FlatList | initialNumToRender, windowSize, etc. | ✅ Appliqué |
| Modals ReportContent / InstagramStories | Montage conditionnel | ✅ Appliqué |
| `onContentSizeChange` | Constant `ENABLE_CONTENT_SIZE_RESTORE` | ✅ Variable pour test (passer à `false` si clignotement persiste) |

---

## Composants fullscreen (corrigés)

1. **ReportContent** : monté uniquement quand `showReportModal && selectedMessageForReport` — plus d’overlay fantôme.
2. **InstagramStoriesManager** : monté uniquement quand `showInstagramStories` — plus d’overlay fantôme.

---

## Conclusion de l’audit

> La structure du chat est désormais saine : aucun `ScrollView` parent autour de la `FlatList`, optimisations de rendu appliquées, `renderItem` mémorisé, et modals fullscreen critiques montés conditionnellement. Le bug principal de tab bar semble donc corrigé. Si un clignotement persiste lors de l’envoi d’un message, la prochaine variable à tester est la logique de restauration du scroll dans `onContentSizeChange` via `ENABLE_CONTENT_SIZE_RESTORE`.
