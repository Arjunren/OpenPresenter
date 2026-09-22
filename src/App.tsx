import { useEffect, useState } from 'react';
import { UploadZone } from './components/upload/UploadZone';
import { LoadingPresentation } from './components/upload/LoadingPresentation';
import { validatePptxFile } from './utils/fileValidation';
import { PptxParser } from './pptx/PptxParser';
import type { Presentation } from './models/Presentation';
import { PresentationWorkspace } from './components/presentation/PresentationWorkspace';
import { PresentationMode } from './components/presentation/PresentationMode';

function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    return () => {
      if (!presentation) return;
      for (const slide of presentation.slides) {
        for (const element of slide.elements) {
          if (
            element.type === 'image'
            && 'url' in element
            && typeof element.url === 'string'
            && element.url.startsWith('blob:')
          ) {
            URL.revokeObjectURL(element.url);
          }
        }
      }
    };
  }, [presentation]);

  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      await validatePptxFile(file);
      setLoadingStage('Initializing parser...');
      
      const parsedPresentation = await PptxParser.parse(file, (stage) => {
        setLoadingStage(stage);
      });

      setPresentation(parsedPresentation);
      setLoadingStage(null);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred while processing the file.';
      setError(message);
      setLoadingStage(null);
    }
  };

  const handlePresent = () => {
    setIsPresenting(true);
  };

  const handleExitPresent = () => {
    setIsPresenting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 h-screen overflow-hidden">
      
      {/* Show header and footer only if NOT presenting and NOT in workspace */}
      {!presentation && !isPresenting && (
        <header className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-600">OpenPresenter</h1>
            <p className="text-sm text-slate-500 font-medium">Present anywhere. No PowerPoint required.</p>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden w-full h-full">
        {!presentation && !loadingStage && !error && (
          <div className="p-6 w-full flex justify-center">
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
        )}

        {loadingStage && (
          <div className="p-6">
             <LoadingPresentation stage={loadingStage} />
          </div>
        )}

        {error && !loadingStage && (
          <div className="p-6 w-full flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-700">
                <h3 className="text-lg font-bold mb-2">Failed to open presentation</h3>
                <p>{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-6 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-lg transition-colors"
                >
                  Try another file
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Render Workspace if presentation is parsed and not in full presentation mode */}
        {presentation && !isPresenting && (
          <PresentationWorkspace 
            presentation={presentation} 
            onPresent={handlePresent} 
          />
        )}

        {/* Render Full Presentation Mode */}
        {presentation && isPresenting && (
          <PresentationMode 
            presentation={presentation} 
            onExit={handleExitPresent} 
          />
        )}
      </main>

      {/* Footer */}
      {!presentation && !isPresenting && (
        <footer className="px-6 py-6 border-t border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3 shrink-0">
          <p className="text-slate-600 text-sm font-medium">
            OpenPresenter — Open Source Project by <span className="font-semibold text-slate-800">Arjun Renvon</span>
          </p>
          <a
            href="https://github.com/Arjunren"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-2"
            aria-label="Arjun Renvon on GitHub"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={isHovered ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </footer>
      )}
    </div>
  );
}

export default App;
