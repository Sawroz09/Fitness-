import React, { useRef } from 'react';
import { ImageState } from '../types';

interface ImageUploadProps {
  onImageSelected: (imageState: ImageState) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageSelected({
        file,
        previewUrl: result,
        base64: result, // This includes the data:image/... prefix
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 p-1">
      <div 
        className="relative group cursor-pointer border-2 border-dashed border-gray-700 hover:border-fuchsia-500 rounded-2xl bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 h-96 flex flex-col items-center justify-center overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Animated background element */}
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5 group-hover:from-fuchsia-500/10 group-hover:to-cyan-500/10 transition-colors" />
        
        <div className="z-10 flex flex-col items-center gap-4 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:border-cyan-400 neon-border">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 group-hover:text-cyan-400 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Source Image</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Drop your fitness photo here or click to browse. Supported: JPG, PNG, WEBP.
            </p>
          </div>
          <button className="mt-4 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all text-sm font-semibold uppercase tracking-wider">
            Select File
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest">Powered by Google Gemini 2.5</p>
      </div>
    </div>
  );
};

export default ImageUpload;
