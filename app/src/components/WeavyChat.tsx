'use client';

interface WeavyChatProps {
  spaceKey: string;
}

export default function WeavyChat({ spaceKey }: WeavyChatProps) {
  const weavyUrl = process.env.NEXT_PUBLIC_WEAVY_URL;
  const hasWeavy = weavyUrl && weavyUrl !== 'https://your-weavy-server.com';

  if (!hasWeavy) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Team Collaboration</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Real-time chat, comments, and file sharing powered by Weavy.
        </p>
        <div className="p-8 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
          <div className="text-3xl mb-2">&#x1F4AC;</div>
          <p className="text-sm text-gray-500">
            Configure your Weavy server URL in environment variables to enable collaboration.
          </p>
          <p className="text-xs text-gray-400 mt-2">Space: {spaceKey}</p>
          <div className="mt-4 p-3 rounded bg-gray-100 dark:bg-gray-700 text-left">
            <p className="text-xs font-mono text-gray-600 dark:text-gray-300">
              WEAVY_URL=https://your-server.weavy.io<br />
              WEAVY_API_KEY=your-api-key
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discussion</h3>
      </div>
      <div className="h-96">
        {/* Weavy Web Component - loads when Weavy JS is available */}
        <div
          dangerouslySetInnerHTML={{
            __html: `<wy-chat space-key="${spaceKey}"></wy-chat>`,
          }}
        />
      </div>
    </div>
  );
}
