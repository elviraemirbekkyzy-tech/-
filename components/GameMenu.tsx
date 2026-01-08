import React from 'react';
import { GameMode, Difficulty } from '../types';
import { Button } from './Button';
import { Brain, Calculator, Divide, RefreshCw, Trophy } from 'lucide-react';
import { playClickSound } from '../services/soundService';

interface GameMenuProps {
  onStartGame: (mode: GameMode, difficulty: Difficulty) => void;
  highScore: number;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onStartGame, highScore }) => {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>(Difficulty.EASY);

  const handleDifficultySelect = (diff: Difficulty) => {
    playClickSound();
    setSelectedDifficulty(diff);
  };

  const modes = [
    { 
      id: GameMode.SIMPLIFY, 
      label: 'Жөнөкөйлөтүү', 
      desc: 'Катыштарды кыскарткыла', 
      icon: <Divide className="w-8 h-8" />,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      id: GameMode.FIND_X, 
      label: 'X-ти тап', 
      desc: 'Белгисиз мүчөнү тапкыла', 
      icon: <Calculator className="w-8 h-8" />,
      color: 'bg-green-100 text-green-600'
    },
    { 
      id: GameMode.WORD_PROBLEM, 
      label: 'Маселелер', 
      desc: 'Тексттик маселелерди чечүү', 
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      id: GameMode.MIXED, 
      label: 'Аралаш', 
      desc: 'Бардык түрдөгү суроолор', 
      icon: <RefreshCw className="w-8 h-8" />,
      color: 'bg-orange-100 text-orange-600'
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 tracking-tight">
          Катыш Чебери
        </h1>
        <p className="text-lg text-gray-600">Математикалык жөндөмүңдү сынап көр!</p>
        
        <div className="mt-6 inline-flex items-center bg-yellow-100 px-4 py-2 rounded-full text-yellow-800 font-bold border border-yellow-200">
          <Trophy className="w-5 h-5 mr-2" />
          Рекорд: {highScore} упай
        </div>
      </div>

      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-gray-700 font-bold mb-4 text-center">Кыйынчылык деңгээли:</h3>
        <div className="flex justify-center gap-2 md:gap-4">
          {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultySelect(diff)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDifficulty === diff 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {diff === Difficulty.EASY ? 'Оңой' : diff === Difficulty.MEDIUM ? 'Орто' : 'Кыйын'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onStartGame(mode.id, selectedDifficulty)}
            className="flex items-center p-6 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-500 transition-all hover:shadow-md group text-left"
          >
            <div className={`p-4 rounded-xl mr-4 ${mode.color} group-hover:scale-110 transition-transform`}>
              {mode.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{mode.label}</h3>
              <p className="text-sm text-gray-500">{mode.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};