import express from 'express';
import { getAllPokemon, getPokemonDetails, getEvolutionChain } from '../services/pokeapi.js';

const router = express.Router();

// GET /api/search?q=bulba
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q?.toLowerCase();
    const allPokemon = await getAllPokemon();

    if (!query) {
      // If no query, return an empty array
      return res.json([]);
    }

    // Filter results locally from cached list
    const results = allPokemon.filter(p => p.name.includes(query)).slice(0, 20); // max 20 suggestions
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// GET /api/pokemon/:name
router.get('/pokemon/:name', async (req, res, next) => {
  try {
    const nameOrId = req.params.name.toLowerCase();
    const data = await getPokemonDetails(nameOrId);
    res.json(data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Pokemon not found' });
    } else {
      next(error);
    }
  }
});

// GET /api/evolution?url=...
router.get('/evolution', async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Evolution chain URL is required' });
    }
    const data = await getEvolutionChain(url);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
