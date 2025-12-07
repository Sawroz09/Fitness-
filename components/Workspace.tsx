import React, { useState } from 'react';
import { ImageState, AppStatus, GeneratedImage } from '../types';
import { editImageWithGemini } from '../services/geminiService';

interface WorkspaceProps {
  originalImage: ImageState;
  onReset: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ originalImage, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !originalImage.base64 || !originalImage.mimeType) return;

    setStatus(AppStatus.LOADING);
    setErrorMsg(null);

    try {
      const resultBase64 = await editImageWithGemini(
        originalImage.base64,
        originalImage.mimeType,
        prompt
      );

      const mimeType = 'image/png'; // GenAI usually returns PNG for image generation
      const url = `data:${mimeType};base64,${resultBase64}`;
      
      setGeneratedImage({
        base64: resultBase64,
        url: url,
      });
      setStatus(AppStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setErrorMsg(error.message || "Failed to edit image.");
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage.url;
      link.download = `fitminute-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* Top Bar Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700 backdrop-blur-sm sticky top-24 z-40">
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Upload
        </button>

        <div className="flex-1 w-full md:max-w-2xl flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your edit (e.g., 'Make the background a neon gym', 'Add a retro filter')..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={status === AppStatus.LOADING || !prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-purple-900/50 transition-all flex items-center gap-2"
          >
             {status === AppStatus.LOADING ? (
               <>
                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Generating...
               </>
             ) : (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                 </svg>
                 Run Edit
               </>
             )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {errorMsg}
        </div>
      )}

      {/* Main Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Original Image */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider pl-1">Original</h3>
          <div className="relative rounded-2xl overflow-hidden border border-gray-700 bg-gray-800/50 h-[500px] flex items-center justify-center">
            {originalImage.previewUrl ? (
              <img 
                src={originalImage.previewUrl} 
                alt="Original" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-gray-600">
              SOURCE
            </div>
          </div>
        </div>

        {/* Generated Image */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider pl-1 text-right lg:text-left flex justify-between">
            <span>Result</span>
            {generatedImage && (
               <button 
               onClick={handleDownload}
               className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 15V3" />
               </svg>
               Download
             </button>
            )}
          </h3>
          <div className={`relative rounded-2xl overflow-hidden border ${status === AppStatus.SUCCESS ? 'border-cyan-500 shadow-lg shadow-cyan-900/20' : 'border-gray-700'} bg-gray-800/50 h-[500px] flex items-center justify-center transition-all duration-500`}>
            {status === AppStatus.LOADING ? (
               <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-gray-600 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-fuchsia-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-gray-400 animate-pulse text-sm">Gemini is thinking...</p>
               </div>
            ) : generatedImage ? (
              <>
                <img 
                  src={generatedImage.url} 
                  alt="Generated" 
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg shadow-cyan-900/50">
                  GEMINI 2.5
                </div>
              </>
            ) : (
              <div className="text-center p-8 opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mx-auto mb-4 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                <p>Enter a prompt above to see the magic.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sample Prompts */}
      {!generatedImage && status !== AppStatus.LOADING && (
        <div className="mt-4">
          <p className="text-gray-500 text-sm mb-3">Try these prompts:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Add a retro comic book filter",
              "Make the background a futuristic cyberpunk city",
              "Add motion blur to emphasize speed",
              "Change the outfit to metallic gold armor",
              "Turn this into a pencil sketch"
            ].map((p, i) => (
              <button 
                key={i}
                onClick={() => setPrompt(p)}
                className="px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-sm hover:border-fuchsia-500 hover:text-white transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
