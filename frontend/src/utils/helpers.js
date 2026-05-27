export const getTypeColor = (type) => {
  const colors = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500 text-gray-900',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400 text-gray-900',
    fighting: 'bg-orange-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500 text-gray-900',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-800',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-400 text-gray-900',
    fairy: 'bg-pink-400',
  };
  return colors[type?.toLowerCase()] || 'bg-gray-500';
};

export const formatId = (id) => {
  if (!id) return '';
  return `#${id.toString().padStart(4, '0')}`;
};

export const formatName = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
};
