import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 60 * 60, // 1 hour
  checkperiod: 600,
});

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
});

// get all pokemon names for search
export const getAllPokemon = async () => {
  const cached = cache.get('pokemon_list');

  if (cached) {
    return cached;
  }

  try {
    const response = await api.get('/pokemon?limit=10000');

    const pokemonList = response.data.results.map((pokemon, index) => ({
      id: index + 1,
      name: pokemon.name,
      url: pokemon.url,
    }));

    // storing for 24 hrs since list rarely changes
    cache.set('pokemon_list', pokemonList, 60 * 60 * 24);

    return pokemonList;
  } catch (error) {
    console.error('Failed to fetch pokemon list', error.message);
    throw error;
  }
};

export const getPokemonDetails = async (name) => {
  const cacheKey = `pokemon_${name}`;

  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const pokemonRequest = api.get(`/pokemon/${name}`);

    // species api sometimes fails for special forms
    const speciesRequest = api
      .get(`/pokemon-species/${name}`)
      .catch(() => null);

    const [pokemonRes, speciesRes] = await Promise.all([
      pokemonRequest,
      speciesRequest,
    ]);

    const pokemon = pokemonRes.data;
    const species = speciesRes?.data;

    const data = {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      base_experience: pokemon.base_experience,

      sprites: {
        front_default: pokemon.sprites.front_default,
        other: pokemon.sprites.other,
      },

      types: pokemon.types.map((item) => item.type.name),

      stats: pokemon.stats.map((stat) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat,
      })),

      abilities: pokemon.abilities.map((ability) => ({
        name: ability.ability.name,
        is_hidden: ability.is_hidden,
      })),

      // limiting moves because payload gets huge
      moves: pokemon.moves
        .slice(0, 10)
        .map((move) => move.move.name),

      speciesInfo: species
        ? {
            color: species.color?.name,
            habitat: species.habitat?.name,
            is_legendary: species.is_legendary,
            is_mythical: species.is_mythical,

            flavor_text: species.flavor_text_entries
              .find((entry) => entry.language.name === 'en')
              ?.flavor_text.replace(/\f|\n|\r/g, ' '),
          }
        : null,
    };

    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    console.error(`Failed to fetch pokemon ${name}`, error.message);
    throw error;
  }
};
