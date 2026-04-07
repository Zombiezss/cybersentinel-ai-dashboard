export type SystemStatus = 'critical' | 'degraded' | 'recovered' | 'live';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

export interface AIActionStep {
  message: string;
  timestamp: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface AIAction {
  id: string;
  action: string;
  reasoning: AIActionStep[];
  status: 'analyzing' | 'executing' | 'completed' | 'failed';
  timestamp: string;
  progress: number;
}

export interface SystemSetting {
  id: string;
  label: string;
  desc: string;
  enabled: boolean;
  category: string;
}

export interface DashboardData {
  cpu: number;
  memory: number;
  network: number;
  errors: number;
  status: SystemStatus;
  score: number;
  logs: LogEntry[];
  alerts: Alert[];
  aiActions: AIAction[];
  settings: SystemSetting[];
}
