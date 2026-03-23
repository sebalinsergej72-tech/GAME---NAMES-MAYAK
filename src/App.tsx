/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ChevronRight, Timer, Trophy, Info, BookOpen } from 'lucide-react';
import { characters, Character } from './data';

type GameState = 'START' | 'PLAYING' | 'REVEAL' | 'FINISHED';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });

  const currentCharacter = characters[currentIndex];

  const startGame = () => {
    setGameState('PLAYING');
    setTimeLeft(30);
  };

  const revealAnswer = () => {
    setGameState('REVEAL');
  };

  const nextSlide = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setGameState('PLAYING');
      setTimeLeft(30);
    } else {
      setGameState('FINISHED');
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setGameState('START');
    setScores({ teamA: 0, teamB: 0 });
  };

  const addPoint = (team: 'teamA' | 'teamB') => {
    setScores(prev => ({ ...prev, [team]: prev[team] + 1 }));
    revealAnswer();
  };

  useEffect(() => {
    let timer: number;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'PLAYING') {
      revealAnswer();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 select-none">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 border-r border-b border-olive rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 border-l border-t border-olive rounded-tl-full" />
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-olive tracking-tight">
              Библейские Перемешанки
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 italic">
              Угадайте имя библейского героя за 30 секунд!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <Timer className="w-8 h-8 text-olive mb-4" />
                <h3 className="font-bold mb-2">30 Секунд</h3>
                <p className="text-sm text-gray-500">Время на раздумья ограничено. Будьте быстрее всех!</p>
              </div>
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <Trophy className="w-8 h-8 text-olive mb-4" />
                <h3 className="font-bold mb-2">1 Балл</h3>
                <p className="text-sm text-gray-500">Первый правильно назвавший приносит балл своей команде.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <Info className="w-8 h-8 text-olive mb-4" />
                <h3 className="font-bold mb-2">Интересный факт</h3>
                <p className="text-sm text-gray-500">После каждого ответа — короткая история о герое.</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-olive text-white px-12 py-4 rounded-full text-xl font-medium hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-lg"
            >
              <Play className="w-6 h-6 fill-current" />
              Начать игру
            </button>
          </motion.div>
        )}

        {gameState === 'PLAYING' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-4xl text-center"
          >
            <div className="mb-8 flex justify-between items-center">
              <div className="text-olive font-medium text-lg">
                Вопрос {currentIndex + 1} из {characters.length}
              </div>
              <div className={`flex items-center gap-2 text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-olive'}`}>
                <Timer className="w-6 h-6" />
                {timeLeft}с
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-12 md:p-24 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                <motion.div 
                  className="h-full bg-olive"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 30) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              
              <h2 className="text-7xl md:text-9xl font-bold tracking-[0.2em] text-olive mb-8 uppercase">
                {currentCharacter.scrambled}
              </h2>
              
              <div className="flex justify-center gap-4 mt-12">
                <button
                  onClick={() => addPoint('teamA')}
                  className="px-6 py-2 border border-olive text-olive rounded-full hover:bg-olive hover:text-white transition-colors"
                >
                  Команда А +1
                </button>
                <button
                  onClick={revealAnswer}
                  className="px-8 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Показать ответ
                </button>
                <button
                  onClick={() => addPoint('teamB')}
                  className="px-6 py-2 border border-olive text-olive rounded-full hover:bg-olive hover:text-white transition-colors"
                >
                  Команда Б +1
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'REVEAL' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-gray-100">
              <div className="flex items-center gap-4 text-olive mb-6">
                <BookOpen className="w-6 h-6" />
                <span className="uppercase tracking-widest text-sm font-bold">Правильный ответ</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-bold text-olive mb-8">
                {currentCharacter.name}
              </h2>
              
              <div className="h-px bg-gray-100 w-full mb-8" />
              
              <p className="text-2xl md:text-3xl italic text-gray-700 leading-relaxed mb-12">
                «{currentCharacter.fact}»
              </p>

              <div className="flex justify-between items-center">
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Команда А</div>
                    <div className="text-3xl font-bold text-olive">{scores.teamA}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Команда Б</div>
                    <div className="text-3xl font-bold text-olive">{scores.teamB}</div>
                  </div>
                </div>

                <button
                  onClick={nextSlide}
                  className="bg-olive text-white px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                >
                  {currentIndex < characters.length - 1 ? 'Следующий герой' : 'Завершить игру'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'FINISHED' && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Trophy className="w-24 h-24 text-olive mx-auto mb-8" />
            <h2 className="text-6xl font-bold text-olive mb-4">Игра окончена!</h2>
            <p className="text-2xl text-gray-600 mb-12 italic">Отличная работа! Вы хорошо знаете библейских героев.</p>
            
            <div className="flex justify-center gap-12 mb-12">
              <div className="text-center">
                <div className="text-sm uppercase tracking-widest text-gray-400 mb-2">Команда А</div>
                <div className="text-6xl font-bold text-olive">{scores.teamA}</div>
              </div>
              <div className="text-center">
                <div className="text-sm uppercase tracking-widest text-gray-400 mb-2">Команда Б</div>
                <div className="text-6xl font-bold text-olive">{scores.teamB}</div>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="bg-olive text-white px-10 py-4 rounded-full text-xl font-medium hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-lg"
            >
              <RotateCcw className="w-6 h-6" />
              Играть снова
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Progress */}
      {gameState !== 'START' && gameState !== 'FINISHED' && (
        <div className="fixed bottom-8 left-0 w-full px-8">
          <div className="max-w-4xl mx-auto flex gap-2">
            {characters.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  idx < currentIndex ? 'bg-olive' : 
                  idx === currentIndex ? 'bg-olive/40' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
