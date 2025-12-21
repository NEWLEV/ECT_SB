# East Coast Telepsychiatry - Mobile App

A comprehensive, HIPAA-compliant React Native mobile application serving both patients and mental health providers with secure video appointments, mental health tracking, and therapeutic tools.

> **🚀 Native iOS & Android Mobile App** - Built with React Native for a seamless native mobile experience

## Overview

East Coast Telepsychiatry is a dual-interface application that provides remote psychiatric care through secure video appointments. The platform serves adults, teens, and children across multiple states, offering psychiatric evaluations, medication management, and therapy services.

## Features

### Patient Interface

**Home Dashboard**
- Welcome page with quick access to all features
- Mission statement and service overview
- Crisis support link prominently displayed

**Provider Directory**
- Browse all available providers
- Filter by specialty
- View provider bios, credentials, and licensed states
- See availability status

**Appointment Management**
- Schedule new appointments
- View upcoming and past appointments
- Cancel or reschedule sessions
- Tebra video platform integration for televisits

**Secure Messaging**
- HIPAA-compliant messaging with providers
- Real-time message notifications
- Message read status tracking

**Mental Health Tracker**
- Daily mood, energy, sleep, anxiety, and stress logging
- Interactive visualizations and 30-day trend charts
- AI-generated insights based on journal entries
- Private journaling with reflective prompts
- Track patterns over time

**Self-Help Tools**
- Guided breathing exercises (Box Breathing)
- Grounding techniques (5-4-3-2-1 method)
- Progressive muscle relaxation
- Daily positive affirmations
- Condition-specific journal prompts (Anxiety, Depression, ADHD)
- Resource library with articles and guides

**Emergency Protocol**
- 24/7 crisis hotlines
- National Suicide Prevention Lifeline
- Crisis Text Line
- Veterans Crisis Line
- Clear guidance on when to seek emergency help

### Provider Interface

**Dashboard**
- Overview of total patients
- Upcoming appointments
- Unread message count
- Quick access to recent activity

**Patient Management**
- View all assigned patients
- Search patients by name or email
- See upcoming and past appointments per patient

**Patient Details**
- 7-day mental health summary
- 14-day trend visualization
- Access to patient journal entries
- Appointment history
- AI-generated insights from patient data

**Secure Messaging**
- Communicate with patients securely
- Unread message indicators
- Real-time message synchronization

## Tech Stack

- **Framework**: React Native 0.73 + TypeScript
- **Navigation**: React Navigation v6 (Stack & Bottom Tabs)
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Charts**: react-native-svg-charts
- **UI Components**: React Native Vector Icons
- **Date Handling**: date-fns
- **Platform**: iOS & Android (cross-platform)

## Security & Compliance

- HIPAA-compliant architecture
- Row Level Security (RLS) on all database tables
- Encrypted data storage (will be fully encrypted in production)
- Secure authentication with session management
- Role-based access control (Patient/Provider)
- HTTPS-only communication
- All sensitive operations (messages, journals) require authentication

## Database Schema

**Tables:**
- `profiles` - User information for both patients and providers
- `providers` - Extended provider information (specialties, credentials, etc.)
- `appointments` - Appointment scheduling and management
- `messages` - Secure messaging between patients and providers
- `journal_entries` - Patient mental health tracking data
- `resources` - Self-help articles, guides, and educational content

All tables include Row Level Security policies to ensure users can only access their own data or data they're authorized to view.

## Design Philosophy

- **Mobile-first**: Optimized for mobile devices with responsive breakpoints
- **Accessible**: High contrast ratios, semantic HTML, keyboard navigation
- **Calming aesthetic**: Cool blue and teal color palette to promote relaxation
- **User-friendly**: Clear visual hierarchy, intuitive navigation
- **Minimal cognitive load**: Card-based layouts, icons, progressive disclosure

## AI Features

The application includes AI-powered insights that:
- Analyze mood patterns and provide personalized feedback
- Suggest self-care strategies based on mental health metrics
- Generate reflective journal prompts tailored to conditions (anxiety, depression, ADHD)
- Identify potential triggers and positive patterns
- Provide CBT-style guidance and affirmations

### Sample AI Prompts

**For Anxiety:**
- What triggered your anxiety today? Can you identify any patterns?
- Describe three things you can see, hear, and feel right now.
- What thoughts are contributing to your anxiety? Are they based on facts or assumptions?

**For Depression:**
- What is one small thing you accomplished today, no matter how minor?
- Describe a moment when you felt even slightly better today.
- Write about someone or something you're grateful for right now.

**For ADHD:**
- What tasks did you complete today? Celebrate them, no matter how small.
- What strategies helped you focus today? Which ones didn't work?
- What would make tomorrow more manageable?

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- **iOS Development**: macOS with Xcode 14+
- **Android Development**: Android Studio with SDK 31+
- React Native CLI: `npm install -g react-native-cli`
- CocoaPods (for iOS): `sudo gem install cocoapods`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ECT_SB
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (macOS only):
```bash
cd ios && pod install && cd ..
```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     - `SUPABASE_URL` - Your Supabase project URL
     - `SUPABASE_ANON_KEY` - Your Supabase anonymous key
     - `TEBRA_API_KEY` - Tebra video integration key
     - `TEBRA_CLIENT_ID` - Tebra client ID

### Development

**Run on iOS Simulator:**
```bash
npm run ios
```

**Run on Android Emulator:**
```bash
npm run android
```

**Start Metro Bundler:**
```bash
npm start
```

### Build for Production

**iOS:**
```bash
cd ios
xcodebuild -workspace EastCoastTelepsychiatry.xcworkspace -scheme EastCoastTelepsychiatry -configuration Release
```

