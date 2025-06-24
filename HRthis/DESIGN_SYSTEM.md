# 🎨 HRthis Design System

Ein konsistentes, responsives UI-System für die HRthis Anwendung.

## 📋 Übersicht

Das Design System besteht aus:
- **Design Tokens** - Zentrale Werte für Farben, Spacing, Typography
- **Layout Components** - Grid, Container, Card System
- **Responsive Breakpoints** - Mobile-first Design
- **Tailwind Integration** - Erweiterte Konfiguration

## 🏗️ Architektur

```
src/design-system/
├── tokens/           # Design Tokens (Farben, Spacing, etc.)
├── components/       # UI Components
│   └── layout/      # Layout Components (Grid, Card, Container)
├── examples/        # Anwendungsbeispiele
└── index.ts         # Central Export
```

## 🎯 Design Tokens

### Farben
```typescript
import { colors, semanticColors } from 'design-system/tokens';

// Base colors
colors.gray[500]
colors.primary[600]
colors.success[500]

// Semantic colors
semanticColors.text.primary
semanticColors.background.secondary
semanticColors.status.success
```

### Spacing
```typescript
import { spacing, semanticSpacing } from 'design-system/tokens';

// Base spacing (4px scale)
spacing[4]  // 16px
spacing[6]  // 24px
spacing[8]  // 32px

// Semantic spacing
semanticSpacing.gridGap.normal     // 24px
semanticSpacing.cardPadding.md     // 24px
semanticSpacing.containerPadding.desktop // 24px
```

### Typography
```typescript
import { typography } from 'design-system/tokens';

// Headings
typography.heading.h1  // 36px, bold, tight line-height
typography.heading.h2  // 24px, bold, tight line-height

// Body text
typography.body.normal // 16px, normal weight, normal line-height
typography.body.small  // 14px, normal weight, normal line-height
```

## 📱 Grid System

### 12-Spalten Grid
```tsx
import { DashboardGrid, GridItem } from 'design-system';

<DashboardGrid>
  <GridItem span="full" mdSpan={9}>
    {/* Hauptinhalt - 9 Spalten auf Desktop */}
  </GridItem>
  <GridItem span="full" mdSpan={3}>
    {/* Sidebar - 3 Spalten auf Desktop */}
  </GridItem>
</DashboardGrid>
```

### Preset Layouts
```tsx
import { StatsGrid, ThreeColumns, TwoColumns } from 'design-system';

// Stats Cards (responsive 1->3 Spalten)
<StatsGrid>
  <StatsCard title="Heute" value="8h" />
  <StatsCard title="Woche" value="40h" />
  <StatsCard title="Monat" value="160h" />
</StatsGrid>

// Drei gleichmäßige Spalten
<ThreeColumns>
  <Card>Content 1</Card>
  <Card>Content 2</Card>
  <Card>Content 3</Card>
</ThreeColumns>
```

## 🎴 Card System

### Basic Cards
```tsx
import { Card, CardHeader, CardContent } from 'design-system';

<Card variant="elevated" padding="lg" clickable>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Preset Cards
```tsx
import { StatsCard, InfoCard, AvatarCard } from 'design-system';

// Stats Card
<StatsCard
  title="Arbeitszeit"
  value="8h"
  subtitle="heute"
  icon="⏰"
  trend={{ value: "+2h", isPositive: true }}
/>

// Info Card
<InfoCard title="Beschäftigungsdetails">
  <div>Details content</div>
</InfoCard>

// Avatar Card
<AvatarCard onClick={() => navigate('/profile')}>
  <div>Avatar content</div>
</AvatarCard>
```

## 📦 Container System

### Page Layout
```tsx
import { PageContainer, Section } from 'design-system';

<PageContainer
  title="Dashboard"
  subtitle="Willkommen zurück"
  backButton
  onBack={() => navigate(-1)}
  actions={<Button>Action</Button>}
>
  <Section title="Stats" spacing="lg">
    {/* Content */}
  </Section>
</PageContainer>
```

### Content Areas
```tsx
import { ContentArea } from 'design-system';

<ContentArea
  sidebar={<AvatarCard />}
  sidebarPosition="right"
>
  {/* Main content */}
</ContentArea>
```

## 🎨 Tailwind Integration

### Erweiterte Klassen
```css
/* Typography */
.text-heading-1    /* H1 Styling */
.text-heading-2    /* H2 Styling */
.text-body         /* Body Text */
.text-caption      /* Small Text */

/* Cards */
.card              /* Basic Card */
.card-elevated     /* Card mit Shadow */
.card-hover        /* Hover Effects */

/* Layout */
.container-page    /* Page Container */
.interactive       /* Interactive Elements */
```

### Custom Properties
```tsx
// Direkte Token Usage in Tailwind
<div className="bg-primary-500 text-white p-6 rounded-xl shadow-md">
  Content
</div>

// Semantic Classes
<div className="bg-bg-secondary text-text-primary border-border-light">
  Content
</div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (1 Spalte, gestapelt)
- **Tablet**: 768px - 1024px (2-3 Spalten)
- **Desktop**: > 1024px (12-Spalten Grid)

### Mobile-First Approach
```tsx
<Grid cols={1} mdCols={3} lgCols={4}>
  {/* Mobile: 1 Spalte, Tablet: 3 Spalten, Desktop: 4 Spalten */}
</Grid>
```

## 🚀 Migration Guide

### 1. Bestehende Komponenten updaten
```tsx
// Vorher
<div className="max-w-7xl mx-auto px-4 py-6">
  <div className="grid md:grid-cols-3 gap-4">
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Content */}
    </div>
  </div>
</div>

// Nachher
<PageContainer>
  <StatsGrid>
    <StatsCard title="..." value="..." />
  </StatsGrid>
</PageContainer>
```

### 2. Tailwind Config updaten
```javascript
// Ersetze deine tailwind.config.js mit tailwind.config.extended.js
```

### 3. Imports anpassen
```tsx
// Single Import für alles
import {
  PageContainer,
  DashboardGrid,
  GridItem,
  StatsCard,
  colors,
  spacing
} from 'design-system';
```

## ✅ Vorteile

1. **Konsistenz** - Einheitliche Abstände, Farben, Typography
2. **Wartbarkeit** - Zentrale Änderungen an einem Ort
3. **Responsive** - Mobile-first, automatische Anpassung
4. **Performance** - Optimierte Tailwind-Klassen
5. **Developer Experience** - TypeScript Support, Autocomplete
6. **Skalierbarkeit** - Einfach erweiterbar für neue Features

## 🔮 Roadmap

- [ ] Button Component System
- [ ] Form Components (Input, Select, etc.)
- [ ] Modal/Dialog System
- [ ] Toast Notifications
- [ ] Icon System
- [ ] Dark Mode Support
- [ ] Animation Presets
- [ ] Testing Setup (Storybook)

## 📚 Beispiele

Siehe `src/design-system/examples/` für vollständige Implementierungsbeispiele.