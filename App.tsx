import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import Workspace from './components/Workspace';
import { ImageState } from './types';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null,
    mimeType: null,
  });

  const handleImageSelected = (newImageState: ImageState) => {
    setImageState(newImageState);
  };

  const handleReset = () => {
    setImageState({
      file: null,
      previewUrl: null,
      base64: null,
      mimeType: null,
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-slate-200">
      <Header />
      
      <main className="container mx-auto pb-12 px-4">
        {!imageState.file ? (
          <div className="animate-in fade-in zoom-in duration-500">
             <div className="text-center pt-16 pb-8">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                TRANSFORM YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 neon-text">
                  FITNESS CONTENT
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Use AI to style, edit, and energize your workout photos. 
                Designed for high-impact social media visuals.
              </p>
            </div>
            <ImageUpload onImageSelected={handleImageSelected} />
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <Workspace originalImage={imageState} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} FitMinute AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
