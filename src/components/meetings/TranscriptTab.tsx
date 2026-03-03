'use client';

import { useState } from 'react';
import { Transcript } from '../../lib/types';

export default function TranscriptTab({ transcript }: { transcript: Transcript }) {
  const [search, setSearch] = useState('');

  const filteredEntries = transcript.entries.filter((entry) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return entry.text.toLowerCase().includes(q) || entry.speaker.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search transcript..."
        className="w-full border-b border-border bg-transparent py-2 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
      />
      {search && (
        <p className="text-xs text-ink-faint">
          {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Entries */}
      <div className="max-h-[600px] overflow-y-auto space-y-0">
        {filteredEntries.length === 0 ? (
          <p className="py-8 text-sm text-ink-faint">No matching transcript entries found.</p>
        ) : (
          filteredEntries.map((entry, i) => (
            <div key={i} className="border-b border-border-faint py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-ink">{entry.speaker}</span>
                <span className="text-xs text-ink-faint">{entry.timestamp}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{entry.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
