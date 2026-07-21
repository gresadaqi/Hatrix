export type RiskLevel = 'Low' | 'Medium' | 'High';
export type FindingStatus = 'Present' | 'Missing';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export type HeaderFinding = {
  name: string;
  status: FindingStatus;
  value: string;
  risk: RiskLevel;
  why: string;
  recommendation: string;
  weaknesses: string[];
  positive: string[];
  score: number;
  maxScore: number;
};

export type WorkerScanResponse = {
  status: number;
  finalUrl: string;
  headers: Record<string, string>;
  redirectCount: number;
  responseTime: number;
  error?: string;
};

export type SecurityAnalysis = {
  targetUrl: string;
  timestamp: string;
  finalUrl: string;
  httpStatus: number;
  https: boolean;
  redirectCount: number;
  responseTime: number;
  score: number;
  grade: Grade;
  summary: string;
  findings: HeaderFinding[];
  missingHeaders: string[];
  weakHeaders: string[];
  positiveFindings: string[];
  scoreExplanation: string[];
  demo?: boolean;
};
