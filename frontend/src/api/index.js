import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

export const searchPokemon = async (query) => {
  try {
    if (!query?.trim()) return [];

    const { data } = await api.get("/search", {
      params: {
        q: query,
      },
    });

    return data;
  } catch (error) {
    console.error("Error searching pokemon:", error);
    return [];
  }
};

export const getPokemon = async (name) => {
  try {
    if (!name) return null;

    const { data } = await api.get(`/pokemon/${name}`);

    return data;
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    return null;
  }
};

export default api;
