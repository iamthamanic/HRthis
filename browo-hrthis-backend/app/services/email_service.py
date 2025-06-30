"""
Email Service (Browo AI Integration vorbereitet)
Email templates und Service Interface für spätere Browo AI Anbindung
"""

from typing import Dict, List, Optional
from datetime import datetime
import json
from pathlib import Path

# Email Templates für verschiedene HR-Szenarien
EMAIL_TEMPLATES = {
    "onboarding_driver": {
        "id": "onboarding_driver",
        "name": "onboarding_driver",
        "display_name": "Onboarding - Fahrer",
        "subject": "Willkommen bei {{company_name}} - Ihr Onboarding als Fahrer",
        "template_html": """
        <h1>Willkommen bei {{company_name}}, {{employee_name}}!</h1>
        
        <p>Wir freuen uns sehr, Sie als neuen Fahrer in unserem Team begrüßen zu dürfen.</p>
        
        <h2>Ihre nächsten Schritte:</h2>
        <ul>
            <li>✅ Führerschein-Kopie an HR senden</li>
            <li>✅ Fahrzeug-Einweisung am {{start_date}}</li>
            <li>✅ Sicherheitsunterweisung absolvieren</li>
            <li>✅ Arbeitskleidung abholen (Größen: {{clothing_sizes}})</li>
        </ul>
        
        <h2>Wichtige Informationen:</h2>
        <p><strong>Erster Arbeitstag:</strong> {{start_date}}<br>
        <strong>Arbeitszeit:</strong> {{work_hours}}<br>
        <strong>Ansprechpartner:</strong> {{contact_person}} ({{contact_email}})</p>
        
        <p>Bei Fragen können Sie sich jederzeit an uns wenden.</p>
        
        <p>Herzliche Grüße<br>
        Ihr HR-Team von {{company_name}}</p>
        """,
        "template_text": """
        Willkommen bei {{company_name}}, {{employee_name}}!
        
        Wir freuen uns sehr, Sie als neuen Fahrer in unserem Team begrüßen zu dürfen.
        
        Ihre nächsten Schritte:
        - Führerschein-Kopie an HR senden
        - Fahrzeug-Einweisung am {{start_date}}
        - Sicherheitsunterweisung absolvieren
        - Arbeitskleidung abholen (Größen: {{clothing_sizes}})
        
        Wichtige Informationen:
        Erster Arbeitstag: {{start_date}}
        Arbeitszeit: {{work_hours}}
        Ansprechpartner: {{contact_person}} ({{contact_email}})
        
        Bei Fragen können Sie sich jederzeit an uns wenden.
        
        Herzliche Grüße
        Ihr HR-Team von {{company_name}}
        """,
        "variables": [
            "company_name", "employee_name", "start_date", "work_hours",
            "contact_person", "contact_email", "clothing_sizes"
        ],
        "category": "onboarding"
    },
    
    "onboarding_accounting": {
        "id": "onboarding_accounting",
        "name": "onboarding_accounting", 
        "display_name": "Onboarding - Sachbearbeiter",
        "subject": "Willkommen bei {{company_name}} - Ihr Onboarding im Büro",
        "template_html": """
        <h1>Willkommen bei {{company_name}}, {{employee_name}}!</h1>
        
        <p>Wir freuen uns sehr, Sie in unserem Büro-Team begrüßen zu dürfen.</p>
        
        <h2>Ihre nächsten Schritte:</h2>
        <ul>
            <li>✅ IT-Equipment Ausgabe am ersten Arbeitstag</li>
            <li>✅ System-Zugang einrichten</li>
            <li>✅ Büro-Rundgang und Team-Vorstellung</li>
            <li>✅ Einarbeitung mit {{mentor_name}}</li>
        </ul>
        
        <h2>Wichtige Informationen:</h2>
        <p><strong>Erster Arbeitstag:</strong> {{start_date}}<br>
        <strong>Arbeitszeit:</strong> {{work_hours}}<br>
        <strong>Büro-Adresse:</strong> {{office_address}}<br>
        <strong>Ihr Mentor:</strong> {{mentor_name}} ({{mentor_email}})</p>
        
        <p>Bitte bringen Sie am ersten Tag folgende Dokumente mit:</p>
        <ul>
            <li>Personalausweis oder Reisepass</li>
            <li>Steuerliche Identifikationsnummer</li>
            <li>Bankverbindung</li>
        </ul>
        
        <p>Herzliche Grüße<br>
        Ihr HR-Team von {{company_name}}</p>
        """,
        "template_text": """
        Willkommen bei {{company_name}}, {{employee_name}}!
        
        Wir freuen uns sehr, Sie in unserem Büro-Team begrüßen zu dürfen.
        
        Ihre nächsten Schritte:
        - IT-Equipment Ausgabe am ersten Arbeitstag
        - System-Zugang einrichten
        - Büro-Rundgang und Team-Vorstellung
        - Einarbeitung mit {{mentor_name}}
        
        Wichtige Informationen:
        Erster Arbeitstag: {{start_date}}
        Arbeitszeit: {{work_hours}}
        Büro-Adresse: {{office_address}}
        Ihr Mentor: {{mentor_name}} ({{mentor_email}})
        
        Bitte bringen Sie am ersten Tag folgende Dokumente mit:
        - Personalausweis oder Reisepass
        - Steuerliche Identifikationsnummer
        - Bankverbindung
        
        Herzliche Grüße
        Ihr HR-Team von {{company_name}}
        """,
        "variables": [
            "company_name", "employee_name", "start_date", "work_hours",
            "office_address", "mentor_name", "mentor_email"
        ],
        "category": "onboarding"
    },
    
    "onboarding_manager": {
        "id": "onboarding_manager",
        "name": "onboarding_manager",
        "display_name": "Onboarding - Manager",
        "subject": "Willkommen bei {{company_name}} - Ihr Onboarding als Führungskraft",
        "template_html": """
        <h1>Willkommen bei {{company_name}}, {{employee_name}}!</h1>
        
        <p>Wir freuen uns außerordentlich, Sie als neue Führungskraft in unserem Unternehmen zu begrüßen.</p>
        
        <h2>Ihre ersten Schritte als {{position}}:</h2>
        <ul>
            <li>✅ Strategisches Briefing mit der Geschäftsleitung</li>
            <li>✅ Team-Vorstellung und Kennenlernen</li>
            <li>✅ Übergabe der Abteilungsverantwortung</li>
            <li>✅ Management-Tools und Systeme einrichten</li>
        </ul>
        
        <h2>Wichtige Termine:</h2>
        <p><strong>Erster Arbeitstag:</strong> {{start_date}}<br>
        <strong>Team-Meeting:</strong> {{team_meeting_date}}<br>
        <strong>Quartals-Review:</strong> {{review_date}}<br>
        <strong>Ihr Team:</strong> {{team_size}} Mitarbeiter</p>
        
        <p>Für einen reibungslosen Start haben wir bereits alles vorbereitet:</p>
        <ul>
            <li>Büro eingerichtet</li>
            <li>IT-Equipment konfiguriert</li>
            <li>Zugänge zu allen relevanten Systemen</li>
            <li>Ihr Assistent: {{assistant_name}}</li>
        </ul>
        
        <p>Herzliche Grüße<br>
        {{ceo_name}}<br>
        Geschäftsführung {{company_name}}</p>
        """,
        "template_text": """
        Willkommen bei {{company_name}}, {{employee_name}}!
        
        Wir freuen uns außerordentlich, Sie als neue Führungskraft in unserem Unternehmen zu begrüßen.
        
        Ihre ersten Schritte als {{position}}:
        - Strategisches Briefing mit der Geschäftsleitung
        - Team-Vorstellung und Kennenlernen
        - Übergabe der Abteilungsverantwortung
        - Management-Tools und Systeme einrichten
        
        Wichtige Termine:
        Erster Arbeitstag: {{start_date}}
        Team-Meeting: {{team_meeting_date}}
        Quartals-Review: {{review_date}}
        Ihr Team: {{team_size}} Mitarbeiter
        
        Für einen reibungslosen Start haben wir bereits alles vorbereitet:
        - Büro eingerichtet
        - IT-Equipment konfiguriert
        - Zugänge zu allen relevanten Systemen
        - Ihr Assistent: {{assistant_name}}
        
        Herzliche Grüße
        {{ceo_name}}
        Geschäftsführung {{company_name}}
        """,
        "variables": [
            "company_name", "employee_name", "position", "start_date",
            "team_meeting_date", "review_date", "team_size", 
            "assistant_name", "ceo_name"
        ],
        "category": "onboarding"
    },
    
    "onboarding_intern": {
        "id": "onboarding_intern",
        "name": "onboarding_intern",
        "display_name": "Onboarding - Praktikant",
        "subject": "Willkommen zu Ihrem Praktikum bei {{company_name}}",
        "template_html": """
        <h1>Herzlich willkommen, {{employee_name}}!</h1>
        
        <p>Wir freuen uns sehr, Sie für Ihr Praktikum in unserem Unternehmen begrüßen zu dürfen.</p>
        
        <h2>Ihr Praktikum bei uns:</h2>
        <ul>
            <li>📅 <strong>Dauer:</strong> {{internship_duration}}</li>
            <li>🏢 <strong>Abteilung:</strong> {{department}}</li>
            <li>👨‍💼 <strong>Ihr Betreuer:</strong> {{supervisor_name}}</li>
            <li>💰 <strong>Vergütung:</strong> {{compensation}}</li>
        </ul>
        
        <h2>Ihr erster Tag ({{start_date}}):</h2>
        <ul>
            <li>✅ 09:00 Uhr - Begrüßung im HR-Büro</li>
            <li>✅ Unterlagen ausfüllen und Arbeitsplatz einrichten</li>
            <li>✅ Rundgang und Team-Vorstellung</li>
            <li>✅ Einführung in Ihre Aufgaben</li>
        </ul>
        
        <h2>Was Sie mitbringen sollten:</h2>
        <ul>
            <li>Personalausweis</li>
            <li>Immatrikulationsbescheinigung</li>
            <li>Bankverbindung (falls vergütet)</li>
            <li>Viel Motivation und Neugier! 😊</li>
        </ul>
        
        <p>Wir freuen uns auf eine spannende Zeit mit Ihnen!</p>
        
        <p>Herzliche Grüße<br>
        {{supervisor_name}} & das HR-Team</p>
        """,
        "template_text": """
        Herzlich willkommen, {{employee_name}}!
        
        Wir freuen uns sehr, Sie für Ihr Praktikum in unserem Unternehmen begrüßen zu dürfen.
        
        Ihr Praktikum bei uns:
        - Dauer: {{internship_duration}}
        - Abteilung: {{department}}
        - Ihr Betreuer: {{supervisor_name}}
        - Vergütung: {{compensation}}
        
        Ihr erster Tag ({{start_date}}):
        - 09:00 Uhr - Begrüßung im HR-Büro
        - Unterlagen ausfüllen und Arbeitsplatz einrichten
        - Rundgang und Team-Vorstellung
        - Einführung in Ihre Aufgaben
        
        Was Sie mitbringen sollten:
        - Personalausweis
        - Immatrikulationsbescheinigung
        - Bankverbindung (falls vergütet)
        - Viel Motivation und Neugier!
        
        Wir freuen uns auf eine spannende Zeit mit Ihnen!
        
        Herzliche Grüße
        {{supervisor_name}} & das HR-Team
        """,
        "variables": [
            "employee_name", "internship_duration", "department", 
            "supervisor_name", "compensation", "start_date"
        ],
        "category": "onboarding"
    }
}

