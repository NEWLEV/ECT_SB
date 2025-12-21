import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {LineChart} from 'react-native-svg-charts';
import {format} from 'date-fns';
import {supabase} from '../../lib/supabase';
import type {Profile, JournalEntry, Appointment} from '../../types/database';

export default function PatientDetailsScreen({route, navigation}: any) {
  const {patientId} = route.params;
  const [patient, setPatient] = useState<Profile | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      setLoading(true);

      // Load patient profile
      const {data: patientData, error: patientError} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Load journal entries (last 14 days)
      const {data: journalData, error: journalError} = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', patientId)
        .order('date', {ascending: false})
        .limit(14);

      if (!journalError && journalData) {
        setJournalEntries(journalData);
      }

      // Load appointments
      const {data: appointmentsData, error: appointmentsError} = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', {ascending: false})
        .limit(10);

      if (!appointmentsError && appointmentsData) {
        setAppointments(appointmentsData);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverages = () => {
    if (journalEntries.length === 0) return null;

    const recent7Days = journalEntries.slice(0, 7);
    const avgMood =
      recent7Days.reduce((sum, entry) => sum + entry.mood, 0) / recent7Days.length;
    const avgEnergy =
      recent7Days.reduce((sum, entry) => sum + entry.energy, 0) / recent7Days.length;
    const avgSleep =
      recent7Days.reduce((sum, entry) => sum + entry.sleep_quality, 0) / recent7Days.length;
    const avgAnxiety =
      recent7Days.reduce((sum, entry) => sum + entry.anxiety, 0) / recent7Days.length;
    const avgStress =
      recent7Days.reduce((sum, entry) => sum + entry.stress, 0) / recent7Days.length;

    return {avgMood, avgEnergy, avgSleep, avgAnxiety, avgStress};
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  const averages = calculateAverages();
  const moodData = journalEntries.slice(0, 14).reverse().map(e => e.mood);
  const anxietyData = journalEntries.slice(0, 14).reverse().map(e => e.anxiety);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Patient Header */}
        <View style={styles.patientHeader}>
          <View style={styles.avatar}>
            <Icon name="person" size={48} color="#fff" />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.full_name}</Text>
            <Text style={styles.patientEmail}>{patient.email}</Text>
            {patient.phone && (
              <View style={styles.phoneContainer}>
                <Icon name="call" size={14} color="#6B7280" />
                <Text style={styles.patientPhone}>{patient.phone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 7-Day Averages */}
        {averages && (
          <>
            <Text style={styles.sectionTitle}>7-Day Mental Health Summary</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Icon name="happy" size={24} color="#3B82F6" />
                <Text style={styles.metricValue}>{averages.avgMood.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>Mood</Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="flash" size={24} color="#10B981" />
                <Text style={styles.metricValue}>{averages.avgEnergy.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>Energy</Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="moon" size={24} color="#8B5CF6" />
                <Text style={styles.metricValue}>{averages.avgSleep.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>Sleep</Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="alert-circle" size={24} color="#F59E0B" />
                <Text style={styles.metricValue}>{averages.avgAnxiety.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>Anxiety</Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="trending-up" size={24} color="#EF4444" />
                <Text style={styles.metricValue}>{averages.avgStress.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>Stress</Text>
              </View>
            </View>
          </>
        )}

        {/* 14-Day Trends */}
        {journalEntries.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>14-Day Mood Trend</Text>
            <View style={styles.chartCard}>
              <LineChart
                style={styles.chart}
                data={moodData}
                svg={{stroke: '#3B82F6', strokeWidth: 3}}
                contentInset={{top: 20, bottom: 20}}
              />
            </View>

            <Text style={styles.sectionTitle}>14-Day Anxiety Trend</Text>
            <View style={styles.chartCard}>
              <LineChart
                style={styles.chart}
                data={anxietyData}
                svg={{stroke: '#F59E0B', strokeWidth: 3}}
                contentInset={{top: 20, bottom: 20}}
              />
            </View>

            {/* Recent Journal Entries */}
            <Text style={styles.sectionTitle}>Recent Journal Entries</Text>
            {journalEntries.slice(0, 5).map(entry => (
              <View key={entry.id} style={styles.journalCard}>
                <Text style={styles.journalDate}>
                  {format(new Date(entry.date), 'MMM d, yyyy')}
                </Text>
                <View style={styles.journalMetrics}>
                  <View style={styles.journalMetric}>
                    <Text style={styles.journalMetricLabel}>Mood:</Text>
                    <Text style={[styles.journalMetricValue, {color: '#3B82F6'}]}>
                      {entry.mood}/10
                    </Text>
                  </View>
                  <View style={styles.journalMetric}>
                    <Text style={styles.journalMetricLabel}>Anxiety:</Text>
                    <Text style={[styles.journalMetricValue, {color: '#F59E0B'}]}>
                      {entry.anxiety}/10
                    </Text>
                  </View>
                  <View style={styles.journalMetric}>
                    <Text style={styles.journalMetricLabel}>Stress:</Text>
                    <Text style={[styles.journalMetricValue, {color: '#EF4444'}]}>
                      {entry.stress}/10
                    </Text>
                  </View>
                </View>
                {entry.notes && (
                  <Text style={styles.journalNotes}>{entry.notes}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Appointment History */}
        <Text style={styles.sectionTitle}>Appointment History</Text>
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => {
            const appointmentDate = new Date(
              `${appointment.appointment_date}T${appointment.appointment_time}`,
            );
            const formattedDate = format(appointmentDate, 'MMM d, yyyy');
            const formattedTime = format(appointmentDate, 'h:mm a');

            return (
              <View key={index} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentType}>
                    {appointment.type.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          appointment.status === 'completed'
                            ? '#10B981'
                            : appointment.status === 'scheduled'
                            ? '#3B82F6'
                            : '#6B7280',
                      },
                    ]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>
                <Text style={styles.appointmentDate}>
                  {formattedDate} at {formattedTime}
                </Text>
                {appointment.notes && (
                  <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No appointment history</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  patientHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  patientEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    height: 150,
  },
  journalCard: {
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
  journalDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  journalMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  journalMetric: {
    alignItems: 'center',
  },
  journalMetricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  journalMetricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  journalNotes: {
    fontSize: 14,
    color: '#374151',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
});
