import React, { useState } from 'react';
import { Loader, Sparkles, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface GeminiReaderProps {
  documentId: number;
  documentTitle: string;
  onRead: (mode: string) => Promise<any>;
}

export const GeminiReader: React.FC<GeminiReaderProps> = ({ 
  documentId, 
  documentTitle, 
  onRead 
}) => {
  const [selectedMode, setSelectedMode] = useState<'summary' | 'explain' | 'key_points' | 'quiz'>('summary');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const modes = [
    { id: 'summary', label: 'Summary', description: 'Brief overview of content' },
    { id: 'explain', label: 'Explain', description: 'Detailed explanation' },
    { id: 'key_points', label: 'Key Points', description: 'Main ideas and takeaways' },
    { id: 'quiz', label: 'Quiz', description: 'Test your understanding' },
  ];

  const handleRead = async () => {
    try {
      setLoading(true);
      setContent('');
      toast.loading('Gemini is reading your document...', { id: 'gemini-read' });
      
      const result = await onRead(selectedMode);
      
      if (result.content) {
        setContent(result.content);
        toast.success('Document read successfully!', { id: 'gemini-read' });
      } else {
        throw new Error('No content received');
      }
    } catch (error: any) {
      console.error('Failed to read document:', error);
      const message = error.response?.data?.error || 'Failed to read document with Gemini';
      toast.error(message, { id: 'gemini-read' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gemini Reader</h2>
          <p className="text-sm text-gray-600">AI-powered document understanding</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <p className="text-sm font-semibold text-gray-700 mb-4">Select Reading Mode:</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id as any)}
              disabled={loading}
              className={`p-4 rounded-lg transition-all text-left ${
                selectedMode === mode.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-400'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <p className="font-semibold">{mode.label}</p>
              <p className="text-xs opacity-80">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Read Button */}
      <button
        onClick={handleRead}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={20} />
            <span>Reading with Gemini...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>Read Document with Gemini</span>
          </>
        )}
      </button>

      {/* Content Display */}
      {content && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Gemini Response</h3>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-lg">
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-xs text-gray-600">Words</p>
              <p className="text-2xl font-bold text-blue-600">
                {content.split(/\s+/).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-xs text-gray-600">Characters</p>
              <p className="text-2xl font-bold text-purple-600">
                {content.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
              <p className="text-xs text-gray-600">Mode</p>
              <p className="text-lg font-bold text-pink-600 capitalize">
                {selectedMode.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!content && !loading && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <Sparkles className="mx-auto text-gray-400 mb-3" size={40} />
          <p className="text-gray-600 mb-2">Click "Read Document with Gemini" to start</p>
          <p className="text-sm text-gray-500">Gemini will analyze and present the content in your selected format</p>
        </div>
      )}
    </div>
  );
};
