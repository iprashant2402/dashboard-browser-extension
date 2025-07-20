import React, { useState } from 'react';
import { IoGameController } from 'react-icons/io5';
import './index.css';
import { PixelSnakeGame } from '../PixelSnakeGame';
import { BreakoutGame } from '../BreakoutGame';

interface GameOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const gameOptions: GameOption[] = [
  {
    id: 'snake',
    name: 'Pixel Snake',
    description: 'Classic snake game with modern pixel art',
    icon: <IoGameController size={24} />,
    route: '/games/snake'
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Break all the bricks with your paddle',
    icon: <IoGameController size={24} />,
    route: '/games/breakout'
  }
];

export const GameSelector: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameOption | null>(null);

  const handleGameSelect = (game: GameOption) => {
    setSelectedGame(game);
  };

  if(selectedGame) {
    switch(selectedGame.id) {
      case 'snake':
        return <PixelSnakeGame onBack={() => setSelectedGame(null)} />
      case 'breakout':
        return <BreakoutGame onBack={() => setSelectedGame(null)} />
    }
  }

  return (
    <div className="game-selector">
      <div className="game-list">
        <div className="game-list-header">
          <div className="game-list-title">
            <h3>Take a mindful <span>break</span></h3>
            <p>Recharge with quick, distraction-free games designed to refresh your focus — not steal your time.</p>
          </div>
        </div>
        {gameOptions.map((game) => (
          <div 
            key={game.id} 
            className="game-option"
            onClick={() => handleGameSelect(game)}
          >
            <div className="game-option-icon">
              {game.icon}
            </div>
            <div className="game-option-content">
              <h4 className="game-option-title">{game.name}</h4>
              <p className="game-option-description">{game.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 