class EmailService:
    """
    Email Service Interface für Browo AI Integration
    
    Später wird diese Klasse mit Browo AI's Email Service verbunden.
    Momentan nur lokale Template-Verwaltung.
    """
    
    def __init__(self):
        self.templates = EMAIL_TEMPLATES
    
    def get_template(self, template_id: str) -> Optional[Dict]:
        """Get email template by ID"""
        return self.templates.get(template_id)
    
    def get_all_templates(self) -> List[Dict]:
        """Get all available templates"""
        return list(self.templates.values())
    
    def get_templates_by_category(self, category: str) -> List[Dict]:
        """Get templates by category"""
        return [t for t in self.templates.values() if t["category"] == category]
    
    def render_template(self, template_id: str, variables: Dict[str, str]) -> Dict[str, str]:
        """Render template with variables (simple string replacement)"""
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        # Simple variable replacement ({{variable}})
        subject = template["subject"]
        html_content = template["template_html"]
        text_content = template["template_text"]
        
        for var, value in variables.items():
            placeholder = f"{{{{{var}}}}}"
            subject = subject.replace(placeholder, str(value))
            html_content = html_content.replace(placeholder, str(value))
            text_content = text_content.replace(placeholder, str(value))
        
        return {
            "subject": subject,
            "html": html_content,
            "text": text_content
        }
    
    async def send_email_via_browo(self, recipient_email: str, template_id: str, variables: Dict[str, str]) -> Dict:
        """
        PLACEHOLDER: Send email via Browo AI
        
        This will be implemented when HRthis is integrated into Browo AI.
        For now, just return a mock response.
        """
        rendered = self.render_template(template_id, variables)
        
        # TODO: Actual Browo AI API call
        # response = await browo_api.send_email({
        #     "to": recipient_email,
        #     "subject": rendered["subject"],
        #     "html": rendered["html"],
        #     "text": rendered["text"]
        # })
        
        # Mock response for now
        return {
            "id": f"email_{datetime.now().timestamp()}",
            "status": "sent",
            "recipient": recipient_email,
            "template_id": template_id,
            "sent_at": datetime.now().isoformat(),
            "message": "Email sent successfully (via Browo AI)"
        }
    
    def validate_template_variables(self, template_id: str, variables: Dict[str, str]) -> List[str]:
        """Validate that all required variables are provided"""
        template = self.get_template(template_id)
        if not template:
            return [f"Template {template_id} not found"]
        
        required_vars = set(template["variables"])
        provided_vars = set(variables.keys())
        missing_vars = required_vars - provided_vars
        
        return [f"Missing variable: {var}" for var in missing_vars]

# Service instance
email_service = EmailService()