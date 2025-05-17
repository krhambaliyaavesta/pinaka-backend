export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface UserData {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: number;
  job_title: string;
  approval_status?: ApprovalStatus;
  created_at: string | Date;
  updated_at: string | Date;
} 