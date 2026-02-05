// Pipeline & Approval Workflow Types

export type PipelineStage = 'draft' | 'review' | 'approved' | 'published';

export interface PipelineStageData {
  id: PipelineStage;
  label: string;
  count: number;
  icon?: string;
}

export interface ApprovalItem {
  id: string;
  queryText: string;
  submitter: string;
  submitterEmail: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected';
  region?: string;
  original?: string;
  edited?: string;
}

export interface WorkflowStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  trends?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface DiffLine {
  lineNumber: number | null;
  type: 'added' | 'removed' | 'unchanged';
  content: string;
}
