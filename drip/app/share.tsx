import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { DropletIcon } from '@/src/components/DropletIcon';
import { CloseIcon, ShareIcon } from '@/src/components/Icons';
import { RadialGlow } from '@/src/components/RadialGlow';
import { getDripById } from '@/src/features/drip/dripService';
import { useDrip } from '@/src/features/drip/useDrip';
import { CATEGORY_ACCENT, GLASS_BG_STRONG, GLASS_BORDER, LIGHT_BUTTON_GRADIENT, TEXT_DIM, hexToRgba } from '@/src/theme/colors';
import { SANS_SEMIBOLD, SERIF, SERIF_ITALIC } from '@/src/theme/fonts';

export default function ShareScreen() {
  const currentDripId = useDrip((s) => s.currentDripId);
  const drip = currentDripId != null ? getDripById(currentDripId) : undefined;
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState<'save' | 'share' | null>(null);

  useEffect(() => {
    if (!drip) router.back();
  }, [drip]);

  if (!drip) return null;

  const accent = CATEGORY_ACCENT[drip.category];

  const captureCard = async () => {
    if (!cardRef.current) return null;
    return captureRef(cardRef, { format: 'png', quality: 1 });
  };

  const onSaveImage = async () => {
    setBusy('save');
    try {
      const uri = await captureCard();
      if (!uri) return;
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow photo access to save your Drip card.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved', 'Your Drip card was saved to your photos.');
    } catch {
      Alert.alert('Couldn’t save', 'Something went wrong saving your Drip card.');
    } finally {
      setBusy(null);
    }
  };

  const onCopy = async () => {
    await Clipboard.setStringAsync(drip.text + (drip.author ? ` — ${drip.author}` : ''));
    Alert.alert('Copied', 'The drip text is on your clipboard.');
  };

  const onShare = async () => {
    setBusy('share');
    try {
      const uri = await captureCard();
      if (!uri) return;
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Sharing unavailable', 'Sharing isn’t supported on this device.');
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.root}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>Your Drip card</Text>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <CloseIcon size={16} />
          </Pressable>
        </View>

        <View style={styles.cardWrap}>
          <View style={styles.glow}>
            <RadialGlow width={230} height={200} color={accent} opacity={0.75} />
          </View>
          <View ref={cardRef} collapsable={false} style={styles.card}>
            <LinearGradient
              colors={[hexToRgba(accent, 0.22), '#171e3a', '#0b1022']}
              locations={[0, 0.4, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardInner}>
              <View style={[styles.cardIconCircle, { shadowColor: accent }]}>
                <DropletIcon size={27} color="#dbe5ff" />
              </View>
              <View style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: accent }]} />
                <Text style={styles.catLabel}>{drip.category}</Text>
              </View>
              <Text style={styles.dripText}>{drip.text}</Text>
              {drip.author ? <Text style={styles.author}>— {drip.author}</Text> : null}
              <View style={styles.brandRow}>
                <DropletIcon size={13} color={TEXT_DIM(0.5)} />
                <Text style={styles.brand}>drip.app</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sizedFor}>Sized for Instagram Stories</Text>
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionButton} onPress={onSaveImage} disabled={busy !== null}>
            {busy === 'save' ? <ActivityIndicator color="#eef1f8" /> : <Text style={styles.actionLabel}>Save image</Text>}
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onCopy} disabled={busy !== null}>
            <Text style={styles.actionLabel}>Copy</Text>
          </Pressable>
          <Pressable onPress={onShare} disabled={busy !== null} style={{ borderRadius: 16, overflow: 'hidden' }}>
            <LinearGradient colors={LIGHT_BUTTON_GRADIENT} style={styles.shareIconButton}>
              {busy === 'share' ? <ActivityIndicator color="#12162a" /> : <ShareIcon size={19} />}
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6,9,18,.55)',
  },
  content: {
    flex: 1,
    paddingTop: 58,
    paddingHorizontal: 26,
    paddingBottom: 36,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heading: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 16,
    color: '#eef1f8',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 230,
    height: 200,
  },
  card: {
    width: 300,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.14)',
  },
  cardInner: {
    paddingTop: 44,
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  cardIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowOpacity: 0.7,
    shadowRadius: 18,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 22,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  catLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 10,
    letterSpacing: 2.5,
    color: TEXT_DIM(0.65),
  },
  dripText: {
    fontFamily: SERIF,
    fontSize: 27,
    lineHeight: 35,
    letterSpacing: -0.3,
    textAlign: 'center',
    color: '#eef1f8',
  },
  author: {
    fontFamily: SERIF_ITALIC,
    fontSize: 15,
    color: TEXT_DIM(0.6),
    marginTop: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 30,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,.1)',
    width: '100%',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: SERIF,
    fontSize: 14,
    letterSpacing: 0.2,
    color: TEXT_DIM(0.55),
  },
  sizedFor: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 12,
    color: TEXT_DIM(0.42),
    textAlign: 'center',
    marginBottom: 13,
    letterSpacing: 0.3,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: GLASS_BG_STRONG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 14,
    color: '#eef1f8',
  },
  shareIconButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
