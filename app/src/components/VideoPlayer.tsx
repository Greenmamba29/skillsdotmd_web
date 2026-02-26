'use client';

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

  if (isYouTube) {
    // Extract video ID
    const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^&?]+)/);
    const videoId = match ? match[1] : '';
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
        {title && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
          </div>
        )}
        <div className="relative pb-[56.25%] h-0">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title || 'Skill Demo'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {title && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
        </div>
      )}
      <video src={url} controls className="w-full" />
    </div>
  );
}
