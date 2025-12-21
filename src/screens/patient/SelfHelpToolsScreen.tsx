import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SelfHelpToolsScreen() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingCount(prev => {
          if (prev === 1) {
            setBreathingPhase(current => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [breathingActive]);

  useEffect(() => {
    if (breathingActive) {
      if (breathingPhase === 'inhale') {
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true,
        }).start();
      } else if (breathingPhase === 'exhale') {
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [breathingPhase, breathingActive]);

  const affirmations = [
    'I am capable and strong',
    'This too shall pass',
    'I choose peace over worry',
    'I am worthy of love and respect',
    'I can handle whatever comes my way',
    'I am doing my best, and that is enough',
  ];

  const groundingSteps = [
    '5 things you can see',
    '4 things you can touch',
    '3 things you can hear',
    '2 things you can smell',
    '1 thing you can taste',
  ];

  const exercises = [
    {
      title: 'Progressive Muscle Relaxation',
      icon: 'body',
      color: '#8B5CF6',
      description: 'Tense and relax each muscle group',
      steps: [
        'Start with your toes and feet',
        'Move to calves and legs',
        'Tense and release your hands',
        'Work through arms and shoulders',
        'Relax your face and jaw',
        'Take deep breaths throughout',
      ],
    },
    {
      title: 'Mindful Observation',
      icon: 'eye',
      color: '#3B82F6',
      description: 'Focus your attention on a single object',
      steps: [
        'Choose an object near you',
        'Observe it with curiosity',
        'Notice colors, textures, shapes',
        'When mind wanders, gently refocus',
        'Continue for 2-3 minutes',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Breathing Exercise */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="fitness" size={24} color="#10B981" />
            <Text style={styles.cardTitle}>Box Breathing</Text>
          </View>
          <Text style={styles.cardDescription}>
            4-4-6 breathing pattern to reduce anxiety and stress
          </Text>

          {breathingActive && (
            <View style={styles.breathingContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {transform: [{scale: scaleAnim}]},
                ]}>
                <Text style={styles.breathingText}>
                  {breathingPhase.toUpperCase()}
                </Text>
                <Text style={styles.breathingCount}>{breathingCount}</Text>
              </Animated.View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, breathingActive && styles.activeButton]}
            onPress={() => setBreathingActive(!breathingActive)}>
            <Text style={styles.buttonText}>
              {breathingActive ? 'Stop Exercise' : 'Start Breathing'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grounding Technique */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="hand-left" size={24} color="#F59E0B" />
            <Text style={styles.cardTitle}>5-4-3-2-1 Grounding</Text>
          </View>
          <Text style={styles.cardDescription}>
            Use your senses to ground yourself in the present moment
          </Text>

          {groundingSteps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Affirmations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="heart" size={24} color="#EC4899" />
            <Text style={styles.cardTitle}>Daily Affirmations</Text>
          </View>
          <Text style={styles.cardDescription}>
            Positive statements to boost your mood and confidence
          </Text>

          {affirmations.map((affirmation, index) => (
            <View key={index} style={styles.affirmationItem}>
              <Icon name="checkmark-circle" size={20} color="#EC4899" />
              <Text style={styles.affirmationText}>{affirmation}</Text>
            </View>
          ))}
        </View>

        {/* Additional Exercises */}
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name={exercise.icon} size={24} color={exercise.color} />
              <Text style={styles.cardTitle}>{exercise.title}</Text>
            </View>
            <Text style={styles.cardDescription}>{exercise.description}</Text>

            {exercise.steps.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepItem}>
                <View style={[styles.stepBullet, {backgroundColor: exercise.color}]} />
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: 24,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  breathingCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  affirmationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  affirmationText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    marginLeft: 12,
    fontStyle: 'italic',
  },
});
