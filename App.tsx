import React, { useState, useEffect, useCallback } from 'react';
import { GameMenu } from './components/GameMenu';
import { GameScreen } from './components/GameScreen';
import { GameMode, Difficulty, GameState, Question, UserStats } from './types';
import { generateQuestions } from './services/geminiService';
import { setMuted, playClickSound } from './services/soundService';
import { Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.SIMPLIFY);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [isMuted, setIsMutedState] = useState(false);
  
  // Question Queue Management
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<UserStats>({
    score: 0,
    highScore: 0,
    streak: 0,
    correctAnswers: 0,
    totalQuestions: 0
  });

  // Load High Score from LocalStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('ratioMasterHighScore');
    if (savedHighScore) {
      setStats(prev => ({ ...prev, highScore: parseInt(savedHighScore, 10) }));
    }
  }, []);

  // Fetch Questions
  const fetchMoreQuestions = useCallback(async (mode: GameMode, diff: Difficulty) => {
    setLoading(true);
    try {
      const newQuestions = await generateQuestions(mode, diff, 3);
      setQuestionQueue(prev => [...prev, ...newQuestions]);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStartGame = async (mode: GameMode, diff: Difficulty) => {
    playClickSound();
    setGameMode(mode);
    setDifficulty(diff);
    setGameState(GameState.PLAYING);
    // Reset session stats
    setStats(prev => ({ ...prev, score: 0, streak: 0, correctAnswers: 0, totalQuestions: 0 }));
    setQuestionQueue([]);
    setCurrentQuestionIndex(0);
    
    // Initial fetch
    await fetchMoreQuestions(mode, diff);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const points = isCorrect ? (10 + stats.streak * 2) : 0;
    
    setStats(prev => {
      const newScore = prev.score + points;
      const newHighScore = Math.max(newScore, prev.highScore);
      
      // Persist High Score
      if (newHighScore > prev.highScore) {
        localStorage.setItem('ratioMasterHighScore', newHighScore.toString());
      }

      return {
        ...prev,
        score: newScore,
        highScore: newHighScore,
        streak: isCorrect ? prev.streak + 1 : 0,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        totalQuestions: prev.totalQuestions + 1
      };
    });
  };

  const handleNextQuestion = () => {
    playClickSound();
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    // Prefetch if running low
    if (questionQueue.length - nextIndex <= 2 && !loading) {
      fetchMoreQuestions(gameMode, difficulty);
    }
  };

  const handleExit = () => {
    playClickSound();
    setGameState(GameState.MENU);
    setQuestionQueue([]);
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMutedState(newState);
    setMuted(newState);
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
      
      {/* Sound Toggle Button */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 p-3 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-all text-indigo-900 border border-indigo-100"
        title={isMuted ? "Үндү жандыруу" : "Үндү өчүрүү"}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>

      {gameState === GameState.MENU && (
        <GameMenu onStartGame={handleStartGame} highScore={stats.highScore} />
      )}

      {gameState === GameState.PLAYING && (
        <GameScreen
          question={questionQueue[currentQuestionIndex]}
          currentScore={stats.score}
          streak={stats.streak}
          loading={!questionQueue[currentQuestionIndex]}
          onAnswer={handleAnswer}
          onNextQuestion={handleNextQuestion}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default App;