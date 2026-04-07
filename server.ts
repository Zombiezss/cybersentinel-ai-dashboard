import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { DashboardData, SystemStatus, Alert, AIAction, LogEntry } from "./src/types";

const INITIAL_DATA: DashboardData = {
  cpu: 45,
  memory: 32,
  network: 15,
  errors: 0,
  status: 'live',
  score: 0.94,
  logs: [
    { id: '1', timestamp: '05:14:00', message: 'Sentinel AI Core initialized.', type: 'success' },
    { id: '2', timestamp: '05:14:05', message: 'Primary firewall established.', type: 'info' },
    { id: '3', timestamp: '05:14:10', message: 'Monitoring network traffic...', type: 'info' },
  ],
  alerts: [],
  aiActions: [
    { 
      id: '1', 
      action: 'System Optimization', 
      reasoning: [
        { message: 'Analyzing resource allocation', timestamp: '05:14:15', status: 'completed' },
        { message: 'Optimizing cache headers', timestamp: '05:14:16', status: 'completed' },
        { message: 'Scaling microservices', timestamp: '05:14:17', status: 'completed' }
      ],
      status: 'completed',
      timestamp: '05:14:15',
      progress: 100
    }
  ],
  settings: [
    { id: '1', category: 'Security', label: 'Real-time Threat Detection', desc: 'AI scans all incoming packets for anomalies.', enabled: true },
    { id: '2', category: 'Security', label: 'Auto-Quarantine', desc: 'Automatically isolate suspicious nodes.', enabled: false },
    { id: '3', category: 'AI Agent', label: 'Autonomous Mitigation', desc: 'Allow AI to execute fixes without approval.', enabled: true },
    { id: '4', category: 'AI Agent', label: 'Deep Reasoning Mode', desc: 'Increases accuracy but adds 200ms latency.', enabled: true },
    { id: '5', category: 'System', label: 'Verbose Logging', desc: 'Capture detailed debug information.', enabled: false },
    { id: '6', category: 'System', label: 'Cloud Sync', desc: 'Backup system state to secure off-site vault.', enabled: true },
  ]
};

let dashboardData: DashboardData = { ...INITIAL_DATA };
let isSimulation = true;

// Simulation Engine (Backend)
setInterval(() => {
  if (!isSimulation) return;

  const newCpu = Number(Math.min(100, Math.max(0, dashboardData.cpu + (Math.random() * 10 - 5))).toFixed(2));
  const newMem = Number(Math.min(100, Math.max(0, dashboardData.memory + (Math.random() * 6 - 3))).toFixed(2));
  const newNet = Number(Math.min(100, Math.max(0, dashboardData.network + (Math.random() * 20 - 10))).toFixed(2));
  
  let newStatus: SystemStatus = dashboardData.status;
  let newAlerts = [...dashboardData.alerts];
  let newLogs: LogEntry[] = [...dashboardData.logs];
  let newAiActions = [...dashboardData.aiActions];
  let newScore = dashboardData.score;
  let newErrors = dashboardData.errors;

  const timestamp = new Date().toLocaleTimeString([], { hour12: false });

  if (Math.random() > 0.95 && dashboardData.status === 'live') {
    newStatus = 'critical';
    newErrors = Math.floor(Math.random() * 15) + 10;
    const alert: Alert = {
      id: Math.random().toString(),
      title: 'DDoS Attack Detected',
      description: 'Massive influx of traffic from 142.250.190.46. Port 80/443 saturated.',
      severity: 'high',
      status: 'active',
      timestamp
    };
    newAlerts.unshift(alert);
    newLogs.unshift({ id: Math.random().toString(), timestamp, message: 'CRITICAL: Network saturation detected!', type: 'error' });
    
    const aiAction: AIAction = {
      id: Math.random().toString(),
      action: 'Mitigating DDoS Attack',
      reasoning: [
        { message: 'Identifying attack vectors', timestamp, status: 'completed' },
        { message: 'Enabling Cloudflare Under Attack mode', timestamp, status: 'executing' },
        { message: 'Rate limiting suspicious IPs', timestamp, status: 'pending' }
      ],
      status: 'executing',
      timestamp,
      progress: 33
    };
    newAiActions.unshift(aiAction);
    newScore -= 0.15;
  } else if (dashboardData.status === 'critical' && Math.random() > 0.7) {
    newStatus = 'recovered';
    newErrors = Math.floor(Math.random() * 5);
    newAlerts = newAlerts.map(a => a.severity === 'high' ? { ...a, status: 'resolved' } : a);
    type: 'error' as const
    if (newAiActions.length > 0) {
      newAiActions[0].status = 'completed';
      newAiActions[0].progress = 100;
      newAiActions[0].reasoning = newAiActions[0].reasoning.map(r => ({ ...r, status: 'completed' }));
    }
    newScore += 0.1;
  } else if (dashboardData.status === 'recovered' && Math.random() > 0.5) {
    newStatus = 'live';
    newErrors = 0;
  }

  if (newLogs.length > 50) newLogs.pop();
  if (newAlerts.length > 10) newAlerts.pop();
  if (newAiActions.length > 5) newAiActions.pop();

  dashboardData = {
    ...dashboardData,
    cpu: newCpu,
    memory: newMem,
    network: newNet,
    errors: newErrors,
    status: newStatus,
    alerts: newAlerts,
    logs: newLogs,
    aiActions: newAiActions,
    score: Math.max(0, Math.min(1, newScore + (Math.random() * 0.01 - 0.005)))
  };
}, 2000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/dashboard", (req, res) => {
    res.json({ ...dashboardData, isSimulation });
  });

  app.post("/api/toggle-simulation", (req, res) => {
    isSimulation = !isSimulation;
    res.json({ isSimulation });
  });

  app.post("/api/actions/block-ip", (req, res) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    dashboardData = {
      ...dashboardData,
      cpu: Math.max(10, dashboardData.cpu - 25),
      errors: Math.max(0, dashboardData.errors - 5),
      network: Math.max(5, dashboardData.network - 30),
      status: dashboardData.status === 'critical' ? 'recovered' : dashboardData.status,
      logs: [
        { 
          id: Math.random().toString(), 
          timestamp, 
          message: 'ACTION: IP 142.250.190.46 blocked by administrator.', 
          type: 'success' as const
        },
        ...dashboardData.logs
      ].slice(0, 50)
    };
    res.json({ success: true, dashboardData });
  });

  app.post("/api/actions/reset", (req, res) => {
    dashboardData = { ...INITIAL_DATA };
    isSimulation = true;
    res.json({ success: true, dashboardData });
  });

  app.post("/api/actions/flush-logs", (req, res) => {
    dashboardData.logs = [];
    res.json({ success: true });
  });

  app.post("/api/settings/toggle", (req, res) => {
    const { id } = req.body;
    dashboardData.settings = dashboardData.settings.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    res.json({ success: true, settings: dashboardData.settings });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