**Android:**
```bash
cd android
./gradlew assembleRelease
```

The APK will be located at `android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
ECT_SB/
├── assets/
│   └── images/            # Logo and images
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── patient/       # Patient-specific components
│   │   ├── provider/      # Provider-specific components
│   │   └── shared/        # Reusable components
│   ├── screens/
│   │   ├── common/        # Auth screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── patient/       # Patient screens
│   │   │   ├── PatientHomeScreen.tsx
│   │   │   ├── ProviderDirectoryScreen.tsx
│   │   │   ├── PatientAppointmentsScreen.tsx
│   │   │   ├── PatientMessagesScreen.tsx
│   │   │   ├── HealthTrackerScreen.tsx
│   │   │   ├── SelfHelpToolsScreen.tsx
│   │   │   └── EmergencyProtocolScreen.tsx
│   │   └── provider/      # Provider screens
│   │       ├── ProviderDashboardScreen.tsx
│   │       ├── ProviderPatientsScreen.tsx
│   │       ├── PatientDetailsScreen.tsx
│   │       └── ProviderMessagesScreen.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Navigation configuration
│   ├── lib/
│   │   └── supabase.ts    # Supabase client
│   ├── store/
│   │   └── authStore.ts   # Zustand auth state
│   ├── types/
│   │   └── database.ts    # TypeScript types
│   └── App.tsx            # Root component
├── index.js               # Entry point
├── app.json               # App configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## User Flows

### Patient Registration & Usage
1. Sign up with email/password, select "Patient" role
2. Browse provider directory and learn about services
3. Schedule appointments with preferred providers
4. Use mental health tracker daily to log mood and feelings
5. Access self-help tools when needed
6. Message providers securely for non-urgent questions
7. Join video appointments via Tebra integration

### Provider Workflow
1. Sign up with email/password, select "Provider" role
2. View dashboard with patient overview
3. Review upcoming appointments
4. Access patient details to see mental health trends
5. Respond to patient messages
6. Review patient journal entries and AI insights
7. Join video appointments to provide care

## API Integration Points

### Tebra Integration
- Appointment scheduling with video link generation
- Video session management
- Meeting room creation and management

### Placeholder Implementations
- AI insights (currently uses rule-based system, ready for GPT integration)
- Message encryption (ready for production encryption libraries)
- Payment processing (ready for Stripe integration)

## Features Breakdown

### Mental Health Tracker
- **Mood Logging**: 1-10 scale with daily updates
- **Metrics Tracked**: Mood, Energy, Sleep Quality, Anxiety, Stress
- **Visualizations**: Line charts showing 30-day trends
- **Journaling**: Free-form text entry with optional tagging
- **AI Insights**: Generated based on mood patterns and journal content

### Self-Help Tools
**Box Breathing**
- 4-second inhale
- 4-second hold
- 6-second exhale
- Real-time visual feedback

**Grounding Techniques**
- 5-4-3-2-1 sensory method
- Progressive muscle relaxation guide
- Mindfulness exercises

**Resources**
- Curated articles on mental health topics
- Guided meditations
- Coping strategies
- Evidence-based interventions

## Security Considerations

### Authentication
- Email/password authentication via Supabase
- Session-based authentication
- Automatic token refresh
- Secure password storage (bcrypt)

### Data Protection
- All data encrypted in transit (HTTPS)
- Row Level Security on all database tables
- Users can only access their own data
- Providers can only access patient data for patients they're assigned to

### Sensitive Information
- Messages are encrypted (production implementation)
- Journal entries are private to the user
- Personal health information is protected
- Audit logs for provider access

## Deployment

### iOS App Store

1. Configure signing in Xcode with your Apple Developer account
2. Archive the app: Product → Archive
3. Upload to App Store Connect
4. Submit for review

### Google Play Store

1. Generate a signed APK or AAB:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
2. Upload to Google Play Console
3. Complete store listing and submit for review

### Environment Variables

Ensure all production environment variables are configured:
- Supabase production URL and keys
- Tebra API credentials
- Any additional third-party service keys

### Required Accounts

- **Apple Developer Account** ($99/year) - for iOS deployment
- **Google Play Developer Account** ($25 one-time) - for Android deployment
- **Supabase** - Backend and database
- **Tebra** - Video appointment integration

## Future Enhancements

- **In-app video calling** with WebRTC integration
- **Push notifications** for appointment reminders and messages
- **Biometric authentication** (Face ID/Touch ID & Fingerprint)
- **Offline mode** with local data caching
- **Prescription management** system
- **Treatment plan tracking** and progress monitoring
- **Group therapy sessions** support
- **Insurance integration** and billing
- **Multi-language support** (Spanish, Mandarin, etc.)
- **Medication reminders** and refill tracking
- **Provider notes** and clinical documentation
- **Health data integration** (Apple Health, Google Fit)
- **EHR system integration** (Epic, Cerner)
- **Wearable device support** for mood/activity tracking
- **AI-powered insights** using GPT for mental health analysis
- **Crisis intervention** features with location services

## Testing

The application includes sample data seeding for testing:
- Multiple test providers with different specialties
- Sample resources covering common mental health topics
- Pre-populated appointment types and scenarios

## Support & Contact

For technical issues or feature requests, please contact the development team.

## License

Proprietary - East Coast Telepsychiatry. All rights reserved.

## Compliance Notes

This application is designed with HIPAA compliance in mind. In production, the following security measures must be fully implemented:
- End-to-end encryption for messages
- Business Associate Agreement (BAA) with Supabase
- Complete audit logging
- Data retention policies
- Disaster recovery procedures
- Regular security audits
