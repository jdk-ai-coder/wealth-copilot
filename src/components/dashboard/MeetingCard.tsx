'use client';

import Link from 'next/link';
import { Meeting } from '../../lib/types';
import { classNames, formatTime } from '../../lib/utils';

const accentColors: Record<Meeting['status'], string> = {
  upcoming: 'bg-blue-500',
  'in-progress': 'bg-orange-500',
  completed: 'bg-emerald-500',
};

const statusBadge: Record<Meeting['status'], string> = {
  upcoming: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'in-progress': 'bg-orange-50 text-orange-700 ring-orange-600/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

const statusLabel: Record<Meeting['status'], string> = {
  upcoming: 'Upcoming',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <div className="group relative flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md">
      {/* Left accent bar */}
      <div className={classNames('w-1.5 shrink-0', accentColors[meeting.status])} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Top row: time + status badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
              {meeting.time}
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">
              {formatTime(meeting.duration)}
            </span>
          </div>

          <span
            className={classNames(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
              statusBadge[meeting.status]
            )}
          >
            {statusLabel[meeting.status]}
          </span>
        </div>

        {/* Title + client */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {meeting.title}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">{meeting.clientName}</p>
        </div>

        {/* Tags */}
        {meeting.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {meeting.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row: attendees + duration */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            {meeting.attendees.length} attendee{meeting.attendees.length !== 1 && 's'}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatTime(meeting.duration)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-1 flex gap-2">
          {meeting.status === 'completed' && (
            <Link
              href={`/meetings/${meeting.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              View Summary
            </Link>
          )}
          {meeting.status === 'upcoming' && (
            <Link
              href={`/prep/${meeting.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
              View Meeting Prep
            </Link>
          )}
          {meeting.status === 'in-progress' && (
            <Link
              href={`/meetings/${meeting.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3.5 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                />
              </svg>
              View Meeting
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
