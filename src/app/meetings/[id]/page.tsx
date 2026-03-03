import { notFound } from 'next/navigation';
import { meetings } from '../../../data/meetings';
import { transcripts } from '../../../data/transcripts';
import { tasks } from '../../../data/tasks';
import MeetingDetailClient from './MeetingDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const meeting = meetings.find((m) => m.id === id);
  if (!meeting) {
    notFound();
  }

  // Find transcript if one exists
  const transcript = meeting.transcriptId
    ? transcripts.find((t) => t.id === meeting.transcriptId)
    : undefined;

  // Find tasks associated with this meeting
  const meetingTasks = tasks.filter((t) => t.meetingId === meeting.id);

  return (
    <MeetingDetailClient
      meeting={meeting}
      transcript={transcript}
      meetingTasks={meetingTasks}
    />
  );
}
