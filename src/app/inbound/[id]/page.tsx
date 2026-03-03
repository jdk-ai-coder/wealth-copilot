import { notFound } from 'next/navigation';
import { leads } from '../../../data/leads';
import LeadDetailClient from './LeadDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    notFound();
  }

  return <LeadDetailClient lead={lead} />;
}
