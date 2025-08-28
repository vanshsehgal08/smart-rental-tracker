# Smart Rental Tracker - Frontend

A modern, responsive frontend application for managing construction and mining equipment rentals, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🏠 Dashboard
- Real-time overview of equipment status and rental operations
- Key performance indicators and metrics
- Interactive charts and visualizations
- Quick access to common actions

### 🚜 Equipment Management
- Complete CRUD operations for equipment
- Equipment status tracking (Available, Rented, Maintenance, Out of Service)
- Maintenance scheduling and history
- Site assignment and location tracking

### 📋 Rental Management
- Create and manage equipment rentals
- Track rental status and timelines
- Check-in/check-out functionality
- Overdue rental monitoring
- Cost calculation and billing

### 👥 Operator Management
- Operator registration and profiles
- License and certification tracking
- Contact information management
- Performance history

### 🏗️ Site Management
- Construction and mining site registration
- Location and contact information
- Site-specific equipment assignments

### 📊 Usage Logs
- Track equipment usage hours
- Fuel consumption monitoring
- Maintenance activity logging
- Performance analytics

### 🚨 Alert System
- Automated anomaly detection
- Equipment idle alerts
- Overdue rental notifications
- Maintenance reminders
- Severity-based alert categorization

### 🔍 Analytics & Forecasting
- Predictive analytics for rental demand
- Seasonal pattern analysis
- Revenue forecasting
- Equipment utilization optimization
- AI-powered recommendations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with Tailwind
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React hooks
- **Form Handling**: Custom form components with validation

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── equipment/         # Equipment management
│   ├── rentals/           # Rental management
│   ├── operators/         # Operator management
│   ├── sites/             # Site management
│   ├── usagelog/          # Usage logs
│   ├── alerts/            # Alert management
│   ├── anomaly/           # Anomaly detection
│   ├── forecast/          # Forecasting & analytics
│   └── checkin/           # Check-in/check-out
├── components/            # Reusable UI components
│   ├── Navigation.tsx     # Main navigation
│   ├── StatCard.tsx       # Dashboard stat cards
│   ├── EquipmentForm.tsx  # Equipment forms
│   ├── RentalForm.tsx     # Rental forms
│   ├── OperatorForm.tsx   # Operator forms
│   ├── SiteForm.tsx       # Site forms
│   ├── AlertModal.tsx     # Alert details modal
│   └── ...                # Other components
├── services/              # API services
│   └── api.ts            # API client and endpoints
├── lib/                   # Utility functions
│   └── utils.ts          # Common utilities
├── styles/                # Global styles
│   └── globals.css       # Tailwind and custom CSS
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-rental-tracker/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Integration

The frontend integrates with the backend API through the `services/api.ts` file, which provides:

- **Equipment API**: CRUD operations for equipment management
- **Rental API**: Rental creation, updates, and check-in/out
- **Operator API**: Operator management
- **Site API**: Site management
- **Alert API**: Alert creation and resolution
- **Dashboard API**: Summary data and analytics
- **Usage Log API**: Usage tracking and logging

## Component Library

### Button Components
- `.btn` - Base button styles
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-success` - Success/confirm buttons
- `.btn-danger` - Delete/danger buttons
- `.btn-sm`, `.btn-md`, `.btn-lg` - Size variants

### Form Components
- `.input` - Text input fields
- `.select` - Dropdown select fields
- `.card` - Card containers

### Utility Classes
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation
- `.animate-pulse-slow` - Slow pulse animation

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with side-by-side layouts
- **Tablet**: Adapted layouts with stacked components
- **Mobile**: Mobile-first design with touch-friendly interactions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Code Style

- Use TypeScript for all components
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

### Adding New Features

1. Create the page in `app/` directory
2. Add navigation item in `components/Navigation.tsx`
3. Create necessary components in `components/` directory
4. Add API endpoints in `services/api.ts`
5. Update types and interfaces as needed

### Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

### Phase 2 Features
- Real-time notifications
- Advanced reporting
- Mobile app
- Integration with external systems
- Advanced analytics dashboard

### Phase 3 Features
- AI-powered predictive maintenance
- Advanced forecasting models
- Multi-tenant support
- API rate limiting and caching
- Performance optimization
