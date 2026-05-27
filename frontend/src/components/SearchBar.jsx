import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { Search, Loader2 } from "lucide-react";
import { searchPokemon } from "../api";

export default function SearchBar({ onSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [debouncedValue] = useDebounceValue(inputValue, 400);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["pokemon-search", debouncedValue],
    queryFn: () => searchPokemon(debouncedValue),
    enabled: debouncedValue.trim().length > 0,
  });

  useEffect(() => {
    setIsOpen(inputValue.trim().length > 0);
  }, [inputValue]);

  const handleSelect = (pokemonName) => {
    setInputValue("");
    setIsOpen(false);
    onSelect(pokemonName);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center h-14 px-4 rounded-2xl bg-gray-900 border border-gray-700 focus-within:border-cyan-400 transition-all duration-300 shadow-lg">
        <div className="mr-3 text-gray-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          type="text"
          value={inputValue}
          placeholder="Search Pokemon (Eg. Pikachu)..."
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="w-full bg-transparent outline-none text-white placeholder:text-gray-500"
        />
      </div>

      {isOpen && results?.length > 0 && (
        <div className="absolute left-0 right-0 mt-3 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto z-50">
          {results?.map((pokemon) => (
            <button
              key={pokemon.name}
              type="button"
              onClick={() => handleSelect(pokemon.name)}
              className="w-full flex items-center justify-between px-5 py-4 text-left border-b border-gray-800 last:border-none hover:bg-gray-800 transition-colors"
            >
              <span className="capitalize font-medium text-gray-100">
                {pokemon.name.replace("-", " ")}
              </span>

              <span className="text-xs text-cyan-400 font-semibold">
                #{pokemon.id.toString().padStart(4, "0")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
