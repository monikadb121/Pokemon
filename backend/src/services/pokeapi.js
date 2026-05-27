import axios from 'axios';
import NodeCache from 'node-cache';

// Cache configuration:
// stdTTL: standard time to live in seconds (e.g., 1 hour = 3600 seconds)
// checkperiod: how often to check for expired keys
// maxKeys: prevent memory overflow
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600, maxKeys: 2000 });

const BASE_URL = 'https://pokeapi.co/api/v2';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Fetch a list of all pokemon (for search/autocomplete)
 * Caches indefinitely (or very long) since this rarely changes.
 */
export const getAllPokemon = async () => {
  const cacheKey = 'all_pokemon';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    // Fetching a large number to cover all existing pokemon
    const response = await apiClient.get('/pokemon?limit=10000');
    const data = response.data.results.map((p, index) => ({
      name: p.name,
      id: index + 1,
      url: p.url,
    }));
    
    // Cache for 24 hours
    cache.set(cacheKey, data, 86400);
    return data;
  } catch (error) {
    console.error('Error fetching all pokemon:', error.message);
    throw error;
  }
};

/**
 * Fetch detailed information for a specific pokemon
 */
export const getPokemonDetails = async (identifier) => {
  const cacheKey = `pokemon_${identifier}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      apiClient.get(`/pokemon/${identifier}`),
      apiClient.get(`/pokemon-species/${identifier}`).catch(() => null) // Species might fail if identifier is form-specific
    ]);

    const pokemon = pokemonRes.data;
    const species = speciesRes ? speciesRes.data : null;

    // Merge essential data to optimize frontend processing
    const result = {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      base_experience: pokemon.base_experience,
      sprites: {
        front_default: pokemon.sprites.front_default,
        other: pokemon.sprites.other,
      },
      types: pokemon.types.map(t => t.type.name),
      stats: pokemon.stats.map(s => ({
        name: s.stat.name,
        base_stat: s.base_stat,
      })),
      abilities: pokemon.abilities.map(a => ({
        name: a.ability.name,
        is_hidden: a.is_hidden,
      })),
      moves: pokemon.moves.slice(0, 10).map(m => m.move.name), // Limit moves to first 10 for performance
      speciesInfo: species ? {
        color: species.color?.name,
        habitat: species.habitat?.name,
        is_legendary: species.is_legendary,
        is_mythical: species.is_mythical,
        evolution_chain_url: species.evolution_chain?.url,
        flavor_text: species.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text.replace(/\f|\n|\r/g, ' '),
      } : null,
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error fetching pokemon ${identifier}:`, error.message);
    throw error;
  }
};

/**
 * Fetch evolution chain by chain ID
 */
export const getEvolutionChain = async (url) => {
  const cacheKey = `evolution_${url}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(url); // url is full absolute path from pokeapi
    
    // Normalize evolution tree
    const processChain = (chainNode) => {
      if (!chainNode) return null;
      return {
        species_name: chainNode.species.name,
        evolves_to: chainNode.evolves_to.map(processChain),
      };
    };

    const result = processChain(response.data.chain);
    cache.set(cacheKey, result, 86400); // Evolutions don't change often
    return result;
  } catch (error) {
    console.error('Error fetching evolution chain:', error.message);
    throw error;
  }
};
