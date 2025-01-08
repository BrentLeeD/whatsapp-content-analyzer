import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, ScrollText, Book, Type, Layout } from 'lucide-react';

const WhatsAppAnalyzer = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeContent = () => {
    if (!text.trim()) {
      setAnalysis(null);
      return;
    }

    // Remove formatting symbols for true character count
    const cleanText = text.replace(/[\*_~]/g, '');
    const characterCount = cleanText.length;
    
    // Content structure analysis
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const words = cleanText.match(/\b\w+\b/g) || [];
    
    // Calculate reading metrics
    const syllableCount = words.reduce((count, word) => {
      return count + countSyllables(word.toLowerCase());
    }, 0);
    
    const fleschKincaid = calculateFleschKincaid(words.length, paragraphs.length, syllableCount);
    const cefr = estimateCEFR(fleschKincaid);

    // Format analysis
    const formatting = {
      bold: (text.match(/\*(.*?)\*/g) || []).length,
      italics: (text.match(/_(.*?)_/g) || []).length,
      bulletPoints: (text.match(/^[•\-\*]\s/gm) || []).length,
    };

    // Media and engagement elements
    const emojiCount = (text.match(/[\p{Emoji}]/gu) || []).length;
    const urls = (text.match(/https?:\/\/[^\s]+/g) || []);
    const hashtags = (text.match(/#[^\s#]+/g) || []);

    // Length classification
    const getLengthCategory = (chars) => {
      if (chars <= 500) return { category: 'Concise', color: 'text-green-600' };
      if (chars <= 700) return { category: 'Golden', color: 'text-green-600' };
      if (chars <= 900) return { category: 'Extended', color: 'text-yellow-600' };
      if (chars <= 1100) return { category: 'Long', color: 'text-orange-600' };
      return { category: 'Very Long', color: 'text-red-600' };
    };

    setAnalysis({
      characterCount,
      lineCount: lines.length,
      paragraphCount: paragraphs.length,
      wordCount: words.length,
      formatting,
      emojiCount,
      urlCount: urls.length,
      hashtagCount: hashtags.length,
      lengthCategory: getLengthCategory(characterCount),
      truncationRisk: lines.length > 8 ? 'High' : 'Low',
      readability: {
        fleschKincaid: Math.round(fleschKincaid * 10) / 10,
        cefr,
        averageWordsPerParagraph: Math.round(words.length / paragraphs.length)
      }
    });
  };

  const countSyllables = (word) => {
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const calculateFleschKincaid = (words, sentences, syllables) => {
    if (sentences === 0) return 0;
    return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  };

  const estimateCEFR = (fleschKincaid) => {
    if (fleschKincaid <= 3) return 'A1';
    if (fleschKincaid <= 5) return 'A2';
    if (fleschKincaid <= 7) return 'B1';
    if (fleschKincaid <= 10) return 'B2';
    if (fleschKincaid <= 13) return 'C1';
    return 'C2';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-green-600" />
            WhatsApp Content Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-48 p-4 border rounded-md mb-4 font-mono text-gray-800"
            placeholder="Paste your WhatsApp content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={analyzeContent}
          >
            Analyze
          </button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Summary Box */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Length Category</p>
                  <p className={`text-lg font-semibold ${analysis.lengthCategory.color}`}>
                    {analysis.lengthCategory.category}
                  </p>
                  <p className="text-xs text-gray-500">{analysis.characterCount} characters</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Truncation Risk</p>
                  <p className={`text-lg font-semibold ${
                    analysis.truncationRisk === 'High' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {analysis.truncationRisk}
                  </p>
                  <p className="text-xs text-gray-500">{analysis.lineCount} lines</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Reading Level</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {analysis.readability.cefr}
                  </p>
                  <p className="text-xs text-gray-500">CEFR Scale</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Structure</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {analysis.paragraphCount} paragraphs
                  </p>
                  <p className="text-xs text-gray-500">
                    ~{analysis.readability.averageWordsPerParagraph} words each
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Content Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Formatting Used:</p>
                    <div className="flex gap-4 mt-1">
                      <span>Bold: {analysis.formatting.bold}</span>
                      <span>Italic: {analysis.formatting.italics}</span>
                      <span>Bullets: {analysis.formatting.bulletPoints}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rich Elements:</p>
                    <div className="flex gap-4 mt-1">
                      <span>Emojis: {analysis.emojiCount}</span>
                      <span>Links: {analysis.urlCount}</span>
                      <span>Hashtags: {analysis.hashtagCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Readability Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Grade Level:</p>
                    <p>Flesch-Kincaid: {analysis.readability.fleschKincaid}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">CEFR Level Explained:</p>
                    <p className="text-sm text-gray-600">
                      {analysis.readability.cefr === 'B2' ? 
                        'Upper Intermediate - suitable for most WhatsApp users' :
                        analysis.readability.cefr === 'B1' ?
                        'Intermediate - ideal for wide reach' :
                        analysis.readability.cefr === 'C1' || analysis.readability.cefr === 'C2' ?
                        'Advanced - consider simplifying for broader reach' :
                        'Basic - very accessible to most readers'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default WhatsAppAnalyzer;