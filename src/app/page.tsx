"use client";

import { useState, useCallback, useEffect } from "react";
import { Game } from "./components/Game";
import { Modal } from "./components/Modal";
import { useLocalStorage } from "./hooks/useLocalStorage";

interface Player {
  name: string;
  isWinner: boolean;
}

interface GameState {
  players: Player[];
  started: boolean;
}

export default function Home() {
  const [preliminaryGames, setPreliminaryGames] = useLocalStorage<GameState[]>(
    "preliminaryGames",
    [
      {
        players: Array(3)
          .fill(null)
          .map(() => ({ name: "", isWinner: false })),
        started: false,
      },
      {
        players: Array(3)
          .fill(null)
          .map(() => ({ name: "", isWinner: false })),
        started: false,
      },
      // { players: Array(3).fill(null).map(() => ({ name: '', isWinner: false })), started: false },
    ]
  );

  const [finalGame, setFinalGame] = useLocalStorage<GameState>("finalGame", {
    players: Array(preliminaryGames.length + 1)
      .fill(null)
      .map(() => ({ name: "", isWinner: false })),
    started: false,
  });

  useEffect(() => {
    setFinalGame({
      players: Array(preliminaryGames.length + 1)
        .fill(null)
        .map(() => ({ name: "", isWinner: false })),
      started: false,
    });
  }, [preliminaryGames]);

  const [finalWinnerDeclared, setFinalWinnerDeclared] = useLocalStorage(
    "finalWinnerDeclared",
    false
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handlePlayerChange = (
    gameNumber: number,
    playerIndex: number,
    updatedPlayer: Player
  ) => {
    setPreliminaryGames((games) => {
      const newGames = [...games];
      newGames[gameNumber].players = [...newGames[gameNumber].players];

      // If this update is marking a winner, clear other winners
      if (updatedPlayer.isWinner) {
        newGames[gameNumber].players = newGames[gameNumber].players.map(
          (p) => ({ ...p, isWinner: false })
        );
      }

      newGames[gameNumber].players[playerIndex] = updatedPlayer;
      return newGames;
    });
  };

  const addPlayer = (gameIndex: number) => {
    setPreliminaryGames((games) => {
      const newGames = [...games];
      if (newGames[gameIndex].players.length < 5) {
        newGames[gameIndex] = {
          ...newGames[gameIndex],
          players: [
            ...newGames[gameIndex].players,
            { name: "", isWinner: false },
          ],
        };
      }
      return newGames;
    });
  };

  const removePlayer = (gameIndex: number) => {
    setPreliminaryGames((games) => {
      const newGames = [...games];
      if (newGames[gameIndex].players.length > 3) {
        newGames[gameIndex] = {
          ...newGames[gameIndex],
          players: newGames[gameIndex].players.slice(0, -1),
        };
      }
      return newGames;
    });
  };

  const addWildcard = useCallback(() => {
    setIsModalOpen(true);
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      setTimeout(() => {
        setIsModalOpen(false);
        setFinalGame((prev) => ({
          ...prev,
          players: prev.players.map((p, i) =>
            !p.name.trim() ? { name: "Laura 🎂", isWinner: false } : p
          ),
        }));
      }, 1500); // Give time to see the result before closing
    }, 3000); // Spinning time
  }, []);

  const addGame = () => {
    setPreliminaryGames((games) => [
      ...games,
      {
        players: Array(3)
          .fill(null)
          .map(() => ({ name: "", isWinner: false })),
        started: false,
      },
    ]);
  };

  const toggleGameStart = (gameIndex: number) => {
    setPreliminaryGames((games) => {
      const newGames = [...games];
      newGames[gameIndex] = {
        ...newGames[gameIndex],
        started: !newGames[gameIndex].started,
      };
      return newGames;
    });
  };

  const toggleFinalGameStart = () => {
    setFinalGame((prev) => ({
      ...prev,
      started: !prev.started,
    }));
  };

  const declareFinalWinner = () => {
    const winner = finalGame.players.find((p) => p.isWinner);
    if (winner) {
      setFinalWinnerDeclared(true);
    }
  };

  const resetTournament = () => {
    setPreliminaryGames([
      {
        players: Array(3)
          .fill(null)
          .map(() => ({ name: "", isWinner: false })),
        started: false,
      },
      {
        players: Array(3)
          .fill(null)
          .map(() => ({ name: "", isWinner: false })),
        started: false,
      },
    ]);
    setFinalGame({
      players: Array(preliminaryGames.length + 1)
        .fill(null)
        .map(() => ({ name: "", isWinner: false })),
      started: false,
    });
    setFinalWinnerDeclared(false);
  };

  const moveWinnerToFinal = (player: Player, index: number) => {
    setFinalGame((prev) => ({
      ...prev,
      players: [
        ...prev.players.slice(0, index),
        player,
        ...prev.players.slice(index + 1),
      ],
    }));
  };

  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/images/bg.png')` }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-6">
          🎂 Laura's Birthday Catan Tournament 🎂
        </h1>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Preliminary Games</h2>
            {preliminaryGames.map((game, index) => (
              <Game
                key={index}
                gameNumber={index + 1}
                players={game.players}
                started={game.started}
                onPlayerChange={handlePlayerChange}
                onAddPlayer={() => addPlayer(index)}
                onRemovePlayer={() => removePlayer(index)}
                onToggleStart={() => toggleGameStart(index)}
                onWinnersDeclared={(player, index) =>
                  moveWinnerToFinal(player, index)
                }
                isPreliminary={true}
              />
            ))}
            <div className="flex gap-2">
              <button
                onClick={addGame}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Game
              </button>
              <button
                onClick={resetTournament}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-300"
              >
                Reset Tournament
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Final Game</h2>
            <Game
              gameNumber={preliminaryGames.length + 1}
              players={finalGame.players}
              started={finalGame.started}
              onPlayerChange={(_, playerIndex, updatedPlayer) => {
                setFinalGame((prev) => ({
                  ...prev,
                  players: prev.players.map((p, i) =>
                    i === playerIndex
                      ? updatedPlayer
                      : updatedPlayer.isWinner
                      ? { ...p, isWinner: false }
                      : p
                  ),
                }));
              }}
              onToggleStart={toggleFinalGameStart}
              isPreliminary={false}
            />
            <div className="flex gap-2">
              <button
                onClick={addWildcard}
                disabled={!finalGame.players.some((p) => !p.name.trim())}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-300"
              >
                Add Wildcard
              </button>
            </div>
            {finalGame.started &&
              finalGame.players.some((p) => p.isWinner) &&
              !finalWinnerDeclared && (
                <button
                  onClick={declareFinalWinner}
                  className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full text-lg font-bold animate-pulse"
                >
                  🏆 Declare Winner! 🏆
                </button>
              )}
            {finalWinnerDeclared && (
              <div className="mt-6 border-4 border-yellow-500 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-3xl font-bold text-center mb-4">
                  🏆 Tournament Champion 🏆
                </h3>
                <div className="text-4xl text-center font-bold text-yellow-700">
                  {finalGame.players.find((p) => p.isWinner)?.name}
                </div>
                <div className="text-center mt-4 text-yellow-600">
                  🎉 Congratulations! 🎉
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col items-center gap-4">
            {isSpinning ? (
              <>
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg">Selecting Wildcard Player...</p>
              </>
            ) : finalGame.players.some((p) => p.isWinner) ? (
              <div className="text-4xl animate-bounce text-center">
                <div>🏆</div>
                <div className="mt-4 text-2xl">
                  {finalGame.players.find((p) => p.isWinner)?.name}
                </div>
                <div className="mt-4">is the Champion!</div>
              </div>
            ) : (
              <div className="text-4xl animate-bounce">🎂 Laura 🎂</div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
