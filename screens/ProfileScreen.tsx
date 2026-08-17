import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
  PanResponder,
  type GestureResponderEvent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import LoadingScreen from '../components/LoadingScreen';
import ScrollFloat from '../components/ScrollFloat';
import { colors, typography, spacing, radius } from '../theme';
import { useAnonymousAuth } from '../hooks/useAnonymousAuth';
import { getUserStats, saveUserStats } from '../data/userStats';

const INJURY_TAGS = ['SHOULDER', 'KNEE', 'LOWER BACK', 'ELBOW'];
const AGE_MIN = 16;
const AGE_MAX = 80;
const LBS_PER_KG = 2.20462;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lbsToKg(lbs: number) {
  return Math.round(lbs / LBS_PER_KG);
}

function kgToLbs(kg: number) {
  return Math.round(kg * LBS_PER_KG);
}

function feetInchesToCm(feet: number, inches: number) {
  return Math.round((feet * 12 + inches) * 2.54);
}

function cmToFeetInches(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  return { feet: Math.floor(totalInches / 12), inches: totalInches % 12 };
}

function RulerScale({ count = 24, majorEvery = 4 }: { count?: number; majorEvery?: number }) {
  return (
    <View style={rulerStyles.ruler}>
      {Array.from({ length: count }).map((_, i) => {
        const isMajor = i % majorEvery === 0;
        return (
          <View
            key={i}
            style={[
              rulerStyles.tick,
              { height: isMajor ? 9 : 4, backgroundColor: isMajor ? colors.primary : colors.outlineVariant },
            ]}
          />
        );
      })}
    </View>
  );
}

