'use client';

interface SplineViewerProps {
  sceneUrl?: string;
  height?: string;
}

export default function SplineViewer({ sceneUrl, height = '400px' }: SplineViewerProps) {
  if (!sceneUrl) {
    return (
      <div
        className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-brand-500/5 to-purple-500/5 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-8">
          <div className="text-4xl mb-3">&#x1F300;</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            3D Skill Visualizer
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Connect your Spline.design scene to visualize skills in 3D.
            Build interactive prompt editors with drag-and-drop YAML fields.
          </p>
          <div className="mt-4 p-3 rounded bg-gray-100 dark:bg-gray-800 text-left max-w-sm mx-auto">
            <p className="text-xs font-mono text-gray-600 dark:text-gray-300">
              {'<SplineViewer sceneUrl='}<br />
              {'  "https://prod.spline.design/...'}<br />
              {'  /scene.splinecode"'}<br />
              {'/>'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden" style={{ height }}>
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <script type="module" src="https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js"></script>
            <spline-viewer url="${sceneUrl}" style="width:100%;height:100%"></spline-viewer>
          `,
        }}
      />
    </div>
  );
}
