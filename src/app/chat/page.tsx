'use client';

import { useState } from 'react';
import ChatInterface from '../../components/chat/ChatInterface';
import IntegrationsPanel from '../../components/chat/IntegrationsPanel';

export default function ChatPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="flex-1 min-w-0">
        <ChatInterface onActiveTool={setActiveTool} />
      </div>
      <IntegrationsPanel activeTool={activeTool} />
    </div>
  );
}
