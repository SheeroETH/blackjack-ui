import React, { useEffect, useState } from "react";

const API_BASE = "https://blackjack-backend-xcf6.vercel.app/api";

const BlackjackGame: React.FC = () => {
  const [userId, setUserId] = useState("test123");
  const [wallet, setWallet] = useState<number | null>(null);
  const [game, setGame] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/getWallet?userId=${userId}`)
      .then(res => res.json())
      .then(data => setWallet(data.tokens));
  }, [userId]);

  const startGame = async () => {
    const res = await fetch(`${API_BASE}/startGame`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bet: 10 }),
    });
    const data = await res.json();
    setGame(data);
    setStatus(null);
    setWallet(wallet ? wallet - 10 : null);
  };

  const hit = async () => {
    const res = await fetch(`${API_BASE}/hit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setGame(data.game);
    if (data.game.status !== "ongoing") {
      setStatus("Perdu !");
    }
  };

  const stand = async () => {
    const res = await fetch(`${API_BASE}/stand`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setGame(data);
    if (data.status === "won") setStatus("Gagné !");
    else if (data.status === "draw") setStatus("Égalité");
    else setStatus("Perdu !");
    fetch(`${API_BASE}/getWallet?userId=${userId}`)
      .then(res => res.json())
      .then(data => setWallet(data.tokens));
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold mb-4">🎲 Blackjack</h1>
      <p className="mb-4">💰 Tokens : {wallet}</p>

      {game ? (
        <>
          <div className="mb-2">
            <h2 className="font-semibold">🧑‍💼 Tes cartes :</h2>
            <p>{game.player.join(", ")}</p>
          </div>
          <div className="mb-4">
            <h2 className="font-semibold">🤖 Dealer :</h2>
            <p>{game.dealer.join(", ")}</p>
          </div>
          <div className="space-x-4">
            <button onClick={hit} className="px-4 py-2 bg-blue-500 text-white rounded">Tirer</button>
            <button onClick={stand} className="px-4 py-2 bg-green-500 text-white rounded">Rester</button>
          </div>
          {status && <p className="mt-4 text-xl font-bold">{status}</p>}
        </>
      ) : (
        <button onClick={startGame} className="px-6 py-3 bg-purple-600 text-white rounded">
          Lancer une partie
        </button>
      )}
    </div>
  );
};

export default BlackjackGame;
