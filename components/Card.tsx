import React from 'react';
import { TarotCard } from '../types';

interface CardProps {
  card?: TarotCard;
  isReversed?: boolean;
  isRevealed: boolean;
  onClick?: () => void;
  index: number;
}

export const Card: React.FC<CardProps> = ({ card, isReversed, isRevealed, onClick, index }) => {
  return (
    <div 
      className={`relative w-32 h-52 sm:w-40 sm:h-64 perspective-1000 group ${!isRevealed ? 'cursor-pointer hover:-translate-y-2' : ''} transition-all duration-300`}
      onClick={onClick}
    >
      <div 
        className={`w-full h-full duration-700 transform-style-3d transition-transform ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden rounded-xl border-2 border-mystic-gold/30 shadow-2xl overflow-hidden bg-mystic-800">
           <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 absolute"></div>
           <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-mystic-gold/20 flex items-center justify-center group-hover:border-mystic-gold/60 transition-colors">
                  <div className="w-16 h-16 rounded-full border border-mystic-gold/40 rotate-45 group-hover:border-mystic-gold/80 transition-colors"></div>
              </div>
           </div>
        </div>

        {/* Card Front */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl border-2 border-mystic-gold shadow-mystic-gold/20 shadow-xl overflow-hidden bg-black text-white ${isReversed ? 'rotate-180' : ''}`}
        >
          {card ? (
            <>
              {/* Placeholder "Image" using abstract gradient */}
              <div 
                className="h-3/4 w-full bg-cover bg-center opacity-80 mix-blend-screen"
                style={{ 
                    backgroundImage: `url(https://picsum.photos/seed/${card.imageSeed}/300/500?grayscale&blur=2)`,
                    filter: 'sepia(1) hue-rotate(240deg) saturate(2)'
                }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-mystic-900 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 w-full p-2 text-center h-1/4 flex flex-col justify-center bg-mystic-900/90 border-t border-mystic-gold/30">
                <h3 className="font-serif text-sm sm:text-base font-bold text-mystic-gold">{card.name}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{card.arcana === 'Major Arcana' ? 'Major' : card.suit}</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">?</div>
          )}
        </div>
      </div>
    </div>
  );
};