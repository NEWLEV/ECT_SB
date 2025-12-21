import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuthStore} from '../../store/authStore';

export default function PatientHomeScreen({navigation}: any) {
  const {profile, signOut} = useAuthStore();

  const quickActions = [
    {
      title: 'Schedule Appointment',
      icon: 'calendar',
      color: '#3B82F6',
      onPress: () => navigation.navigate('Appointments'),
    },
    {
      title: 'Log Your Mood',
      icon: 'heart',
      color: '#EC4899',
      onPress: () => navigation.navigate('Tracker'),
    },
    {
      title: 'Self-Help Tools',
      icon: 'fitness',
      color: '#10B981',
      onPress: () => navigation.navigate('SelfHelpTools'),
    },
    {
      title: 'Emergency Support',
      icon: 'medical',
      color: '#EF4444',
      onPress: () => navigation.navigate('EmergencyProtocol'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Icon name="log-out-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* Mission Statement */}
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            Providing compassionate, accessible, and HIPAA-compliant mental health care through
            secure virtual appointments. Your wellbeing is our priority.
          </Text>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, {borderLeftColor: action.color}]}
              onPress={action.onPress}>
              <Icon name={action.icon} size={32} color={action.color} />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services Overview */}
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.servicesCard}>
          <View style={styles.serviceItem}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.serviceText}>Psychiatric Evaluations</Text>
          </View>
          <View style={styles.serviceItem}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.serviceText}>Medication Management</Text>
          </View>
          <View style={styles.serviceItem}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.serviceText}>Individual & Group Therapy</Text>
          </View>
          <View style={styles.serviceItem}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.serviceText}>Cognitive Assessments</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <View style={styles.contactItem}>
            <Icon name="call" size={18} color="#1E40AF" />
            <Text style={styles.contactText}>(843) 299-2033</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="mail" size={18} color="#1E40AF" />
            <Text style={styles.contactText}>info@eastcoasttelepsychiatry.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="time" size={18} color="#1E40AF" />
            <Text style={styles.contactText}>Mon-Thu 9am-5pm, Sun 11am-5pm</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  missionCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  missionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  servicesCard: {
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
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  contactCard: {
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
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
});
