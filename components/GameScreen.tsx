import React, { useState, useEffect } from 'react';
import { Question, GameMode } from '../types';
import { Button } from './Button';
import { CheckCircle2, XCircle, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../services/soundService';

interface GameScreenProps {
  question: Question;
  currentScore: number;
  streak: number;
  loading: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  question,
  currentScore,
  streak,
  loading,
  onAnswer,
  onNextQuestion,
  onExit
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question]);

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    playClickSound();
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    
    const isCorrect = selectedOption === question.correctAnswer;
    setIsSubmitted(true);
    
    if (isCorrect) {
      playCorrectSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B']
      });
    } else {
      playIncorrectSound();
    }

    onAnswer(isCorrect);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-800 font-medium animate-pulse">Жаңы суроо даярдалууда...</p>
      </div>
    );
  }

  const isCorrect = selectedOption === question.correctAnswer;
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <button onClick={onExit} className="text-gray-400 hover:text-gray-600 transition-colors">
          <Home className="w-6 h-6" />
        </button>
        <div className="flex gap-4">
           <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold">Упай</span>
              <span className="text-xl font-black text-indigo-600">{currentScore}</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold">Серия</span>
              <span className="text-xl font-black text-orange-500">🔥 {streak}</span>
           </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border-b-4 border-gray-200 p-6 md:p-8 mb-6">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-4">
          {question.type === GameMode.WORD_PROBLEM ? 'Маселе' : 
           question.type === GameMode.FIND_X ? 'X-ти тап' : 'Жөнөкөйлөтүү'}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          {question.text}
        </h2>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.options.map((option, idx) => {
          let buttonStyle = "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200";
          let badgeStyle = "bg-gray-100 text-gray-500";
          
          if (isSubmitted) {
            if (option === question.correctAnswer) {
              buttonStyle = "bg-green-100 text-green-800 border-2 border-green-500";
              badgeStyle = "bg-green-200 text-green-700";
            } else if (option === selectedOption) {
              buttonStyle = "bg-red-100 text-red-800 border-2 border-red-500";
              badgeStyle = "bg-red-200 text-red-700";
            } else {
              buttonStyle = "bg-gray-50 text-gray-400 border-2 border-gray-100 opacity-50";
            }
          } else if (selectedOption === option) {
             buttonStyle = "bg-indigo-50 text-indigo-700 border-2 border-indigo-500 shadow-md";
             badgeStyle = "bg-indigo-200 text-indigo-700";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              disabled={isSubmitted}
              className={`group flex items-center p-3 md:p-4 rounded-xl font-bold text-lg md:text-xl transition-all text-left ${buttonStyle} ${!isSubmitted && 'hover:-translate-y-1'}`}
            >
              <span className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg mr-3 text-sm md:text-base transition-colors ${badgeStyle}`}>
                {optionLabels[idx] || idx + 1}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:bg-transparent md:border-0 md:p-0 z-10">
        {!isSubmitted ? (
          <Button 
            fullWidth 
            onClick={handleSubmit} 
            disabled={!selectedOption}
            className="md:w-auto md:ml-auto md:block md:min-w-[200px]"
          >
            Текшерүү
          </Button>
        ) : (
          <div className="animate-in slide-in-from-bottom duration-300">
            <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" /> : <XCircle className="w-6 h-6 text-red-600 shrink-0" />}
                <div>
                  <h4 className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Туура!' : 'Туура эмес'}
                  </h4>
                  <p className="text-sm mt-1 text-gray-700">{question.explanation}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={onNextQuestion}
              className="md:w-auto md:ml-auto md:block md:min-w-[200px] flex items-center justify-center gap-2"
            >
              Кийинки суроо <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
      {/* Spacer for mobile fixed bottom */}
      <div className="h-24 md:h-0"></div>
    </div>
  );
};