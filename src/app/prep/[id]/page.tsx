import { prepDocs } from '../../../data/prep-docs';
import { meetings } from '../../../data/meetings';
import PrepPageClient from './PrepPageClient';
import { notFound } from 'next/navigation';

interface PrepPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrepPage({ params }: PrepPageProps) {
  const { id } = await params;

  const meeting = meetings.find((m) => m.id === id);
  if (!meeting) return notFound();

  const prepDoc = prepDocs.find((p) => p.meetingId === id);
  if (!prepDoc) return notFound();

  return <PrepPageClient meeting={meeting} prepDoc={prepDoc} />;
}
