import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {format} from 'date-fns';
import {supabase} from '../../lib/supabase';
import {useAuthStore} from '../../store/authStore';
import type {Appointment} from '../../types/database';

type AppointmentWithProvider = Appointment & {
  provider_profile: {full_name: string};
};

export default function PatientAppointmentsScreen() {
  const [appointments, setAppointments] = useState<AppointmentWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const {profile} = useAuthStore();

  useEffect(() => {
    if (profile) {
      loadAppointments();
    }
  }, [profile, filter]);

  const loadAppointments = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const now = new Date().toISOString();
      const query = supabase
        .from('appointments')
        .select('*, provider_profile:profiles!provider_id(full_name)')
        .eq('patient_id', profile.id)
        .order('appointment_date', {ascending: filter === 'upcoming'});

      if (filter === 'upcoming') {
        query.gte('appointment_date', now).in('status', ['scheduled']);
      } else {
        query.lt('appointment_date', now);
      }

      const {data, error} = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: '#3B82F6',
      completed: '#10B981',
      cancelled: '#EF4444',
      no_show: '#F59E0B',
    };
    return colors[status] || '#6B7280';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      initial_consultation: 'medical',
      follow_up: 'repeat',
      medication_management: 'medkit',
      therapy: 'chatbubbles',
    };
    return icons[type] || 'calendar';
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              const {error} = await supabase
                .from('appointments')
                .update({status: 'cancelled'})
                .eq('id', appointmentId);

              if (error) throw error;
              loadAppointments();
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ],
    );
  };

  const renderAppointment = ({item}: {item: AppointmentWithProvider}) => {
    const appointmentDateTime = new Date(`${item.appointment_date}T${item.appointment_time}`);
    const formattedDate = format(appointmentDateTime, 'MMM d, yyyy');
    const formattedTime = format(appointmentDateTime, 'h:mm a');

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Icon
            name={getTypeIcon(item.type)}
            size={24}
            color={getStatusColor(item.status)}
          />
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentType}>
              {item.type.replace(/_/g, ' ').toUpperCase()}
            </Text>
            <Text style={styles.providerName}>{item.provider_profile.full_name}</Text>
          </View>
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {formattedTime} ({item.duration_minutes} min)
            </Text>
          </View>
        </View>

        {item.status === 'scheduled' && (
          <View style={styles.actions}>
            {item.video_link && (
              <TouchableOpacity style={styles.joinButton}>
                <Icon name="videocam" size={18} color="#fff" />
                <Text style={styles.joinButtonText}>Join Video Call</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelAppointment(item.id)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => setFilter('upcoming')}>
          <Text
            style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
          onPress={() => setFilter('past')}>
          <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderAppointment}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                No {filter} appointments
              </Text>
            </View>
          }
        />
      )}
    </View>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#1E40AF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  appointmentType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
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
  appointmentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
});
