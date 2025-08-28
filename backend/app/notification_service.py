"""
Notification Service for Smart Rental Tracker
Handles automated email notifications for equipment return reminders
"""

import smtplib
import schedule
import time
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
from database import SessionLocal
from models import Rental, Equipment, Operator, Site
from typing import List, Dict, Any
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('notifications.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.email_from = os.getenv('EMAIL_FROM', 'Smart Rental Tracker')
        self.notification_days_ahead = int(os.getenv('NOTIFICATION_DAYS_AHEAD', '7'))
        
    def get_upcoming_returns(self) -> List[Dict[str, Any]]:
        """Get all rentals with return dates within notification window"""
        db = SessionLocal()
        try:
            # Calculate the target date (X days from now)
            target_date = datetime.now() + timedelta(days=self.notification_days_ahead)
            
            # Query for active rentals with return dates on target date
            from sqlalchemy import func
            upcoming_rentals = db.query(Rental).join(Equipment).join(Operator).join(Site).filter(
                Rental.status == 'active',
                func.date(Rental.expected_return_date) == target_date.date()
            ).all()
            
            rental_data = []
            for rental in upcoming_rentals:
                rental_data.append({
                    'rental_id': rental.id,
                    'equipment_name': f"{rental.equipment.type} {rental.equipment.model}" if rental.equipment.model else rental.equipment.type,
                    'equipment_type': rental.equipment.type,
                    'equipment_serial': rental.equipment.serial_number,
                    'operator_name': rental.operator.name,
                    'operator_email': rental.operator.email,
                    'operator_phone': rental.operator.phone,
                    'site_name': rental.site.name,
                    'site_contact_email': getattr(rental.site, 'contact_email', 'N/A'),
                    'site_contact_phone': rental.site.contact_phone,
                    'check_out_date': rental.check_out_date,
                    'expected_return_date': rental.expected_return_date,
                    'rental_rate': rental.rental_rate_per_day
                })
            
            return rental_data
            
        except Exception as e:
            logger.error(f"Error fetching upcoming returns: {e}")
            return []
        finally:
            db.close()
    
    def get_overdue_rentals(self) -> List[Dict[str, Any]]:
        """Get all overdue rentals"""
        db = SessionLocal()
        try:
            today = datetime.now().date()
            
            overdue_rentals = db.query(Rental).join(Equipment).join(Operator).join(Site).filter(
                Rental.status == 'active',
                Rental.expected_return_date < today
            ).all()
            
            rental_data = []
            for rental in overdue_rentals:
                # Handle both date and datetime objects
                if hasattr(rental.expected_return_date, 'date'):
                    return_date = rental.expected_return_date.date()
                else:
                    return_date = rental.expected_return_date
                days_overdue = (today - return_date).days
                rental_data.append({
                    'rental_id': rental.id,
                    'equipment_name': f"{rental.equipment.type} {rental.equipment.model}" if rental.equipment.model else rental.equipment.type,
                    'equipment_type': rental.equipment.type,
                    'equipment_serial': rental.equipment.serial_number,
                    'operator_name': rental.operator.name,
                    'operator_email': rental.operator.email,
                    'operator_phone': rental.operator.phone,
                    'site_name': rental.site.name,
                    'site_contact_email': getattr(rental.site, 'contact_email', 'N/A'),
                    'site_contact_phone': rental.site.contact_phone,
                    'check_out_date': rental.check_out_date,
                    'expected_return_date': rental.expected_return_date,
                    'days_overdue': days_overdue,
                    'rental_rate': rental.rental_rate_per_day
                })
            
            return rental_data
            
        except Exception as e:
            logger.error(f"Error fetching overdue rentals: {e}")
            return []
        finally:
            db.close()
    
    def create_return_reminder_email(self, rental_data: Dict[str, Any]) -> MIMEMultipart:
        """Create return reminder email"""
        msg = MIMEMultipart()
        msg['From'] = self.email_from
        msg['To'] = rental_data['operator_email']
        msg['Subject'] = f"Equipment Return Reminder - {rental_data['equipment_name']}"
        
        # Email body
        body = f"""
Dear {rental_data['operator_name']},

This is a friendly reminder that your rental equipment is due for return in {self.notification_days_ahead} days.

Equipment Details:
• Equipment: {rental_data['equipment_name']} ({rental_data['equipment_type']})
• Serial Number: {rental_data['equipment_serial']}
• Site: {rental_data['site_name']}
• Checkout Date: {rental_data['check_out_date'].strftime('%B %d, %Y')}
• Expected Return Date: {rental_data['expected_return_date'].strftime('%B %d, %Y')}
• Daily Rate: ${rental_data['rental_rate']:,.2f}

Please ensure the equipment is returned on time to avoid late fees. If you need to extend the rental period, please contact us immediately.

Site Contact Information:
• Email: {rental_data['site_contact_email']}
• Phone: {rental_data['site_contact_phone']}

Thank you for your business!

Best regards,
Smart Rental Tracker System
        """
        
        msg.attach(MIMEText(body, 'plain'))
        return msg
    
    def create_overdue_email(self, rental_data: Dict[str, Any]) -> MIMEMultipart:
        """Create overdue rental email"""
        msg = MIMEMultipart()
        msg['From'] = self.email_from
        msg['To'] = rental_data['operator_email']
        msg['Subject'] = f"OVERDUE: Equipment Return Required - {rental_data['equipment_name']}"
        
        # Calculate late fees (assuming 10% daily penalty)
        late_fee = rental_data['rental_rate'] * 0.1 * rental_data['days_overdue']
        
        body = f"""
Dear {rental_data['operator_name']},

URGENT: Your rental equipment is now {rental_data['days_overdue']} days overdue for return.

Equipment Details:
• Equipment: {rental_data['equipment_name']} ({rental_data['equipment_type']})
• Serial Number: {rental_data['equipment_serial']}
• Site: {rental_data['site_name']}
• Checkout Date: {rental_data['check_out_date'].strftime('%B %d, %Y')}
• Expected Return Date: {rental_data['expected_return_date'].strftime('%B %d, %Y')}
• Days Overdue: {rental_data['days_overdue']}
• Daily Rate: ${rental_data['rental_rate']:,.2f}
• Estimated Late Fees: ${late_fee:,.2f}

IMMEDIATE ACTION REQUIRED:
Please return the equipment as soon as possible to minimize additional charges.

Site Contact Information:
• Email: {rental_data['site_contact_email']}
• Phone: {rental_data['site_contact_phone']}

If you have already returned the equipment, please disregard this message and contact us to update our records.

Best regards,
Smart Rental Tracker System
        """
        
        msg.attach(MIMEText(body, 'plain'))
        return msg
    
    def send_email(self, msg: MIMEMultipart) -> bool:
        """Send email via SMTP"""
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            
            text = msg.as_string()
            server.sendmail(self.email_from, msg['To'], text)
            server.quit()
            
            logger.info(f"Email sent successfully to {msg['To']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {msg['To']}: {e}")
            return False
    
    def send_return_reminders(self):
        """Send return reminder emails for upcoming due dates"""
        logger.info("Starting return reminder notifications...")
        
        upcoming_rentals = self.get_upcoming_returns()
        
        if not upcoming_rentals:
            logger.info("No upcoming returns found")
            return
        
        logger.info(f"Found {len(upcoming_rentals)} upcoming returns")
        
        sent_count = 0
        for rental in upcoming_rentals:
            if rental['operator_email']:
                email = self.create_return_reminder_email(rental)
                if self.send_email(email):
                    sent_count += 1
            else:
                logger.warning(f"No email address for operator: {rental['operator_name']}")
        
        logger.info(f"Sent {sent_count} return reminder emails")
    
    def send_overdue_notifications(self):
        """Send overdue rental notifications"""
        logger.info("Starting overdue rental notifications...")
        
        overdue_rentals = self.get_overdue_rentals()
        
        if not overdue_rentals:
            logger.info("No overdue rentals found")
            return
        
        logger.info(f"Found {len(overdue_rentals)} overdue rentals")
        
        sent_count = 0
        for rental in overdue_rentals:
            if rental['operator_email']:
                email = self.create_overdue_email(rental)
                if self.send_email(email):
                    sent_count += 1
            else:
                logger.warning(f"No email address for operator: {rental['operator_name']}")
        
        logger.info(f"Sent {sent_count} overdue rental emails")
    
    def test_email_configuration(self) -> bool:
        """Test email configuration"""
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.quit()
            logger.info("Email configuration test successful")
            return True
        except Exception as e:
            logger.error(f"Email configuration test failed: {e}")
            return False

def run_scheduled_notifications():
    """Main function to run scheduled notifications"""
    notification_service = NotificationService()
    
    # Test email configuration first
    if not notification_service.test_email_configuration():
        logger.error("Email configuration invalid. Please check your .env file settings.")
        return
    
    # Send return reminders
    notification_service.send_return_reminders()
    
    # Send overdue notifications
    notification_service.send_overdue_notifications()

def start_notification_scheduler():
    """Start the notification scheduler"""
    logger.info("Starting notification scheduler...")
    
    # Schedule return reminders to run daily at 9 AM
    schedule.every().day.at("09:00").do(run_scheduled_notifications)
    
    # Also run overdue notifications daily at 2 PM
    schedule.every().day.at("14:00").do(lambda: NotificationService().send_overdue_notifications())
    
    logger.info("Notification scheduler started. Notifications will run daily at 9 AM and 2 PM")
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    # For testing purposes
    notification_service = NotificationService()
    
    print("Testing notification service...")
    print("1. Testing email configuration...")
    if notification_service.test_email_configuration():
        print("✓ Email configuration successful")
    else:
        print("✗ Email configuration failed")
    
    print("\n2. Checking upcoming returns...")
    upcoming = notification_service.get_upcoming_returns()
    print(f"Found {len(upcoming)} upcoming returns")
    
    print("\n3. Checking overdue rentals...")
    overdue = notification_service.get_overdue_rentals()
    print(f"Found {len(overdue)} overdue rentals")
    
    # Uncomment to test actual email sending (make sure .env is configured)
    # print("\n4. Sending test notifications...")
    # notification_service.send_return_reminders()
    # notification_service.send_overdue_notifications()