const rulerStyles = StyleSheet.create({
  ruler: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 10, width: '100%' },
  tick: { width: 1.5, borderRadius: 1 },
});

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { uid, ready } = useAnonymousAuth();
  const { width } = useWindowDimensions();
  const scale = clamp(width / 390, 0.88, 1.15);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('edit');
  const [hasProfile, setHasProfile] = useState(false);

  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [age, setAge] = useState(28);
  const [weightUnit, setWeightUnit] = useState<'LBS' | 'KG'>('LBS');
  const [weight, setWeight] = useState('185');
  const [heightUnit, setHeightUnit] = useState<'CM' | 'FT-IN'>('FT-IN');
  const [feet, setFeet] = useState('6');
  const [inches, setInches] = useState('1');
  const [cm, setCm] = useState(String(feetInchesToCm(6, 1)));
  const [injuries, setInjuries] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const trackWidthRef = useRef(0);
  const scrollRef = useRef<ScrollView>(null);
  const weightInputRef = useRef<TextInput>(null);
  const feetInputRef = useRef<TextInput>(null);
  const inchesInputRef = useRef<TextInput>(null);
  const cmInputRef = useRef<TextInput>(null);
  const notesInputRef = useRef<TextInput>(null);

  const scrollToInput = useCallback((ref: React.RefObject<TextInput | null>) => {
    requestAnimationFrame(() => {
      const scrollNode = scrollRef.current;
      const inputNode = ref.current;
      if (!scrollNode || !inputNode) return;
      inputNode.measureLayout(
        scrollNode as unknown as React.ComponentRef<typeof ScrollView>,
        (_x: number, y: number, _w: number, h: number) => {
          scrollNode.scrollTo({ y: Math.max(y - 24, 0), animated: true });
        },
        () => {}
      );
    });
  }, []);

  const ageFromLocation = useCallback((x: number) => {
    const width = trackWidthRef.current;
    if (!width) return null;
    const ratio = clamp(x / width, 0, 1);
    return Math.round(AGE_MIN + ratio * (AGE_MAX - AGE_MIN));
  }, []);

  const agePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          const next = ageFromLocation(e.nativeEvent.locationX);
          if (next !== null) setAge(next);
        },
        onPanResponderMove: (e: GestureResponderEvent) => {
          const next = ageFromLocation(e.nativeEvent.locationX);
          if (next !== null) setAge(next);
        },
      }),
    [ageFromLocation]
  );

  useEffect(() => {
    if (!ready || !uid) return;
    (async () => {
      const stats = await getUserStats(uid);
      if (stats) {
        setGender(stats.gender ?? 'MALE');
        setAge(stats.age ?? 28);
        setWeightUnit(stats.weightUnit ?? 'LBS');
        setWeight(String(stats.weight ?? 185));
        setHeightUnit(stats.heightUnit ?? 'FT-IN');
        const f = stats.heightFeet ?? 6;
        const i = stats.heightInches ?? 1;
        setFeet(String(f));
        setInches(String(i));
        setCm(String(feetInchesToCm(f, i)));
        setInjuries(stats.injuries ?? []);
        setNotes(stats.notes ?? '');
        setMode('view');
        setHasProfile(true);
      }
      setLoading(false);
    })();
  }, [ready, uid]);

  const toggleInjury = (tag: string) => {
    setInjuries((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleWeightUnitChange = useCallback(
    (unit: 'LBS' | 'KG') => {
      if (unit === weightUnit) return;
      const current = parseFloat(weight) || 0;
      const converted = unit === 'KG' ? lbsToKg(current) : kgToLbs(current);
      setWeight(String(converted));
      setWeightUnit(unit);
    },
    [weight, weightUnit]
  );

  const handleHeightUnitChange = useCallback(
    (unit: 'CM' | 'FT-IN') => {
      if (unit === heightUnit) return;
      if (unit === 'CM') {
        const feetNum = parseInt(feet, 10) || 0;
        const inchesNum = parseInt(inches, 10) || 0;
        setCm(String(feetInchesToCm(feetNum, inchesNum)));
      } else {
        const cmNum = parseInt(cm, 10) || 0;
        const { feet: f, inches: i } = cmToFeetInches(cmNum);
        setFeet(String(f));
        setInches(String(i));
      }
      setHeightUnit(unit);
    },
    [feet, inches, cm, heightUnit]
  );

  const handleSave = useCallback(async () => {
    if (!uid) return;
    setSaving(true);
    setSaved(false);
    try {
      const feetNum = heightUnit === 'FT-IN' ? parseInt(feet, 10) || 0 : cmToFeetInches(parseInt(cm, 10) || 0).feet;
      const inchesNum = heightUnit === 'FT-IN' ? parseInt(inches, 10) || 0 : cmToFeetInches(parseInt(cm, 10) || 0).inches;
      await saveUserStats(uid, {
        gender,
        age,
        weightUnit,
        weight: parseFloat(weight) || 0,
        heightUnit,
        height: heightUnit === 'CM' ? parseInt(cm, 10) || 0 : feetInchesToCm(feetNum, inchesNum),
        heightFeet: feetNum,
        heightInches: inchesNum,
        injuries,
        notes,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setMode('view');
      setHasProfile(true);
    } finally {
      setSaving(false);
    }
  }, [uid, gender, age, weightUnit, weight, heightUnit, feet, inches, cm, injuries, notes]);

  const s = makeStyles(scale);

  if (loading) {
    return (
      <View style={s.screen}>
        <IronHeader showBack onBackPress={() => navigation.goBack()} />
        <LoadingScreen label="LOADING PROFILE…" />
      </View>
    );
  }

  if (mode === 'view') {
    const heightDisplay = heightUnit === 'CM' ? `${cm} CM` : `${feet}' ${inches}"`;
    return (
      <View style={s.screen}>
        <IronHeader showBack onBackPress={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.pageHeader}>
            <View style={s.spread}>
              <ScrollFloat textStyle={s.pageTitle} duration={1400} distance={22} stagger={0.045}>
                PROFILE
              </ScrollFloat>
              <TouchableOpacity style={s.editIconBtn} onPress={() => setMode('edit')} activeOpacity={0.8}>
                <MaterialIcons name="edit" size={16 * scale} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={s.pageSub}>YOUR TRAINING PROFILE</Text>
          </View>

          <View style={s.gridTwo}>
            <View style={[s.card, s.gridCard]}>
              <Text style={s.label}>GENDER</Text>
              <Text style={s.summaryValue}>{gender}</Text>
            </View>
            <View style={[s.card, s.gridCard]}>
              <Text style={s.label}>AGE</Text>
              <Text style={s.summaryValue}>{age}</Text>
            </View>
          </View>

          <View style={s.gridTwo}>
            <View style={[s.card, s.gridCard]}>
              <Text style={s.label}>WEIGHT</Text>
              <Text style={s.summaryValue}>{weight} {weightUnit}</Text>
            </View>
            <View style={[s.card, s.gridCard]}>
              <Text style={s.label}>HEIGHT</Text>
              <Text style={s.summaryValue}>{heightDisplay}</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.label}>PREVIOUS INJURIES</Text>
            {injuries.length > 0 ? (
              <View style={s.chipRow}>
                {injuries.map((tag) => (
                  <View key={tag} style={[s.chip, s.chipActive]}>
                    <Text style={[s.chipText, s.chipTextActive]}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={s.summaryEmpty}>None reported</Text>
            )}
            {notes ? <Text style={s.summaryNotes}>{notes}</Text> : null}
          </View>

          <TouchableOpacity style={s.saveBtn} activeOpacity={0.85} onPress={() => setMode('edit')}>
            <Text style={s.saveBtnText}>EDIT PROFILE</Text>
            <MaterialIcons name="edit" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <IronHeader showBack onBackPress={() => navigation.goBack()} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={s.pageHeader}>
          <View style={s.spread}>
            <ScrollFloat textStyle={s.pageTitle} duration={1400} distance={22} stagger={0.045}>
              PROFILE
            </ScrollFloat>
            {hasProfile && (
              <TouchableOpacity style={s.editIconBtn} onPress={() => setMode('view')} activeOpacity={0.8}>
                <MaterialIcons name="close" size={16 * scale} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={s.pageSub}>SET UP YOUR TRAINING PROFILE</Text>
        </View>

        <View style={s.section}>
          <Text style={s.label}>GENDER</Text>
          <View style={s.row}>
            <TouchableOpacity
              style={[s.genderCard, gender === 'MALE' && s.genderCardActive]}
              onPress={() => setGender('MALE')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="man" size={24 * scale} color={gender === 'MALE' ? colors.onPrimary : colors.onSurface} />
              <Text style={[s.genderLabel, gender === 'MALE' && s.genderLabelActive]}>MALE</Text>
              {gender === 'MALE' && <MaterialIcons name="check" size={14} color={colors.onPrimary} style={s.checkBadge} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.genderCard, gender === 'FEMALE' && s.genderCardActive]}
              onPress={() => setGender('FEMALE')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="woman" size={24 * scale} color={gender === 'FEMALE' ? colors.onPrimary : colors.onSurface} />
              <Text style={[s.genderLabel, gender === 'FEMALE' && s.genderLabelActive]}>FEMALE</Text>
              {gender === 'FEMALE' && <MaterialIcons name="check" size={14} color={colors.onPrimary} style={s.checkBadge} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.spread}>
            <Text style={s.label}>AGE</Text>
            <Text style={s.bigNum} numberOfLines={1} adjustsFontSizeToFit>{age}</Text>
          </View>
          <View style={s.stepperRow}>
            <TouchableOpacity style={s.stepBtn} onPress={() => setAge((a) => Math.max(AGE_MIN, a - 1))}>
              <MaterialIcons name="remove" size={18} color={colors.onSurface} />
            </TouchableOpacity>
            <View
              style={s.track}
              onLayout={(e) => {
                trackWidthRef.current = e.nativeEvent.layout.width;
              }}
              {...agePanResponder.panHandlers}
            >
              <View style={s.trackFill}>
                <View style={[s.trackFillActive, { width: `${((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100}%` }]} />
              </View>
            </View>
            <TouchableOpacity style={s.stepBtn} onPress={() => setAge((a) => Math.min(AGE_MAX, a + 1))}>
              <MaterialIcons name="add" size={18} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.gridTwo}>
          <View style={[s.card, s.gridCard]}>
            <Text style={s.label}>WEIGHT UNIT</Text>
            <View style={s.toggleRow}>
              <TouchableOpacity
                style={[s.toggleBtn, weightUnit === 'LBS' && s.toggleBtnActive]}
                onPress={() => handleWeightUnitChange('LBS')}
              >
                <Text style={[s.toggleText, weightUnit === 'LBS' && s.toggleTextActive]}>LBS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.toggleBtn, weightUnit === 'KG' && s.toggleBtnActive]}
                onPress={() => handleWeightUnitChange('KG')}
              >
                <Text style={[s.toggleText, weightUnit === 'KG' && s.toggleTextActive]}>KG</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[s.card, s.gridCard]}>
            <Text style={s.label}>WEIGHT ({weightUnit})</Text>
            <View style={s.weightRow}>
              <TouchableOpacity
                style={s.circleBtn}
                onPress={() => setWeight((w) => String(Math.max(0, (parseFloat(w) || 0) - 1)))}
              >
                <MaterialIcons name="remove" size={16} color={colors.onSurface} />
              </TouchableOpacity>
              <TextInput
                ref={weightInputRef}
                style={s.midNum}
                value={weight}
                onChangeText={setWeight}
                onFocus={() => scrollToInput(weightInputRef)}
                keyboardType="numeric"
                keyboardAppearance="dark"
                placeholder="0"
                placeholderTextColor={colors.onSurfaceVariant}
              />
              <TouchableOpacity
                style={s.circleBtn}
                onPress={() => setWeight((w) => String((parseFloat(w) || 0) + 1))}
              >
                <MaterialIcons name="add" size={16} color={colors.onSurface} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.spreadCenter}>
            <Text style={s.label}>HEIGHT</Text>
            <View style={s.toggleRow}>
              <TouchableOpacity
                style={[s.toggleBtnSm, heightUnit === 'CM' && s.toggleBtnActive]}
                onPress={() => handleHeightUnitChange('CM')}
              >
                <Text style={[s.toggleTextSm, heightUnit === 'CM' && s.toggleTextActive]}>CM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.toggleBtnSm, heightUnit === 'FT-IN' && s.toggleBtnActive]}
                onPress={() => handleHeightUnitChange('FT-IN')}
              >
                <Text style={[s.toggleTextSm, heightUnit === 'FT-IN' && s.toggleTextActive]}>FT-IN</Text>
              </TouchableOpacity>
            </View>
          </View>
          {heightUnit === 'CM' ? (
            <View style={s.heightRow}>
              <View style={s.heightField}>
                <TextInput
                  ref={cmInputRef}
                  style={s.heightInput}
                  value={cm}
                  onChangeText={setCm}
                  onFocus={() => scrollToInput(cmInputRef)}
                  keyboardType="number-pad"
                  keyboardAppearance="dark"
                  placeholder="0"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
                <RulerScale />
                <Text style={s.heightUnitLabel}>CM</Text>
              </View>
            </View>
          ) : (
            <View style={s.heightRow}>
              <View style={s.heightField}>
                <TextInput
                  ref={feetInputRef}
                  style={s.heightInput}
                  value={feet}
                  onChangeText={setFeet}
                  onFocus={() => scrollToInput(feetInputRef)}
                  keyboardType="number-pad"
                  keyboardAppearance="dark"
                  placeholder="0"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
                <RulerScale />
                <Text style={s.heightUnitLabel}>FT</Text>
              </View>
              <View style={s.heightField}>
                <TextInput
                  ref={inchesInputRef}
                  style={s.heightInput}
                  value={inches}
                  onChangeText={setInches}
                  onFocus={() => scrollToInput(inchesInputRef)}
                  keyboardType="number-pad"
                  keyboardAppearance="dark"
                  placeholder="0"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
                <RulerScale />
                <Text style={s.heightUnitLabel}>IN</Text>
              </View>
            </View>
          )}
        </View>

        <View style={s.section}>
          <Text style={s.label}>PREVIOUS INJURIES</Text>
          <View style={s.chipRow}>
            {INJURY_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[s.chip, injuries.includes(tag) && s.chipActive]}
                onPress={() => toggleInjury(tag)}
              >
                <Text style={[s.chipText, injuries.includes(tag) && s.chipTextActive]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            ref={notesInputRef}
            style={s.textarea}
            value={notes}
            onChangeText={setNotes}
            onFocus={() => scrollToInput(notesInputRef)}
            keyboardAppearance="dark"
            placeholder="Describe any specific limitations..."
            placeholderTextColor={colors.onSurfaceVariant}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={s.saveBtn} activeOpacity={0.85} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <>
              <Text style={s.saveBtnText}>{saved ? 'SAVED' : 'SAVE PROFILE'}</Text>
              <MaterialIcons name={saved ? 'check' : 'arrow-forward'} size={18} color={colors.onPrimary} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const makeStyles = (scale: number) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface },
    flex: { flex: 1 },
    loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    content: { padding: spacing.marginMobile, paddingBottom: spacing.stackLg, gap: spacing.stackMd },
    pageHeader: {
      gap: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
      paddingBottom: spacing.stackSm,
    },
    editIconBtn: {
      width: 34,
      height: 34,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      backgroundColor: colors.surfaceContainerHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryValue: { ...typography.headlineLg, fontSize: 24 * scale, lineHeight: 30 * scale, color: colors.onSurface, textTransform: 'uppercase' },
    summaryEmpty: { ...typography.bodyMd, fontSize: 13, color: colors.onSurfaceVariant, fontStyle: 'italic' },
    summaryNotes: { ...typography.bodyMd, fontSize: 13, lineHeight: 19, color: colors.onSurfaceVariant, marginTop: 4 },
    pageTitle: { ...typography.displayXl, fontSize: 34 * scale, lineHeight: 42 * scale, color: colors.primary, textTransform: 'uppercase' },
    pageSub: { ...typography.labelCaps, fontSize: 11, color: colors.onSurfaceVariant },
    section: { gap: spacing.stackSm },
    label: { ...typography.labelCaps, fontSize: 11, color: colors.primary },
    row: { flexDirection: 'row', gap: spacing.stackSm },
    genderCard: {
      flex: 1,
      height: 72 * scale,
      backgroundColor: colors.surfaceContainerHigh,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    genderCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    genderLabel: { ...typography.labelCaps, fontSize: 11, color: colors.onSurface },
    genderLabelActive: { color: colors.onPrimary },
    checkBadge: { position: 'absolute', top: 8, right: 8 },
    card: {
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.md,
      padding: spacing.stackSm + 4,
      gap: spacing.stackSm,
    },
    spread: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    spreadCenter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bigNum: {
      ...typography.displayXl,
      fontSize: 30 * scale,
      lineHeight: 36 * scale,
      color: colors.onSurface,
      includeFontPadding: false,
    },
    midNum: {
      ...typography.displayXl,
      fontSize: 24 * scale,
      lineHeight: 30 * scale,
      color: colors.onSurface,
      includeFontPadding: false,
      minWidth: 44,
      textAlign: 'center',
    },
    stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
    stepBtn: {
      width: 34,
      height: 34,
      backgroundColor: colors.surfaceContainerHigh,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    track: {
      flex: 1,
      height: 22,
      justifyContent: 'center',
      paddingVertical: 8,
    },
    trackFill: { height: 6, backgroundColor: colors.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' },
    trackFillActive: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
    gridTwo: { flexDirection: 'row', gap: spacing.stackSm },
    gridCard: { flex: 1, justifyContent: 'space-between' },
    toggleRow: { flexDirection: 'row', borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm, overflow: 'hidden' },
    toggleBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', backgroundColor: colors.surfaceContainerHigh },
    toggleBtnSm: { paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center', backgroundColor: colors.surfaceContainerHigh },
    toggleBtnActive: { backgroundColor: colors.primary },
    toggleText: { ...typography.labelCaps, fontSize: 11, color: colors.onSurfaceVariant },
    toggleTextSm: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
    toggleTextActive: { color: colors.onPrimary },
    weightRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    circleBtn: {
      width: 34,
      height: 34,
      backgroundColor: colors.surfaceContainerHigh,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heightRow: { flexDirection: 'row', gap: spacing.stackSm },
    heightField: { flex: 1, alignItems: 'center' },
    heightInput: {
      width: '100%',
      ...typography.headlineLg,
      fontSize: 24 * scale,
      lineHeight: 30 * scale,
      color: colors.onSurface,
      textAlign: 'center',
      paddingVertical: 6,
      includeFontPadding: false,
    },
    heightUnitLabel: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant, marginTop: 6 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
    chipTextActive: { color: colors.onPrimary },
    textarea: {
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.sm,
      padding: spacing.stackSm + 4,
      ...typography.bodyMd,
      fontSize: 13,
      lineHeight: 19,
      color: colors.onSurface,
      height: 88,
      textAlignVertical: 'top',
    },
    saveBtn: {
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    saveBtnText: { ...typography.headlineMd, fontSize: 15, color: colors.onPrimary, textTransform: 'uppercase' },
  });
