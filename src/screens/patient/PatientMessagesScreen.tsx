import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {format} from 'date-fns';
import {supabase} from '../../lib/supabase';
import {useAuthStore} from '../../store/authStore';
import type {Message} from '../../types/database';

type MessageWithProfiles = Message & {
  sender: {full_name: string};
  recipient: {full_name: string};
};

export default function PatientMessagesScreen() {
  const [messages, setMessages] = useState<MessageWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [providerId, setProviderId] = useState('');
  const {profile} = useAuthStore();

  useEffect(() => {
    if (profile) {
      loadMessages();
    }
  }, [profile]);

  const loadMessages = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(full_name),
          recipient:profiles!recipient_id(full_name)
        `)
        .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order('created_at', {ascending: false});

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!profile || !subject || !content || !providerId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const {error} = await supabase.from('messages').insert({
        sender_id: profile.id,
        recipient_id: providerId,
        subject,
        content,
        is_read: false,
      });

      if (error) throw error;

      setModalVisible(false);
      setSubject('');
      setContent('');
      setProviderId('');
      loadMessages();
      Alert.alert('Success', 'Message sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase.from('messages').update({is_read: true}).eq('id', messageId);
      loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const renderMessage = ({item}: {item: MessageWithProfiles}) => {
    const isReceived = item.recipient_id === profile?.id;
    const messageDate = format(new Date(item.created_at), 'MMM d, yyyy h:mm a');

    return (
      <TouchableOpacity
        style={[styles.messageCard, !item.is_read && isReceived && styles.unreadMessage]}
        onPress={() => isReceived && !item.is_read && markAsRead(item.id)}>
        <View style={styles.messageHeader}>
          <View style={styles.messageInfo}>
            <Text style={styles.messageSender}>
              {isReceived ? item.sender.full_name : `To: ${item.recipient.full_name}`}
            </Text>
            <Text style={styles.messageDate}>{messageDate}</Text>
          </View>
          {!item.is_read && isReceived && (
            <View style={styles.unreadBadge}>
              <Icon name="mail-unread" size={20} color="#3B82F6" />
            </View>
          )}
        </View>

        <Text style={styles.messageSubject}>{item.subject}</Text>
        <Text style={styles.messageContent} numberOfLines={2}>
          {item.content}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyContainer}>
              <Icon name="mail-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No messages yet</Text>
            </View>
          )
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Message</Text>

          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subject"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your message"
            value={content}
            onChangeText={setContent}
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
              style={[styles.button, styles.sendButton]}
              onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContainer: {
    padding: 16,
  },
  messageCard: {
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
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageInfo: {
    flex: 1,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  messageDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  unreadBadge: {
    marginLeft: 8,
  },
  messageSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  messageContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
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
  sendButton: {
    backgroundColor: '#1E40AF',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonText: {
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
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
});
