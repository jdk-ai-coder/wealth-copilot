export interface Planner {
  id: string;
  name: string;
  title: string;
  firm: string;
  email: string;
  avatarUrl: string;
}

export interface Client {
  id: string;
  name: string;
  age: number;
  occupation: string;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive' | 'Moderate-Aggressive';
  totalAssets: number;
  portfolioValue: number;
  ytdReturn: number;
  annualIncome: number;
  relationshipStart: string;
  nextReview: string;
  tags: string[];
  goals: string[];
  accounts: Account[];
  recentActivity: string[];
  notes: string;
}

export interface Account {
  type: string;
  value: number;
  allocation: string;
}

export interface Meeting {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'in-progress' | 'completed';
  type: 'quarterly-review' | 'portfolio-review' | 'planning' | 'check-in' | 'onboarding';
  tags: string[];
  attendees: string[];
  summary?: MeetingSummary;
  transcriptId?: string;
  prepDocId?: string;
  agendaItems?: AgendaItem[];
  tasks?: Task[];
}

export interface MeetingSummary {
  overview: string;
  keyDecisions: string[];
  actionItems: string[];
  clientSentiment: 'positive' | 'neutral' | 'concerned';
  followUpDate?: string;
}

export interface TranscriptEntry {
  speaker: string;
  timestamp: string;
  text: string;
}

export interface Transcript {
  id: string;
  meetingId: string;
  entries: TranscriptEntry[];
}

export interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  notes?: string;
  completed?: boolean;
}

export interface Email {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  draftReply?: DraftReply;
  type: 'inbound' | 'follow-up';
  meetingId?: string;
}

export interface DraftReply {
  subject: string;
  body: string;
  tone: 'professional' | 'warm' | 'urgent';
  status: 'draft' | 'approved' | 'sent';
}

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  meetingId?: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignee: 'planner' | 'client' | 'team';
  category: string;
}

export interface PrepDoc {
  id: string;
  meetingId: string;
  clientId: string;
  overview: string;
  conversationStarters: string[];
  suggestedAgenda: AgendaItem[];
  clientTasks: Task[];
  plannerTasks: Task[];
  recentActivity: string[];
  financialSnapshot: {
    totalAssets: number;
    ytdReturn: number;
    portfolioChange: number;
    keyMetrics: { label: string; value: string }[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatQuery {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DemoStep {
  id: number;
  phase: number;
  title: string;
  description: string;
  route: string;
  manualTime: number;
  aiTime: number;
  highlight?: string;
  action?: string;
}

export interface DemoPhase {
  id: number;
  title: string;
  description: string;
  steps: DemoStep[];
}

export type FeedItem =
  | { type: 'meeting'; data: Meeting }
  | { type: 'email'; data: Email };
