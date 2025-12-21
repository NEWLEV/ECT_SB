import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {format} from 'date-fns';
import {LineChart} from 'react-native-svg-charts';
import {supabase} from '../../lib/supabase';
import {useAuthStore} from '../../store/authStore';
import type {JournalEntry} from '../../types/database';

export default function HealthTrackerScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState('');
  const {profile} = useAuthStore();

  useEffect(() => {
    if (profile) {
      loadEntries();
    }
  }, [profile]);

  const loadEntries = async () => {
    if (!profile) return;

    try {
      const {data, error} = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', profile.id)
        .order('date', {ascending: false})
        .limit(30);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSaveEntry = async () => {
    if (!profile) return;

    try {
      const {error} = await supabase.from('journal_entries').insert({
        user_id: profile.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        mood,
        energy,
        sleep_quality: sleepQuality,
        anxiety,
        stress,
        notes,
      });

      if (error) throw error;

      setModalVisible(false);
      resetForm();
      loadEntries();
      Alert.alert('Success', 'Entry saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const resetForm = () => {
    setMood(5);
    setEnergy(5);
    setSleepQuality(5);
    setAnxiety(5);
    setStress(5);
    setNotes('');
  };

  const SliderInput = ({
    label,
    value,
    onChange,
    color,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    color: string;
  }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={[styles.valueBadge, {backgroundColor: color}]}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton,
              value === num && {backgroundColor: color},
            ]}
            onPress={() => onChange(num)}>
            <Text
              style={[
                styles.numberButtonText,
                value === num && styles.numberButtonTextActive,
              ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const moodData = entries.slice(0, 7).reverse().map(e => e.mood);
  const energyData = entries.slice(0, 7).reverse().map(e => e.energy);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Mental Health Tracker</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}>
            <Icon name="add-circle" size={32} color="#1E40AF" />
          </TouchableOpacity>
        </View>

        {entries.length > 0 && (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>7-Day Mood Trend</Text>
              <LineChart
                style={styles.chart}
                data={moodData}
                svg={{stroke: '#3B82F6', strokeWidth: 3}}
                contentInset={{top: 20, bottom: 20}}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>7-Day Energy Trend</Text>
              <LineChart
                style={styles.chart}
                data={energyData}
                svg={{stroke: '#10B981', strokeWidth: 3}}
                contentInset={{top: 20, bottom: 20}}
              />
            </View>

            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {entries.slice(0, 5).map(entry => (
              <View key={entry.id} style={styles.entryCard}>
                <Text style={styles.entryDate}>
                  {format(new Date(entry.date), 'MMM d, yyyy')}
                </Text>
                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Mood</Text>
                    <Text style={[styles.metricValue, {color: '#3B82F6'}]}>
                      {entry.mood}/10
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Energy</Text>
                    <Text style={[styles.metricValue, {color: '#10B981'}]}>
                      {entry.energy}/10
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Sleep</Text>
                    <Text style={[styles.metricValue, {color: '#8B5CF6'}]}>
                      {entry.sleep_quality}/10
                    </Text>
                  </View>
                </View>
                {entry.notes && (
                  <Text style={styles.entryNotes}>{entry.notes}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {entries.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="heart-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No entries yet</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your mental health today
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Log Today's Mood</Text>

          <SliderInput label="Mood" value={mood} onChange={setMood} color="#3B82F6" />
          <SliderInput label="Energy" value={energy} onChange={setEnergy} color="#10B981" />
          <SliderInput
            label="Sleep Quality"
            value={sleepQuality}
            onChange={setSleepQuality}
            color="#8B5CF6"
          />
          <SliderInput label="Anxiety" value={anxiety} onChange={setAnxiety} color="#F59E0B" />
          <SliderInput label="Stress" value={stress} onChange={setStress} color="#EF4444" />

          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="How are you feeling today?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveEntry}>
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    padding: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    height: 150,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryNotes: {
    fontSize: 14,
    color: '#374151',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  valueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  numberButtonTextActive: {
    color: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#1E40AF',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
