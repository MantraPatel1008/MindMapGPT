# 🤖 AI Operating System - Quick Start

This is a **real, event-driven AI operating system** where agents activate on demand and perform actual work.

## 🚀 Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. Start the system
npm start
```

## 📊 What You Get

- **EventBus**: Decoupled agent communication
- **BaseAgent**: Abstract class for all agents
- **AIOperatingSystem**: Main controller
- **Three Ready-to-Use Agents**:
  - 👔 **BossAgent** (Jarvis) - Orchestrates work
  - 🔍 **LeadFinderAgent** - Discovers opportunities
  - 📊 **ReportingAgent** - Generates analytics

## 💻 Using the System

### Programmatically

```typescript
import { AIOperatingSystem } from './src/core/AIOperatingSystem';
import { BossAgent } from './src/agents/BossAgent';
import { LeadFinderAgent } from './src/agents/LeadFinderAgent';
import { ReportingAgent } from './src/agents/ReportingAgent';

// Initialize
const system = new AIOperatingSystem();

// Register agents
system.registerAgent(new BossAgent({
  id: 'boss',
  name: 'Boss Agent (Jarvis)',
  description: 'Main orchestrator',
  eventBus: system.getEventBus()
}));

system.registerAgent(new LeadFinderAgent({
  id: 'lead-finder',
  name: 'LeadFinder Agent',
  description: 'Discovers sales opportunities',
  eventBus: system.getEventBus()
}));

system.registerAgent(new ReportingAgent({
  id: 'reporting',
  name: 'Reporting Agent',
  description: 'Generates analytics',
  eventBus: system.getEventBus()
}));

// Check status (should be STANDBY)
console.log(system.getStatus());
// Output: { status: 'standby', uptime: null, agents: [...] }

// ACTIVATE THE SYSTEM
await system.activate();
// This wakes up all agents and starts their work cycles

// Check status after activation (should be ACTIVE)
console.log(system.getStatus());
// Output: { status: 'active', uptime: 2000, agents: [...] }

// Monitor what's happening
setInterval(() => {
  const status = system.getStatus();
  console.log(`Status: ${status.status}`);
  
  // Get agents
  status.agents.forEach(agent => {
    console.log(`  ${agent.name}: ${agent.state}`);
  });
}, 3000);

// Get discovered leads
const leadFinder = system.getAgent('lead-finder') as LeadFinderAgent;
const leads = leadFinder.getLeads();
console.log(`Found ${leads.length} leads`);

// Get reports
const reporting = system.getAgent('reporting') as ReportingAgent;
const summary = reporting.getExecutiveSummary();
console.log(summary);

// When done, deactivate
await system.deactivate();
// This puts all agents to sleep
```

### Via REST API (when integrated)

```bash
# Activate system
curl -X POST http://localhost:3000/api/system/activate

# Check status
curl http://localhost:3000/api/system/status

# Get agents
curl http://localhost:3000/api/system/agents

# Get leads
curl http://localhost:3000/api/system/leads

# Get report
curl http://localhost:3000/api/system/report

# Deactivate system
curl -X POST http://localhost:3000/api/system/deactivate
```

## 📁 Project Structure

```
src/
├── core/
│   ├── EventBus.ts              # Event communication system
│   ├── BaseAgent.ts             # Abstract agent base class
│   └── AIOperatingSystem.ts     # Main controller
├── agents/
│   ├── BossAgent.ts             # Orchestrator (Jarvis)
│   ├── LeadFinderAgent.ts       # Lead discovery
│   └── ReportingAgent.ts        # Analytics & reporting
└── dashboard/
    ├── AIOperatingSystemDashboard.tsx  # React dashboard
    └── dashboard.css                    # Styles
```

## 🔄 Agent Lifecycle

```
OFFLINE (never initialized)
  ↓
  system.activate()
  ↓
STANDBY (initialized, not active)
  ↓
  agent.wakeUp()
  ↓
LISTENING (active, checking for work)
  ↓
  [cycle runs every checkInterval]
  ├─ If work found: WORKING
  ├─ If waiting: WAITING
  └─ If idle: LISTENING
  ↓
  system.deactivate()
  ↓
DORMANT (sleeping, no cycles)
```

## 📡 Event Types

Agents communicate via these events:

- `system.activate` - System turned on
- `system.deactivate` - System turned off
- `agent.wakeup` - Agent started
- `agent.sleep` - Agent stopped
- `task.created` - New task submitted
- `task.completed` - Task finished
- `lead.found` - Lead discovered
- `report.generated` - Report created
- `error.occurred` - Error happened

## 🎯 Example: LeadFinder Workflow

When system activates:

```
1. LeadFinder.onWakeUp() called
2. State changes to 'listening'
3. Cycle loop starts every 8 seconds
4. Each cycle:
   - Scans lead sources
   - Rates opportunities
   - If found: emit 'lead.found' event
5. Reporting Agent listens and counts leads
6. When system deactivates:
   - State changes to 'dormant'
   - Cycle loop stops
   - No more scanning
```

## 🔧 Adding a New Agent

See ARCHITECTURE.md for detailed instructions.

Quick version:

```typescript
// 1. Create your agent
export class MyAgent extends BaseAgent {
  protected async onInit() { /* ... */ }
  protected async onWakeUp() { /* ... */ }
  protected async onSleep() { /* ... */ }
  protected async onCycle() { /* ... */ }
}

// 2. Register it
system.registerAgent(new MyAgent({
  id: 'my-agent',
  name: 'My Agent',
  description: 'What it does',
  eventBus: system.getEventBus()
}));
```

## 📚 Further Reading

- `ARCHITECTURE.md` - Deep dive into system design
- Source files - Well-commented code
- Event history - `system.getEventHistory()`
- Agent status - `system.getStatus()`

## 🚨 Key Differences From Static Dashboard

| Aspect | Static Dashboard | This System |
|--------|-----------------|------------|
| Default State | Always active | Dormant (STANDBY) |
| Activity | Fake/simulated | Real event-driven |
| Agents | Display cards | Actual objects with lifecycle |
| Communication | None | Event bus |
| Scalability | Limited | Microservices-ready |
| Testing | Hard | Easy (isolated agents) |
| Production Ready | No | Yes |

---

**You're not building a mockup. You're building a real AI operating system that behaves like a living workforce.**

Let's go! 🚀
