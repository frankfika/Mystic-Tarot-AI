import React, { useState, useEffect, useRef } from 'react';
import { Card } from './components/Card';
import { LoadingOrb } from './components/LoadingOrb';
import { FULL_DECK, SPREADS } from './constants';
import { AppState, ReadingResult, Spread, TarotCard } from './types';
import { getTarotInterpretation } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

// Fisher-Yates shuffle
const shuffleDeck = (deck: TarotCard[]): TarotCard[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [readingResults, setReadingResults] = useState<ReadingResult[]>([]);
  const [interpretation, setInterpretation] = useState<string>('');
  
  // Track revealed status for each card position by index
  const [revealedStatus, setRevealedStatus] = useState<boolean[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial deck prep
    setDeck(FULL_DECK);
  }, []);

  useEffect(() => {
    if (interpretation && resultsRef.current) {
         setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
    }
  }, [interpretation]);

  const handleStart = () => {
    setAppState(AppState.INPUT);
  };

  const handleSpreadSelect = (spread: Spread) => {
    if (!question.trim()) {
      alert("Please meditate on your question first.");
      return;
    }
    setSelectedSpread(spread);
    setAppState(AppState.SHUFFLE);
    
    // Simulate shuffle delay
    setTimeout(() => {
        const shuffled = shuffleDeck(FULL_DECK);
        setDeck(shuffled);
        prepareReading(shuffled, spread);
    }, 2000);
  };

  const prepareReading = (shuffledDeck: TarotCard[], spread: Spread) => {
    // Draw cards based on spread count
    const drawn = shuffledDeck.slice(0, spread.cardCount).map((card, index) => ({
        card,
        position: spread.positions[index],
        // 20% chance of reversal
        isReversed: Math.random() < 0.2
    }));
    setReadingResults(drawn);
    // Initialize all cards as unrevealed
    setRevealedStatus(new Array(drawn.length).fill(false));
    setAppState(AppState.REVEAL);
  };

  const handleRevealCard = (index: number) => {
    // If already revealed or reading is in progress, ignore
    if (revealedStatus[index] || appState === AppState.READING) return;

    // Reveal this card
    const newStatus = [...revealedStatus];
    newStatus[index] = true;
    setRevealedStatus(newStatus);

    // Check if all cards are now revealed
    if (newStatus.every(s => s)) {
        // Allow a small delay for the user to see the last card before loading
        setTimeout(() => {
            fetchInterpretation(newStatus); 
        }, 800);
    }
  };

  const fetchInterpretation = async (currentStatus?: boolean[]) => {
    if (!selectedSpread || readingResults.length === 0) return;
    
    // Safety check ensuring all are revealed
    const statusToCheck = currentStatus || revealedStatus;
    if (!statusToCheck.every(s => s)) return;

    setAppState(AppState.READING); // Show loading
    try {
        const text = await getTarotInterpretation(question, selectedSpread, readingResults);
        setInterpretation(text);
        // State remains READING until we have text, then we can treat it as 'done' visually
        // but we keep AppState.READING or switch to a 'RESULT' state. 
        // For simplicity, we just keep using Reading state but render differently based on data presence.
    } catch (e) {
        setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.WELCOME);
    setQuestion('');
    setSelectedSpread(null);
    setReadingResults([]);
    setInterpretation('');
    setRevealedStatus([]);
  };

  // --- Render Helpers ---

  const renderWelcome = () => (
    <div className="text-center space-y-8 animate-float">
      <h1 className="text-6xl md:text-8xl font-serif text-mystic-gold drop-shadow-lg tracking-wider">TAROT AI</h1>
      <p className="text-xl md:text-2xl text-mystic-purple/80 font-sans max-w-lg mx-auto">
        Reveal the mysteries of your path through the ancient wisdom of Tarot, illuminated by artificial intelligence.
      </p>
      <button 
        onClick={handleStart}
        className="px-8 py-3 bg-transparent border border-mystic-gold text-mystic-gold font-serif text-xl rounded-full hover:bg-mystic-gold hover:text-mystic-900 transition-all duration-300 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
      >
        Enter the Sanctuary
      </button>
    </div>
  );

  const renderInput = () => (
    <div className="w-full max-w-2xl mx-auto space-y-8 px-4 fade-in">
        <div className="text-center">
             <h2 className="text-3xl font-serif text-white mb-2">Meditate on your Question</h2>
             <p className="text-gray-400">Focus your energy. The cards respond to your intent.</p>
        </div>
        
        <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What should I know about my career? Will I find love?"
            className="w-full bg-mystic-800/50 border-b-2 border-mystic-gold/50 p-4 text-center text-xl text-white placeholder-gray-500 focus:outline-none focus:border-mystic-gold transition-colors font-serif"
        />

        {question.length > 3 && (
            <div className="space-y-6 animate-pulse-slow">
                <h3 className="text-center text-xl font-serif text-mystic-gold mt-8">Choose your Spread</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SPREADS.map(spread => (
                        <button 
                            key={spread.id}
                            onClick={() => handleSpreadSelect(spread)}
                            className="p-6 bg-mystic-700/50 border border-mystic-700 hover:border-mystic-gold rounded-lg transition-all hover:-translate-y-1 hover:shadow-xl group text-left"
                        >
                            <h4 className="text-lg font-bold text-mystic-gold group-hover:text-white mb-2">{spread.name}</h4>
                            <p className="text-sm text-gray-400">{spread.description}</p>
                            <div className="mt-4 text-xs text-mystic-purple">{spread.cardCount} Cards</div>
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );

  const renderShuffle = () => (
    <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative w-40 h-64">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute top-0 left-0 w-full h-full bg-mystic-800 border-2 border-mystic-gold rounded-xl shadow-xl"
                    style={{ 
                        transform: `rotate(${Math.random() * 10 - 5}deg) translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
                        zIndex: 5-i,
                        animation: `pulse 0.5s infinite alternate ${i * 0.1}s`
                    }}
                >
                     <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                </div>
            ))}
        </div>
        <p className="text-2xl font-serif text-mystic-gold animate-pulse">Shuffling the Deck...</p>
    </div>
  );

  const renderCardsSection = () => (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center min-h-[40vh]">
        <h2 className="text-3xl font-serif text-mystic-gold mb-8 text-center">
            {selectedSpread?.name}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
            {readingResults.map((result, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-4">
                     <div className="relative">
                        {/* Label above card */}
                        <div className="text-sm text-mystic-purple uppercase tracking-wider mb-2 text-center h-6">
                            {result.position.name}
                        </div>
                        
                        <Card 
                            index={idx}
                            card={result.card}
                            isReversed={result.isReversed}
                            isRevealed={revealedStatus[idx]}
                            onClick={() => handleRevealCard(idx)}
                        />
                     </div>
                </div>
            ))}
        </div>

        {/* Instructions if not all revealed */}
        {appState === AppState.REVEAL && !revealedStatus.every(s => s) && (
             <p className="text-white/60 animate-pulse font-serif">Select a card to reveal its meaning</p>
        )}
    </div>
  );

  const renderInterpretationSection = () => {
      // Don't render anything if we are just revealing cards and haven't started reading/erroring
      if (appState === AppState.REVEAL) return null;

      return (
        <div ref={resultsRef} className="w-full max-w-3xl bg-mystic-800/80 backdrop-blur-md p-8 md:p-12 rounded-lg border border-mystic-gold/20 shadow-2xl mt-8 mb-20">
            {appState === AppState.READING && !interpretation ? (
                <LoadingOrb />
            ) : appState === AppState.ERROR ? (
                <div className="text-center text-red-400">
                    <p>The cosmic connection was interrupted.</p>
                    <button onClick={() => fetchInterpretation()} className="mt-4 underline hover:text-white">Retry Connection</button>
                </div>
            ) : (
                <div className="prose prose-invert prose-gold max-w-none fade-in">
                     <h3 className="font-serif text-3xl text-center text-mystic-gold mb-8 border-b border-mystic-gold/30 pb-4">The Oracle Speaks</h3>
                     <div className="markdown-content font-sans text-lg leading-relaxed text-gray-200">
                        <ReactMarkdown 
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-2xl font-serif text-mystic-gold mt-6 mb-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-serif text-mystic-purple mt-6 mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-mystic-gold font-normal" {...props} />
                          }}
                        >
                            {interpretation}
                        </ReactMarkdown>
                     </div>
                     
                     <div className="mt-12 flex justify-center">
                        <button 
                            onClick={handleReset}
                            className="px-8 py-3 bg-mystic-900 border border-mystic-gold text-mystic-gold font-serif rounded hover:bg-mystic-gold hover:text-black transition-colors"
                        >
                            Ask Another Question
                        </button>
                     </div>
                </div>
            )}
         </div>
      );
  };

  const renderReadingState = () => (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center">
         {renderCardsSection()}
         {renderInterpretationSection()}
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
       {/* Background Elements */}
       <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(48,43,99,0.4)_0%,rgba(15,12,41,1)_100%)]"></div>
       </div>

       {/* Main Content */}
       <div className="relative z-10 flex-grow flex items-center justify-center py-10">
          {appState === AppState.WELCOME && renderWelcome()}
          {appState === AppState.INPUT && renderInput()}
          {appState === AppState.SHUFFLE && renderShuffle()}
          {(appState === AppState.REVEAL || appState === AppState.READING || appState === AppState.ERROR) && renderReadingState()}
       </div>

       {/* Footer */}
       <footer className="relative z-10 text-center py-4 text-mystic-purple/40 text-sm">
          <p>© 2024 Mystic Tarot AI • Not a substitute for professional advice</p>
       </footer>
    </div>
  );
};

export default App;