import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {format} from 'date-fns';
import {supabase} from '../../lib/supabase';
import {useAuthStore} from '../../store/authStore';

export default function ProviderDashboardScreen({navigation}: any) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    unreadMessages: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const {profile, signOut} = useAuthStore();

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      // Get total patients count
      const {count: patientsCount} = await supabase
        .from('appointments')
        .select('patient_id', {count: 'exact', head: true})
        .eq('provider_id', profile.id);

      // Get upcoming appointments
      const now = new Date().toISOString();
      const {count: appointmentsCount} = await supabase
        .from('appointments')
        .select('*', {count: 'exact', head: true})
        .eq('provider_id', profile.id)
        .eq('status', 'scheduled')
        .gte('appointment_date', now);

      // Get unread messages
      const {count: messagesCount} = await supabase
        .from('messages')
        .select('*', {count: 'exact', head: true})
        .eq('recipient_id', profile.id)
        .eq('is_read', false);

      // Get recent appointments
      const {data: appointments} = await supabase
        .from('appointments')
        .select('*, patient_profile:profiles!patient_id(full_name)')
        .eq('provider_id', profile.id)
        .order('appointment_date', {ascending: true})
        .limit(5);

      setStats({
        totalPatients: patientsCount || 0,
        upcomingAppointments: appointmentsCount || 0,
        unreadMessages: messagesCount || 0,
      });

      setRecentActivity(appointments || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({title, value, icon, color, onPress}: any) => (
    <TouchableOpacity
      style={[styles.statCard, {borderLeftColor: color}]}
      onPress={onPress}>
      <Icon name={icon} size={32} color={color} />
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>Dr. {profile?.full_name}</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Icon name="log-out-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon="people"
            color="#3B82F6"
            onPress={() => navigation.navigate('Patients')}
          />
          <StatCard
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            icon="calendar"
            color="#10B981"
            onPress={() => navigation.navigate('Patients')}
          />
          <StatCard
            title="Unread Messages"
            value={stats.unreadMessages}
            icon="mail"
            color="#F59E0B"
            onPress={() => navigation.navigate('Messages')}
          />
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        {recentActivity.length > 0 ? (
          recentActivity.map((appointment, index) => {
            const appointmentDateTime = new Date(
              `${appointment.appointment_date}T${appointment.appointment_time}`,
            );
            const formattedDate = format(appointmentDateTime, 'MMM d, yyyy');
            const formattedTime = format(appointmentDateTime, 'h:mm a');

            return (
              <TouchableOpacity
                key={index}
                style={styles.activityCard}
                onPress={() =>
                  navigation.navigate('PatientDetails', {
                    patientId: appointment.patient_id,
                  })
                }>
                <View style={styles.activityIcon}>
                  <Icon name="calendar" size={24} color="#3B82F6" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>
                    {appointment.patient_profile.full_name}
                  </Text>
                  <Text style={styles.activitySubtitle}>
                    {appointment.type.replace(/_/g, ' ')}
                  </Text>
                  <Text style={styles.activityTime}>
                    {formattedDate} at {formattedTime}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No upcoming appointments</Text>
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Patients')}>
            <Icon name="people-outline" size={28} color="#1E40AF" />
            <Text style={styles.actionText}>View All Patients</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Messages')}>
            <Icon name="mail-outline" size={28} color="#1E40AF" />
            <Text style={styles.actionText}>Check Messages</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  statsGrid: {
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statInfo: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    textAlign: 'center',
  },
});
