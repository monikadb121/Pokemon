const typeColors = {
  normal: "bg-gray-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400 text-black",
  grass: "bg-green-500",
  ice: "bg-cyan-400 text-black",
  fighting: "bg-orange-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500 text-black",
  rock: "bg-stone-600",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-slate-400 text-black",
  fairy: "bg-pink-400",
};

export const getTypeColor = (type) => {
  if (!type) {
    return "bg-gray-500";
  }

  return typeColors[type.toLowerCase()] || "bg-gray-500";
};

export const formatId = (id) => {
  if (!id) {
    return "";
  }

  return `#${String(id).padStart(4, "0")}`;
};

export const formatName = (name) => {
  if (!name) {
    return "";
  }

  return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
