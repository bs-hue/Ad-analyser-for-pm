import {
  ClientProfile,
  UnifiedAdRecord,
  AccountDiagnosisResult,
  ExperimentItem,
  HistoricalAnalysisRun
} from './types';
import {
  INITIAL_CLIENTS,
  DEMO_AD_RECORDS_ANKIT,
  DEMO_AD_RECORDS_MKR,
  DEMO_CREATIVE_INTELLIGENCE,
  DEMO_LANDING_PAGE_ANALYSIS,
  DEMO_EXPERIMENTS,
  DEMO_HISTORICAL_RUNS
} from './demoData';

const CLIENTS_KEY = 'pmi_clients';
const DATASET_PREFIX = 'pmi_dataset_';
const DIAGNOSIS_PREFIX = 'pmi_diagnosis_';
const EXPERIMENTS_PREFIX = 'pmi_experiments_';
const HISTORY_PREFIX = 'pmi_history_';

export function getStoredClients(): ClientProfile[] {
  if (typeof window === 'undefined') return INITIAL_CLIENTS;
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    if (!raw) {
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CLIENTS;
  }
}

export function saveClientProfile(client: ClientProfile): void {
  if (typeof window === 'undefined') return;
  const clients = getStoredClients();
  const index = clients.findIndex((c) => c.id === client.id);
  if (index >= 0) {
    clients[index] = client;
  } else {
    clients.push(client);
  }
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function getClientById(clientId: string): ClientProfile | undefined {
  const clients = getStoredClients();
  return clients.find((c) => c.id === clientId) || INITIAL_CLIENTS.find((c) => c.id === clientId);
}

export function getClientDataset(clientId: string): UnifiedAdRecord[] {
  if (typeof window === 'undefined') {
    if (clientId === 'client-mkr-audit') return DEMO_AD_RECORDS_MKR;
    return clientId === 'client-ankit-batra' ? DEMO_AD_RECORDS_ANKIT : [];
  }
  try {
    const raw = localStorage.getItem(DATASET_PREFIX + clientId);
    if (!raw) {
      if (clientId === 'client-mkr-audit') {
        localStorage.setItem(DATASET_PREFIX + clientId, JSON.stringify(DEMO_AD_RECORDS_MKR));
        return DEMO_AD_RECORDS_MKR;
      }
      if (clientId === 'client-ankit-batra') {
        localStorage.setItem(DATASET_PREFIX + clientId, JSON.stringify(DEMO_AD_RECORDS_ANKIT));
        return DEMO_AD_RECORDS_ANKIT;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    if (clientId === 'client-mkr-audit') return DEMO_AD_RECORDS_MKR;
    return clientId === 'client-ankit-batra' ? DEMO_AD_RECORDS_ANKIT : [];
  }
}

export function saveClientDataset(clientId: string, records: UnifiedAdRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DATASET_PREFIX + clientId, JSON.stringify(records));
}

export function getClientExperiments(clientId: string): ExperimentItem[] {
  if (typeof window === 'undefined') {
    return clientId === 'client-ankit-batra' ? DEMO_EXPERIMENTS : [];
  }
  try {
    const raw = localStorage.getItem(EXPERIMENTS_PREFIX + clientId);
    if (!raw) {
      if (clientId === 'client-ankit-batra') {
        localStorage.setItem(EXPERIMENTS_PREFIX + clientId, JSON.stringify(DEMO_EXPERIMENTS));
        return DEMO_EXPERIMENTS;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return clientId === 'client-ankit-batra' ? DEMO_EXPERIMENTS : [];
  }
}

export function saveClientExperiments(clientId: string, experiments: ExperimentItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EXPERIMENTS_PREFIX + clientId, JSON.stringify(experiments));
}

export function getClientHistory(clientId: string): HistoricalAnalysisRun[] {
  if (typeof window === 'undefined') {
    return clientId === 'client-ankit-batra' ? DEMO_HISTORICAL_RUNS : [];
  }
  try {
    const raw = localStorage.getItem(HISTORY_PREFIX + clientId);
    if (!raw) {
      if (clientId === 'client-ankit-batra') {
        localStorage.setItem(HISTORY_PREFIX + clientId, JSON.stringify(DEMO_HISTORICAL_RUNS));
        return DEMO_HISTORICAL_RUNS;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return clientId === 'client-ankit-batra' ? DEMO_HISTORICAL_RUNS : [];
  }
}

export function addClientHistoryRun(clientId: string, run: HistoricalAnalysisRun): void {
  if (typeof window === 'undefined') return;
  const history = getClientHistory(clientId);
  const updated = [run, ...history.filter((h) => h.id !== run.id)];
  localStorage.setItem(HISTORY_PREFIX + clientId, JSON.stringify(updated));
}
