import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from 'usehooks-ts';
import { Search, Loader2 } from 'lucide-react';
import { searchPokemon } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ onSelect }) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebounceValue(inputValue, 500);
  const [isOpen, setIsOpen] = useState(false);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedValue],
    queryFn: () => searchPokemon(debouncedValue),
    enabled: debouncedValue.length > 0,
  });

  useEffect(() => {
    if (inputValue.length > 0) setIsOpen(true);
    else setIsOpen(false);
  }, [inputValue]);

  const handleSelect = (name) => {
    setInputValue('');
    setIsOpen(false);
    onSelect(name);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50 group">
      <div className="relative flex items-center w-full h-12 md:h-14 rounded-xl focus-within:shadow-[0_0_20px_rgba(0,240,255,0.3)] bg-surface border border-white/10 focus-within:border-primary/50 overflow-hidden transition-all duration-300">
        <div className="grid place-items-center h-full w-14 text-text-muted group-focus-within:text-primary transition-colors">
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          className="peer h-full w-full outline-none text-sm md:text-base text-text bg-transparent pr-4 font-medium tracking-wide placeholder-text-muted/50"
          type="text"
          placeholder="QUERY DATABASE... (E.G. CHARIZARD)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      <AnimatePresence>
        {isOpen && results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 15, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full w-full bg-surface-light/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar"
          >
            {results.map((pokemon, index) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                key={pokemon.name}
                className="px-6 py-4 hover:bg-white/5 cursor-pointer flex items-center justify-between border-b border-white/5 last:border-0 transition-colors group/item"
                onClick={() => handleSelect(pokemon.name)}
              >
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover/item:bg-primary group-hover/item:shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all"></span>
                  <span className="font-semibold text-text capitalize text-lg tracking-wide group-hover/item:text-white">{pokemon.name.replace('-', ' ')}</span>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md tracking-widest">
                  #{pokemon.id.toString().padStart(4, '0')}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
