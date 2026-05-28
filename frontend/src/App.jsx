import { useState, useEffect } from "react";
import { History } from "lucide-react";
import SearchBar from "./components/SearchBar";
import PokemonDetails from "./components/PokemonDetails";

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("pokedex_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSelectPokemon = (name) => {
    setSelectedPokemon(name);
    setHistory((prev) => {
      const newHistory = [name, ...prev.filter((n) => n !== name)].slice(0, 5);
      localStorage.setItem("pokedex_history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return (
    <div className="min-h-screen bg-background text-text relative overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1 max-w-2xl">
            <SearchBar onSelect={handleSelectPokemon} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-20 relative z-10">
        {history.length > 0 && !selectedPokemon && (
          <div className="mb-12 mt-10 text-center max-w-3xl mx-auto">
            <h3 className="text-xs text-green-500 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 mb-6 drop-shadow-md">
              <History className="w-4 h-4" />
              <span className="text-green-500">Previous Searches</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {history.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelectPokemon(name)}
                  className="px-6 py-3 glass-panel-heavy rounded-full glass-panel-hover capitalize text-sm font-bold tracking-wide transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-primary/50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {name.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        )}
        <main>
          <PokemonDetails
            pokemonName={selectedPokemon}
            onSelectPokemon={handleSelectPokemon}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
