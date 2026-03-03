'use client';

import Link from 'next/link';
import { Email } from '../../lib/types';
import { classNames, timeAgo } from '../../lib/utils';

const accentColors: Record<Email['priority'], string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-gray-400',
};

const priorityBadge: Record<Email['priority'], string> = {
  high: 'bg-red-50 text-red-700 ring-red-600/20',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  low: 'bg-gray-50 text-gray-600 ring-gray-500/20',
};

const priorityLabel: Record<Email['priority'], string> = {
  high: 'High Priority',
  medium: 'Medium',
  low: 'Low',
};

export default function EmailCard({ email }: { email: Email }) {
  return (
    <div className="group relative flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md">
      {/* Left accent bar */}
      <div className={classNames('w-1.5 shrink-0', accentColors[email.priority])} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Top row: client name + time + priority badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
              {email.clientName}
            </span>
            <span className="text-xs text-gray-400">
              {timeAgo(email.receivedAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {email.type === 'follow-up' && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                Post-meeting follow-up
              </span>
            )}
            <span
              className={classNames(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                priorityBadge[email.priority]
              )}
            >
              {priorityLabel[email.priority]}
            </span>
          </div>
        </div>

        {/* Subject */}
        <div>
          <h3
            className={classNames(
              'text-base leading-tight',
              email.isRead
                ? 'font-medium text-gray-700'
                : 'font-semibold text-gray-900'
            )}
          >
            {email.subject}
          </h3>
        </div>

        {/* Preview text */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {email.preview}
        </p>

        {/* Unread indicator */}
        {!email.isRead && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-blue-600">Unread</span>
          </div>
        )}

        {/* Action button */}
        <div className="mt-1">
          <Link
            href="/follow-up"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3.5 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200 transition-colors hover:bg-gray-100"
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            Review Draft Reply
          </Link>
        </div>
      </div>
    </div>
  );
}
