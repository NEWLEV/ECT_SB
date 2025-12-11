# East Coast Telepsychiatry

A comprehensive, HIPAA-compliant telehealth platform serving both patients and mental health providers with secure video appointments, mental health tracking, and therapeutic tools.

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

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design system
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Charts**: Recharts
- **Routing**: React Router v6
- **Date Handling**: date-fns

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
- Supabase credentials (pre-configured in `.env`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are pre-configured in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_SUPABASE_ANON_KEY`

3. Database is already set up with migrations applied automatically

### Development

The dev server is available for local testing.

### Build

```bash
npm run build
```

Builds the application to the `dist/` directory for production deployment.

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication pages
│   │   ├── AuthPage.tsx
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   └── shared/            # Reusable components
│       ├── Navigation.tsx
│       ├── Modal.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── aiInsights.ts      # AI prompt generation
│   └── seedData.ts        # Sample data
├── pages/
│   ├── patient/           # Patient-facing pages
│   │   ├── PatientHome.tsx
│   │   ├── ProviderDirectory.tsx
│   │   ├── PatientAppointments.tsx
│   │   ├── PatientMessages.tsx
│   │   ├── HealthTracker.tsx
│   │   ├── SelfHelpTools.tsx
│   │   └── EmergencyProtocol.tsx
│   └── provider/          # Provider-facing pages
│       ├── ProviderDashboard.tsx
│       ├── ProviderPatients.tsx
│       ├── PatientDetails.tsx
│       └── ProviderMessages.tsx
├── store/
│   └── authStore.ts       # Authentication state management
├── types/
│   └── database.ts        # Database type definitions
├── App.tsx                # Main routing
├── main.tsx               # Entry point
└── index.css              # Global styles
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

The application is ready for deployment to:
- Vercel
- Netlify
- AWS Amplify
- Self-hosted servers

Environment variables must be configured before deployment.

## Future Enhancements

- Video appointment scheduling with in-app video
- Prescription management system
- Treatment plan tracking
- Group therapy sessions
- Insurance integration and billing
- Mobile apps (iOS/Android)
- Multi-language support
- Telehealth sessions with in-app video capability
- Medication reminders and refill tracking
- Provider notes and clinical documentation
- Patient portal for sharing medical records
- Integration with EHR systems

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
