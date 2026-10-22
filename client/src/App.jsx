
import { useState, useEffect } from "react";
import Card from "./Card.jsx";

const APIURL = "http://localhost:3000";

function App() {
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [Loading, setLoading] = useState(true);
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch(`${APIURL}/api/cartas`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      setCards(data);
    })
    .catch((error) => {
      console.error("Erro ao carregar as cartas:", error);
      setError(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  const visible = cards
    .filter(
      (card) =>
        (filter === "Todas" || card.type === filter) &&
        card.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sorted ? b.attack - a.attack : 0
    );

  function pickRandom() {
    if (cards.length === 0) return;

    setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
  }

  if (Loading) {
    return <p>A carregar cartas...</p>;
  }

  if (error) {
    return <p>Erro ao carregar as cartas: {error}</p>;
  }

  return (
    <main>
      <h1>A minha coleção</h1>

      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
      </p>

      <div>
        <button onClick={() => setFilter("Todas")}>Todas</button>
        <button onClick={() => setFilter("Criatura")}>
          Só criaturas
        </button>
        <button onClick={() => setFilter("Feitiço")}>
          Só feitiços
        </button>

        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome…"
      />

      {visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </ul>
      )}

      <h2>Carta à sorte</h2>

      <button onClick={pickRandom} disabled={cards.length === 0}>
        Escolher outra
      </button>

      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque{" "}
          {randomCard.attack} · defesa {randomCard.defense}
        </p>
      )}
    </main>
  );
}

export default App;
