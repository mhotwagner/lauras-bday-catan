"use client";

interface Player {
  name: string;
  isWinner: boolean;
}

interface GameProps {
  gameNumber: number;
  players: Player[];
  started: boolean;
  onPlayerChange: (
    gameNumber: number,
    playerIndex: number,
    updatedPlayer: Player
  ) => void;
  onAddPlayer?: () => void; // Optional since final game won't have these
  onRemovePlayer?: () => void; // Optional since final game won't have these
  onToggleStart?: () => void;
  isPreliminary?: boolean; // To determine whether to show the buttons
}

export function Game({
  gameNumber,
  players,
  started,
  onPlayerChange,
  onAddPlayer,
  onRemovePlayer,
  onToggleStart,
  isPreliminary = false,
}: GameProps) {
  return (
    <div className={`border p-4 rounded-lg mb-4 ${started ? 'bg-green-50' : ''}`}>
      <div className="flex justify-between mb-4 flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">Game {gameNumber}</h2>
        </div>
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={player.name}
              onChange={(e) =>
                onPlayerChange(gameNumber - 1, index, {
                  ...player,
                  name: e.target.value,
                })
              }
              className="border rounded px-2 py-1"
              placeholder={`Player ${index + 1}`}
              disabled={started}
            />
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={player.isWinner}
                onChange={(e) =>
                  onPlayerChange(gameNumber - 1, index, {
                    ...player,
                    isWinner: e.target.checked,
                  })
                }
                disabled={!started}
              />
              Winner
            </label>
          </div>
        ))}
        {isPreliminary && !started && (
          <div className="flex gap-2">
            <button
              onClick={onToggleStart}
              className={`px-3 py-1 rounded text-sm ${
                started
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {started ? 'Reset Game' : 'Start Game'}
            </button>
            <button
              onClick={onAddPlayer}
              disabled={players.length >= 5}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300 text-sm"
            >
              Add Player
            </button>
            <button
              onClick={onRemovePlayer}
              disabled={players.length <= 3}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-300 text-sm"
            >
              Remove Player
            </button>
          </div>
        )}
        {!isPreliminary && (
          <button
            onClick={onToggleStart}
            disabled={!started && players.some(player => !player.name.trim())}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 text-sm"
          >
            {started ? 'Reset Game' : 'Start Game'}
          </button>
        )}
      </div>
    </div>
  );
}
