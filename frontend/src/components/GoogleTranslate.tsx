'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('google-translate-script')) return;

    // Add callback
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,or,pa,as,ml,sa', // English + major Indian languages
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    // Add script tag
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] opacity-90 hover:opacity-100 transition-opacity translate-style-wrapper group">
      <div 
        id="google_translate_element" 
        className="bg-slate-900 border border-white/20 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center p-1"
      ></div>
      <style dangerouslySetInnerHTML={{__html: `
        .translate-style-wrapper .goog-te-gadget {
          font-family: inherit;
          color: transparent;
          white-space: nowrap;
        }
        .translate-style-wrapper .goog-te-gadget .goog-te-combo {
          margin: 0;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          background-color: #0f172a;
          color: white;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          cursor: pointer;
        }
        .translate-style-wrapper .goog-te-gadget span {
          display: none;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }
      `}} />
    </div>
  );
}

// Add TypeScript declaration for window
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}
