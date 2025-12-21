import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function EmergencyProtocolScreen() {
  const handleCall = (phoneNumber: string, name: string) => {
    Alert.alert(
      `Call ${name}?`,
      `This will dial ${phoneNumber}`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`),
        },
      ],
    );
  };

  const emergencyContacts = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 free and confidential support',
      color: '#DC2626',
      icon: 'call',
    },
    {
      name: 'Crisis Text Line',
      phone: '741741',
      description: 'Text HOME to connect with a crisis counselor',
      color: '#EA580C',
      icon: 'chatbubbles',
    },
    {
      name: 'Veterans Crisis Line',
      phone: '988',
      description: 'Press 1 after dialing, or text 838255',
      color: '#2563EB',
      icon: 'shield',
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description: 'Mental health and substance abuse support',
      color: '#7C3AED',
      icon: 'medkit',
    },
  ];

  const warningSignsData = [
    'Talking about wanting to die or harm oneself',
    'Looking for ways to end one\'s life',
    'Feeling hopeless or having no reason to live',
    'Feeling trapped or in unbearable pain',
    'Being a burden to others',
    'Increased substance use',
    'Acting anxious or agitated',
    'Withdrawing from family and friends',
    'Dramatic mood changes',
    'Giving away possessions',
  ];

  const copingStrategies = [
    {
      title: 'Reach Out',
      description: 'Call a friend, family member, or hotline',
      icon: 'people',
      color: '#10B981',
    },
    {
      title: 'Safety Plan',
      description: 'Create or review your personal safety plan',
      icon: 'shield-checkmark',
      color: '#3B82F6',
    },
    {
      title: 'Remove Means',
      description: 'Put distance between yourself and harmful methods',
      icon: 'lock-closed',
      color: '#F59E0B',
    },
    {
      title: 'Delay Action',
      description: 'Promise yourself to wait 24 hours before acting',
      icon: 'time',
      color: '#8B5CF6',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Icon name="warning" size={32} color="#fff" />
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>
              If you're in immediate danger
            </Text>
            <Text style={styles.emergencySubtitle}>
              Call 911 or go to your nearest emergency room
            </Text>
          </View>
        </View>

        {/* Crisis Hotlines */}
        <Text style={styles.sectionTitle}>24/7 Crisis Support</Text>
        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.contactCard, {borderLeftColor: contact.color}]}
            onPress={() => handleCall(contact.phone, contact.name)}>
            <View style={[styles.contactIcon, {backgroundColor: contact.color}]}>
              <Icon name={contact.icon} size={24} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
              <Text style={styles.contactDescription}>{contact.description}</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* Warning Signs */}
        <Text style={styles.sectionTitle}>Warning Signs to Watch For</Text>
        <View style={styles.card}>
          {warningSignsData.map((sign, index) => (
            <View key={index} style={styles.listItem}>
              <Icon name="alert-circle" size={20} color="#EF4444" />
              <Text style={styles.listText}>{sign}</Text>
            </View>
          ))}
        </View>

        {/* Coping Strategies */}
        <Text style={styles.sectionTitle}>Immediate Coping Strategies</Text>
        {copingStrategies.map((strategy, index) => (
          <View key={index} style={styles.strategyCard}>
            <View style={[styles.strategyIcon, {backgroundColor: strategy.color}]}>
              <Icon name={strategy.icon} size={24} color="#fff" />
            </View>
            <View style={styles.strategyInfo}>
              <Text style={styles.strategyTitle}>{strategy.title}</Text>
              <Text style={styles.strategyDescription}>{strategy.description}</Text>
            </View>
          </View>
        ))}

        {/* When to Seek Help */}
        <Text style={styles.sectionTitle}>When to Seek Emergency Help</Text>
        <View style={styles.card}>
          <View style={styles.helpItem}>
            <Icon name="medkit" size={20} color="#DC2626" />
            <Text style={styles.helpText}>
              Having thoughts of harming yourself or others
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Icon name="medkit" size={20} color="#DC2626" />
            <Text style={styles.helpText}>
              Unable to care for yourself
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Icon name="medkit" size={20} color="#DC2626" />
            <Text style={styles.helpText}>
              Experiencing severe anxiety or panic attacks
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Icon name="medkit" size={20} color="#DC2626" />
            <Text style={styles.helpText}>
              Having a mental health crisis
            </Text>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You are not alone. Help is available 24/7.
          </Text>
          <Text style={styles.footerSubtext}>
            These services are free, confidential, and available to everyone.
          </Text>
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
  content: {
    padding: 16,
  },
  emergencyBanner: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  emergencyTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  card: {
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    lineHeight: 20,
  },
  strategyCard: {
    flexDirection: 'row',
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
  strategyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  strategyInfo: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  strategyDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  footer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
