import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {supabase} from '../../lib/supabase';
import type {Provider, Profile} from '../../types/database';

type ProviderWithProfile = Provider & {
  profiles: Profile;
};

export default function ProviderDirectoryScreen() {
  const [providers, setProviders] = useState<ProviderWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const {data, error} = await supabase
        .from('providers')
        .select('*, profiles(*)')
        .eq('is_accepting_patients', true);

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      Psychiatry: '#3B82F6',
      Therapy: '#10B981',
      'Child & Adolescent': '#EC4899',
      'Medication Management': '#F59E0B',
    };
    return colors[specialty] || '#6B7280';
  };

  const renderProvider = ({item}: {item: ProviderWithProfile}) => (
    <View style={styles.providerCard}>
      <View style={styles.providerHeader}>
        <View style={styles.avatar}>
          <Icon name="person" size={32} color="#fff" />
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.profiles.full_name}</Text>
          <Text style={styles.credentials}>{item.credentials}</Text>
          <Text style={styles.experience}>{item.years_experience}+ years experience</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={3}>
        {item.bio}
      </Text>

      <View style={styles.specialtiesContainer}>
        {item.specialties.map((specialty, index) => (
          <View
            key={index}
            style={[styles.specialtyBadge, {backgroundColor: getSpecialtyColor(specialty)}]}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statesContainer}>
        <Icon name="location" size={16} color="#6B7280" />
        <Text style={styles.statesText}>
          Licensed in: {item.licensed_states.join(', ')}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Icon name="checkmark-circle" size={20} color="#10B981" />
        <Text style={styles.statusText}>Accepting New Patients</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Providers</Text>
        <Text style={styles.subtitle}>
          Experienced mental health professionals ready to help
        </Text>
      </View>

      <FlatList
        data={providers}
        keyExtractor={item => item.id}
        renderItem={renderProvider}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No providers available</Text>
          </View>
        }
      />
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
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  providerCard: {
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
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  credentials: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  experience: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specialtyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  statesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statesText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
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
