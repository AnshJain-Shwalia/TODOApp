# Phase 6: Analytics Dashboard & Polish

In this phase, you will write data aggregation routines on the backend and build interactive productivity dashboards utilizing charts, contribution grids, and smooth animations.

---

## 1. Goal & Deliverable
- A dedicated Analytics endpoint on the backend calculating:
  - Completion Rates (Completed vs Total).
  - Productivity Streaks (consecutive daily completions).
  - Category / Tag distributions.
  - Daily completion history (last 30 days).
- A Dashboard tab in the React app styled using Chakra UI.
- Visual charts using `Recharts` and a Github-style activity heatmap.
- Visual polish: micro-animations, loaders, and success confetti celebrations.

---

## 2. Learning Outcomes
- Aggregating database records using SQL queries and TypeORM select builders.
- Rendering responsive data charts with Recharts.
- Building custom visual matrices (GitHub contribution grids) in CSS / React.
- Adding animation layouts using Framer Motion and external visual effects like canvas-confetti.

---

## 3. Expected Directory Structure Updates
```text
backend/
├── src/
│   └── analytics/
│       ├── analytics.controller.ts
│       ├── analytics.module.ts
│       └── analytics.service.ts
frontend/
└── src/
    ├── components/
    │   ├── Dashboard.tsx        # KPI Cards and Recharts wrappers
    │   ├── ContributionGrid.tsx # Heatmap calendar layout
    │   └── ConfettiTrigger.tsx  # Dynamic canvas-confetti effect
```

---

## 4. Step-by-Step Implementation Guide

### Step 1: Implement Analytics in NestJS
Create `backend/src/analytics/analytics.service.ts` to fetch user metrics.
- **Productivity Streaks**: Extract a list of dates when the user marked a task completed. Loop backward to calculate the consecutive day count.
- **Task Distribution**: Fetch count of tasks grouped by Category:
  ```typescript
  async getCategoryStats(userId: string) {
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.workspace', 'workspace')
      .select('task.category', 'category')
      .addSelect('COUNT(task.id)', 'count')
      .where('workspace.userId = :userId', { userId })
      .groupBy('task.category')
      .getRawMany();
  }
  ```

### Step 2: Set up Dashboard View in React
Install Recharts:
```bash
# In frontend/
npm install recharts
```
Build KPI metrics cards at the top using Chakra UI `<SimpleGrid>` and `<Stat>` components:
- Completion Rate
- Current Streak 🔥
- Pending Actions

### Step 3: Integrate Visual Graphs
Create `frontend/src/components/Dashboard.tsx` utilizing Recharts components like `<ResponsiveContainer>`, `<AreaChart>`, `<XAxis>`, `<YAxis>`, and `<Tooltip>`:
```tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const CompletionChart = ({ data }: { data: { date: string; count: number }[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#3182ce" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="date" stroke="#718096" />
      <YAxis stroke="#718096" />
      <Tooltip />
      <Area type="monotone" dataKey="count" stroke="#3182ce" fillOpacity={1} fill="url(#colorCount)" />
    </AreaChart>
  </ResponsiveContainer>
);
```

### Step 4: Build a GitHub-style Heatmap Grid
- Draw a grid containing 53 columns and 7 rows representing weeks and days.
- Loop through the past year. Fill cells with background colors based on completion intensities (`0` completions = gray, `1-2` = light blue, `3-5` = medium blue, `>5` = dark blue).

### Step 5: Add Visual Animations and Confetti
- Trigger a confetti splash when the user checks a high-priority item or clicks the complete checkbox:
  ```bash
  npm install canvas-confetti @types/canvas-confetti
  ```
  ```typescript
  import confetti from 'canvas-confetti';
  // Inside checkbox toggle click handler
  if (isCompleted) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
  ```

---

## 5. Verification Checklist
- Access Dashboard page. Confirm KPI stats display current metrics correctly.
- Mark tasks completed. Verify heatmap grid cells darken and AreaChart updates immediately.
- Mark a task completed on successive days (artificially backdating database records) to test the active streak counter and confirm the 🔥 animation is triggered.
