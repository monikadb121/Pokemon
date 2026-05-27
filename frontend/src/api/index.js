import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const searchPokemon = async (query) => {
  if (!query) return [];
  const { data } = await api.get(`/search?q=${query}`);
  return data;
};

export const getPokemon = async (name) => {
  const { data } = await api.get(`/pokemon/${name}`);
  return data;
};

export const getEvolution = async (url) => {
  if (!url) return null;
  const { data } = await api.get(`/evolution?url=${encodeURIComponent(url)}`);
  return data;
};
