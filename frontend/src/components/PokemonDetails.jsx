import { useQuery } from "@tanstack/react-query";
import { getPokemon } from "../api";
import { getTypeColor, formatId } from "../utils/helpers";

const PokemonDetails = ({ pokemonName, onSelectPokemon }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: () => getPokemon(pokemonName),
    enabled: !!pokemonName,
  });

  if (!pokemonName) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-center">
        <p className="text-text-muted text-lg">
          Search for a Pokémon to get started.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 mt-8">
        <div className="h-[320px] rounded-3xl bg-surface-light border border-white/5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 rounded-3xl bg-surface-light border border-white/5" />
          <div className="h-72 rounded-3xl bg-surface-light border border-white/5" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <p className="text-red-400 font-medium">
          Pokémon not found. Try searching another name.
        </p>
      </div>
    );
  }

  const artwork =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default;

  return (
    <div key={data.id} className="mt-8 space-y-6 pb-10">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-6 md:p-10">
        <div
          className={`absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl opacity-10 ${getTypeColor(
            data.types[0],
          )}`}
        />

        <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
          <img
            src={artwork}
            alt={data.name}
            loading="lazy"
            className="h-56 w-56 object-contain md:h-80 md:w-80"
            onError={(e) => {
              e.currentTarget.src = data.sprites.front_default;
            }}
          />

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {formatId(data.id)}
            </span>

            <h1 className="mt-4 text-4xl font-bold capitalize text-white md:text-6xl">
              {data.name.replace("-", " ")}
            </h1>

            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {data.types.map((type) => (
                <span
                  key={type}
                  className={`rounded-full px-4 py-1 text-sm font-medium text-white ${getTypeColor(
                    type,
                  )}`}
                >
                  {type}
                </span>
              ))}
            </div>

            {data.speciesInfo?.flavor_text && (
              <p className="mt-6 max-w-2xl leading-relaxed text-text-muted">
                {data.speciesInfo.flavor_text}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">Stats</h2>

          <div className="space-y-5">
            {data.stats.map((stat) => (
              <div key={stat.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm capitalize text-text-muted">
                    {stat.name.replace("-", " ")}
                  </span>

                  <span className="text-sm font-semibold text-primary">
                    {stat.base_stat}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-surface-light">
                  <div className="h-full rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-surface p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Height" value={`${data.height / 10} m`} />
              <InfoCard label="Weight" value={`${data.weight / 10} kg`} />
              <div className="col-span-2">
                <InfoCard
                  label="Base Experience"
                  value={`${data.base_experience} XP`}
                />
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-surface p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">Abilities</h2>
            <div className="space-y-3">
              {data.abilities?.length ? (
                data.abilities.map((ability) => (
                  <div
                    key={ability.name}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-surface-light px-4 py-3"
                  >
                    <span className="capitalize text-text">
                      {ability.name.replace("-", " ")}
                    </span>
                    {ability.is_hidden && (
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Hidden
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-text-muted">No abilities available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-light p-5">
      <p className="text-sm text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

export default PokemonDetails;
