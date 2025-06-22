import { getOpenAITextResponse } from './chat-service';
import { AIGenerationRequest, AIGeneratedContent } from '../types/training';

/**
 * AI Training Content Generator
 * Uses OpenAI GPT-4o to generate training content, lessons, and quizzes
 */

export const generateTrainingContent = async (request: AIGenerationRequest): Promise<AIGeneratedContent> => {
  const prompt = `
Du bist ein Experte für Unternehmensschulungen und E-Learning. Erstelle eine strukturierte Schulung basierend auf folgenden Vorgaben:

**Schulungsanfrage:**
- Thema: ${request.topic}
- Beschreibung: ${request.description}
- Zielgruppe: ${request.targetAudience}
- Dauer: ${request.duration} Minuten
- Schwierigkeitsgrad: ${request.difficulty}
- Anzahl Lektionen: ${request.lessonCount}
- Quiz einschließen: ${request.includeQuiz ? 'Ja' : 'Nein'}

**Aufgabe:**
Erstelle eine vollständige Schulung mit folgender Struktur:

1. **Schulungstitel**: Prägnanter, professioneller Titel
2. **Beschreibung**: Umfassende Beschreibung der Schulung (2-3 Sätze)
3. **Lektionen**: ${request.lessonCount} Lektionen mit jeweils:
   - Titel der Lektion
   - Kurze Beschreibung (1-2 Sätze)
   - Detaillierter Inhalt (strukturiert mit Überschriften, Aufzählungen, praktischen Beispielen)
   ${request.includeQuiz ? '- Quiz mit 2-3 Multiple-Choice-Fragen pro Lektion\n   - Jede Frage mit 4 Antwortmöglichkeiten, korrekter Antwort und Erklärung' : ''}

${request.includeQuiz ? `4. **Abschlussprüfung**: 
   - 2-3 zusammenfassende Fragen über alle Lektionen
   - Bestehensgrenze: 70%` : ''}

**Wichtige Anforderungen:**
- Inhalt muss praxisnah und unternehmensrelevant sein
- Verwende klare, verständliche Sprache
- Strukturiere den Inhalt logisch und aufbauend
- Beispiele und Fallstudien einbauen
- Bei ${request.difficulty === 'BEGINNER' ? 'Anfänger: Grundlagen erklären' : request.difficulty === 'INTERMEDIATE' ? 'Fortgeschritten: Vertiefte Kenntnisse vermitteln' : 'Experte: Spezialisiertes Fachwissen'}

**Antwortformat:**
Antworte ausschließlich in folgendem JSON-Format:

{
  "title": "Schulungstitel",
  "description": "Schulungsbeschreibung",
  "lessons": [
    {
      "title": "Lektionstitel",
      "description": "Lektionsbeschreibung",
      "content": "Detaillierter Lektionsinhalt mit Markdown-Formatierung",
      ${request.includeQuiz ? `"quiz": {
        "questions": [
          {
            "question": "Frage?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Erklärung der korrekten Antwort"
          }
        ],
        "passingScore": 80
      }` : ''}
    }
  ]${request.includeQuiz ? `,
  "finalQuiz": {
    "questions": [
      {
        "question": "Abschlussfrage?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Erklärung"
      }
    ],
    "passingScore": 70
  }` : ''}
}

Erstelle jetzt die Schulung:`;

  try {
    const aiResponse = await getOpenAITextResponse([
      {
        role: 'system',
        content: 'Du bist ein Experte für Unternehmensschulungen und E-Learning-Content. Erstelle hochwertige, strukturierte Schulungsinhalte in deutscher Sprache.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], { model: 'gpt-4o' });
    
    const response = aiResponse.content;

    // Parse the AI response
    let parsedContent: AIGeneratedContent;
    
    try {
      // Extract JSON from response (in case there's additional text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      parsedContent = JSON.parse(jsonString);
    } catch (parseError) {
      // Fallback: create structured content from text response
      parsedContent = {
        title: `${request.topic} - Umfassende Schulung`,
        description: `Eine strukturierte Schulung zu ${request.topic} für ${request.targetAudience}. Diese Schulung vermittelt alle wichtigen Grundlagen und praktischen Anwendungen.`,
        lessons: Array.from({ length: request.lessonCount }, (_, i) => ({
          title: `Lektion ${i + 1}: ${request.topic} Grundlagen`,
          description: `In dieser Lektion lernen Sie die wichtigsten Aspekte von ${request.topic} kennen.`,
          content: `# Lektion ${i + 1}: ${request.topic}\n\n${response.substring(0, 500)}...`,
          quiz: request.includeQuiz ? {
            questions: [
              {
                question: `Was ist das wichtigste Prinzip bei ${request.topic}?`,
                options: [
                  'Sicherheit und Compliance',
                  'Effizienz',
                  'Kostenoptimierung',
                  'Alle genannten Punkte'
                ],
                correctAnswer: 3,
                explanation: `Bei ${request.topic} sind alle Aspekte wichtig, aber besonders die Balance zwischen Sicherheit, Effizienz und Kosten.`
              }
            ],
            passingScore: 80
          } : undefined
        })),
        finalQuiz: request.includeQuiz ? {
          questions: [
            {
              question: `Was haben Sie in dieser ${request.topic} Schulung gelernt?`,
              options: [
                'Grundlagen und Best Practices',
                'Nur theoretisches Wissen',
                'Veraltete Methoden',
                'Nichts Neues'
              ],
              correctAnswer: 0,
              explanation: 'Diese Schulung vermittelt sowohl theoretische Grundlagen als auch praktische Best Practices.'
            }
          ],
          passingScore: 70
        } : undefined
      };
    }

    // Validate the generated content
    if (!parsedContent.title || !parsedContent.description || !parsedContent.lessons) {
      throw new Error('Invalid AI response structure');
    }

    return parsedContent;
  } catch (error) {
    console.error('AI Training Generation Error:', error);
    throw new Error('Fehler bei der KI-Generierung. Bitte versuchen Sie es erneut.');
  }
};

/**
 * Generate a training certificate using AI
 */
export const generateCertificateText = async (
  trainingTitle: string, 
  userName: string, 
  completionDate: string,
  score: number
): Promise<string> => {
  const prompt = `
Erstelle einen professionellen Zertifikatstext für eine abgeschlossene Unternehmensschulung.

**Details:**
- Schulung: ${trainingTitle}
- Teilnehmer: ${userName}
- Abschlussdatum: ${completionDate}
- Ergebnis: ${score}%

**Anforderungen:**
- Professioneller, offizieller Ton
- Deutsche Sprache
- Gratulation zur erfolgreichen Teilnahme
- Bestätigung der erworbenen Kenntnisse
- Verwende "HRthis GmbH" als ausstellendes Unternehmen

Erstelle einen strukturierten Zertifikatstext:`;

  try {
    const aiResponse = await getOpenAITextResponse([
      {
        role: 'system',
        content: 'Du erstellst professionelle Zertifikatstexte für Unternehmensschulungen in deutscher Sprache.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], { model: 'gpt-4o' });

    return aiResponse.content;
  } catch (error) {
    console.error('Certificate Generation Error:', error);
    
    // Fallback certificate text
    return `
ZERTIFIKAT

Hiermit wird bestätigt, dass

${userName}

die Schulung "${trainingTitle}" erfolgreich abgeschlossen hat.

Abschlussdatum: ${completionDate}
Ergebnis: ${score}%

Diese Schulung vermittelte wichtige Kenntnisse und Fähigkeiten für den beruflichen Alltag.

HRthis GmbH
Personalabteilung
    `.trim();
  }
};

/**
 * Generate email content for training notifications
 */
export const generateTrainingNotificationEmail = async (
  type: 'NEW_TRAINING' | 'REMINDER' | 'DEADLINE_APPROACHING' | 'COMPLETED' | 'FAILED',
  userName: string,
  trainingTitle: string,
  additionalInfo?: string
): Promise<{ subject: string; body: string }> => {
  let promptContext = '';
  
  switch (type) {
    case 'NEW_TRAINING':
      promptContext = 'eine neue Schulung ist verfügbar';
      break;
    case 'REMINDER':
      promptContext = 'Erinnerung an eine nicht abgeschlossene Schulung';
      break;
    case 'DEADLINE_APPROACHING':
      promptContext = 'die Deadline einer Schulung nähert sich';
      break;
    case 'COMPLETED':
      promptContext = 'Gratulation zur abgeschlossenen Schulung';
      break;
    case 'FAILED':
      promptContext = 'Information über nicht bestandene Schulung';
      break;
  }

  const prompt = `
Erstelle eine professionelle E-Mail für ${promptContext}.

**Details:**
- Empfänger: ${userName}
- Schulung: ${trainingTitle}
- Zusätzliche Info: ${additionalInfo || 'Keine'}
- Absender: HRthis GmbH Personalabteilung

**Anforderungen:**
- Professioneller aber freundlicher Ton
- Deutsche Sprache
- Passende Betreffzeile
- Strukturierte E-Mail mit klaren Handlungsaufforderungen
- Link zur HRthis App erwähnen

Erstelle Betreff und E-Mail-Text:`;

  try {
    const aiResponse = await getOpenAITextResponse([
      {
        role: 'system',
        content: 'Du erstellst professionelle E-Mail-Benachrichtigungen für Unternehmensschulungen in deutscher Sprache.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], { model: 'gpt-4o' });
    
    const response = aiResponse.content;

    // Extract subject and body from response
    const lines = response.split('\n');
    const subjectLine = lines.find((line: string) => line.toLowerCase().includes('betreff:') || line.toLowerCase().includes('subject:'));
    const subject = subjectLine ? subjectLine.replace(/betreff:|subject:/i, '').trim() : `HRthis: ${trainingTitle}`;
    
    const bodyStart = response.indexOf('\n\n') > 0 ? response.indexOf('\n\n') + 2 : 0;
    const body = response.substring(bodyStart).trim();

    return { subject, body };
  } catch (error) {
    console.error('Email Generation Error:', error);
    
    // Fallback email content
    const fallbackSubjects = {
      NEW_TRAINING: `Neue Schulung verfügbar: ${trainingTitle}`,
      REMINDER: `Erinnerung: Schulung "${trainingTitle}" noch nicht abgeschlossen`,
      DEADLINE_APPROACHING: `Deadline nähert sich: ${trainingTitle}`,
      COMPLETED: `Glückwunsch! Schulung "${trainingTitle}" erfolgreich abgeschlossen`,
      FAILED: `Schulung "${trainingTitle}" - Wiederholung erforderlich`
    };

    return {
      subject: fallbackSubjects[type],
      body: `Hallo ${userName},\n\nbezüglich der Schulung "${trainingTitle}" gibt es eine wichtige Information.\n\nBitte loggen Sie sich in die HRthis App ein, um weitere Details zu erfahren.\n\nBeste Grüße\nIhr HRthis Team`
    };
  }
};