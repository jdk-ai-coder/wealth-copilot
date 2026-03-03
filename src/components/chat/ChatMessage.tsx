'use client';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  };
}

function formatContent(content: string) {
  return content.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={j} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
    return (
      <span key={i}>
        {parts}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
          isUser ? 'bg-ink text-white' : 'border border-border text-ink-muted'
        }`}
      >
        {isUser ? 'SM' : 'M'}
      </div>

      {/* Message */}
      <div className={`max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-ink text-white'
              : 'border border-border-faint text-ink'
          }`}
        >
          {formatContent(message.content)}
        </div>
        <p className={`text-[11px] text-ink-faint px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}
