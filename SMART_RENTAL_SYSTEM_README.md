# Smart Rental Tracking & Notification System

A comprehensive solution for equipment dealers to track rentals, manage returns, and automate notifications using real-time timers and intelligent alerts.

## 🚀 Features

### Core Functionality
- **Real-time Rental Timer**: Automatic timer starts when equipment is checked out
- **Automated Notifications**: Email reminders 7 days before return date
- **Overdue Detection**: Immediate alerts when equipment is overdue
- **Equipment Usage Logging**: Track engine hours, fuel usage, location, and condition
- **Demand Forecasting**: ML-powered predictions for equipment utilization
- **Anomaly Detection**: Identify unusual usage patterns automatically

### Smart Notifications
- **Return Reminders**: Sent 7 days before due date
- **Overdue Alerts**: Immediate notifications for late returns
- **Rental Confirmations**: Confirmation emails when rentals start
- **Extension Confirmations**: Notifications when rentals are extended
- **Usage Reports**: Automated equipment usage summaries
- **Maintenance Alerts**: Notifications for equipment requiring attention

### Real-time Tracking
- **Live Timer Display**: Countdown to return date with visual indicators
- **Status Monitoring**: Real-time updates on rental status
- **Overdue Warnings**: Color-coded alerts for different urgency levels
- **Extension Management**: Easy rental period extensions
- **Quick Actions**: Send reminders, check-in equipment, extend rentals

## 🏗️ System Architecture

### Backend (FastAPI)
```
backend/
├── app/
│   ├── models.py              # Database models
│   ├── crud.py               # Database operations
│   ├── routers/
│   │   ├── rentals.py        # Rental management endpoints
│   │   ├── equipment.py      # Equipment management
│   │   └── analytics.py      # Analytics and reporting
│   ├── notification_service.py # Email notification system
│   ├── scheduler.py          # Automated task scheduler
│   └── ml_integration.py     # ML model integration
```

### Frontend (Next.js + TypeScript)
```
frontend/
├── app/
│   ├── components/
│   │   ├── RentalDashboard.tsx  # Main rental management interface
│   │   ├── RentalTimer.tsx      # Real-time timer component
│   │   ├── EquipmentTable.tsx   # Equipment listing
│   │   └── AnomalyAlerts.tsx    # ML anomaly notifications
│   └── page.tsx                 # Main dashboard page
```

### ML System (Python)
```
ml/
├── smart_ml_system.py        # Core ML functionality
├── models/                   # Trained ML models
└── requirements.txt          # ML dependencies
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy configuration
cp config.env.example .env
# Edit .env with your email settings

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Start Notification Scheduler
```bash
cd backend
python app/scheduler.py
```

## 📧 Email Configuration

### Option 1: SMTP (Recommended)
```bash
# In your .env file
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@gmail.com
SENDER_NAME=Smart Rental Tracker
```

**For Gmail**: Use an App Password instead of your regular password

### Option 2: EmailJS
```bash
# In your .env file
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_USER_ID=your_user_id
```

## 🔄 How It Works

### 1. Equipment Check-out
```
Dealer checks out equipment → Timer starts automatically → 
Confirmation email sent to site contact
```

### 2. Real-time Monitoring
```
System tracks rental duration → Updates every minute → 
Shows countdown to return date
```

### 3. Automated Reminders
```
7 days before return → Email reminder sent → 
Alert logged in system
```

### 4. Overdue Detection
```
Return date passes → Status changes to "overdue" → 
Urgent notification sent → Daily alerts continue
```

### 5. Equipment Return
```
Equipment checked in → Timer stops → 
Return confirmation sent → Equipment status updated
```

## 📊 API Endpoints

### Rental Management
- `POST /rentals/` - Create new rental
- `GET /rentals/active` - Get active rentals
- `GET /rentals/overdue` - Get overdue rentals
- `GET /rentals/due-soon` - Get rentals due soon
- `GET /rentals/{id}/timer` - Get real-time timer data
- `POST /rentals/{id}/extend` - Extend rental period
- `POST /rentals/{id}/checkin` - Check in equipment
- `POST /rentals/{id}/send-reminder` - Send manual reminder

### Notifications
- `POST /rentals/send-all-reminders` - Send reminders for all due rentals
- `POST /rentals/send-overdue-alerts` - Send overdue notifications

### Analytics
- `GET /rentals/analytics/summary` - Get rental analytics
- `GET /rentals/analytics/equipment/{id}` - Get equipment history
- `GET /rentals/analytics/site/{id}` - Get site analytics

## 🎯 Key Benefits

### For Equipment Dealers
- **Prevent Lost Equipment**: Automated tracking and reminders
- **Reduce Delays**: Real-time visibility into rental status
- **Improve Customer Service**: Professional, automated communications
- **Optimize Utilization**: ML-powered demand forecasting
- **Increase Revenue**: Better equipment management and billing

### For Contractors
- **Clear Communication**: Automated reminders and confirmations
- **Flexible Extensions**: Easy rental period adjustments
- **Professional Service**: Consistent, timely notifications
- **Cost Control**: Clear visibility into rental duration and costs

## 🔧 Customization

### Notification Timing
```python
# In notification_service.py
self.reminder_days_before = 7  # Send reminder 7 days before return
self.overdue_alert_hours = 24  # Send overdue alert after 24 hours
```

### Email Templates
Customize email content in `notification_service.py`:
- Return reminders
- Overdue alerts
- Rental confirmations
- Extension confirmations

### ML Models
Enhance the ML system in `ml/smart_ml_system.py`:
- Demand forecasting
- Anomaly detection
- Equipment utilization optimization

## 📈 Monitoring & Analytics

### Dashboard Metrics
- Active rentals count
- Overdue equipment alerts
- Monthly revenue tracking
- Equipment utilization rates
- Rental duration analytics

### ML Insights
- Demand predictions by equipment type
- Site-specific usage patterns
- Seasonal demand fluctuations
- Equipment performance anomalies

## 🚨 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP credentials in `.env`
   - Verify EmailJS configuration
   - Check firewall/network settings

2. **Timer not updating**
   - Verify backend is running
   - Check database connection
   - Review rental status in database

3. **Notifications not scheduled**
   - Ensure scheduler is running
   - Check system time settings
   - Verify notification service configuration

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=DEBUG

# Test email configuration
python app/scheduler.py --config-test

# Test notifications immediately
python app/scheduler.py --test
```

## 🔒 Security Features

- Environment variable configuration
- Database connection security
- API endpoint authentication
- Secure email transmission
- Audit logging for all actions

## 📱 Mobile Responsiveness

The frontend is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Future Enhancements

- **Mobile App**: Native iOS/Android applications
- **GPS Tracking**: Real-time equipment location
- **IoT Integration**: Equipment sensors and telemetry
- **Advanced Analytics**: Predictive maintenance insights
- **Multi-language Support**: International deployment
- **API Integrations**: Third-party system connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Smart Rental Tracker** - Making equipment rental management intelligent and automated! 🚀
