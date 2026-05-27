import { useQuery } from '@tanstack/react-query';
import { getPokemon } from '../api';
import { getTypeColor, formatId } from '../utils/helpers';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import EvolutionChain from './EvolutionChain';

export default function PokemonDetails({ pokemonName, onSelectPokemon }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon', pokemonName],
    queryFn: () => getPokemon(pokemonName),
    enabled: !!pokemonName,
  });

  if (!pokemonName) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-primary/50 mt-10">
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-2 border-accent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
          <div className="absolute inset-4 border-b-2 border-white/20 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-display tracking-[0.2em] uppercase drop-shadow-md">Awaiting Query Input...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full animate-pulse mt-8 space-y-8">
        <div className="h-[400px] glass-panel rounded-[3rem]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 glass-panel rounded-3xl"></div>
          <div className="h-64 glass-panel rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center text-accent mt-8 border-accent/50 shadow-[0_0_20px_rgba(255,0,85,0.2)]">
        <p className="font-display uppercase tracking-widest font-bold">Error: Entity Not Found in Database.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={data.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-8 mt-8 pb-12 perspective-1000"
    >
      {/* Header Profile */}
      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={2000} transitionSpeed={1500} scale={1.02} glareEnable={true} glareMaxOpacity={0.15} glareColor="white" glarePosition="all" className="rounded-[3rem]">
        <div className="glass-panel-heavy rounded-[3rem] p-8 md:p-16 relative overflow-hidden group">
          <div className={`absolute -right-20 -top-20 w-[40rem] h-[40rem] rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${getTypeColor(data.types[0])}`} />
          
          <div className="flex flex-col md:flex-row items-center gap-16 relative z-10" style={{ transform: 'translateZ(50px)' }}>
            <div className="relative w-64 h-64 md:w-96 md:h-96 flex flex-col items-center justify-center">
              <motion.div 
                className="relative z-10 w-full h-full"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src={data.sprites.other['official-artwork'].front_default || data.sprites.front_default} 
                  alt={data.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                />
              </motion.div>
              <div className="absolute bottom-0 w-[80%] h-12 hologram-pedestal"></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <span className="text-xl font-display text-primary font-bold tracking-[0.3em] bg-primary/10 px-4 py-1 rounded-md border border-primary/30 shadow-[inset_0_0_10px_rgba(0,240,255,0.2)]">
                  {formatId(data.id)}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 capitalize tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                {data.name.replace('-', ' ')}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
                {data.types.map(type => (
                  <span key={type} className={`type-badge ${getTypeColor(type)}`}>
                    {type}
                  </span>
                ))}
              </div>

              {data.speciesInfo?.flavor_text && (
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
                  <p className="text-text-muted text-lg max-w-2xl leading-relaxed italic pl-6 py-2 font-light">
                    "{data.speciesInfo.flavor_text}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tilt>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Stats Column */}
        <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={2000} className="md:col-span-7 rounded-[2rem]">
          <div className="h-full glass-panel-heavy rounded-[2rem] p-8 md:p-10">
            <h2 className="text-2xl font-display font-bold mb-10 text-white flex items-center gap-3 uppercase tracking-widest" style={{ transform: 'translateZ(30px)' }}>
              <span className="w-3 h-3 bg-primary rounded-sm animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
              Performance Matrix
            </h2>
            <div className="space-y-6" style={{ transform: 'translateZ(20px)' }}>
              {data.stats.map((stat, index) => (
                <div key={stat.name} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted uppercase font-bold tracking-[0.2em] text-[10px]">{stat.name.replace('-', ' ')}</span>
                    <span className="text-primary font-display font-bold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-sm h-3 overflow-hidden border border-white/5 relative shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_15px_rgba(0,240,255,0.8)]"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tilt>

        {/* Info Column */}
        <div className="md:col-span-5 space-y-8 flex flex-col">
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={2000} className="rounded-[2rem]">
            <div className="glass-panel-heavy rounded-[2rem] p-8 grid grid-cols-2 gap-6 relative overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              
              <div className="bg-surface/50 rounded-2xl p-6 border border-white/5 relative z-10 hover:border-primary/30 transition-colors shadow-inner" style={{ transform: 'translateZ(40px)' }}>
                <span className="block text-primary/70 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Height</span>
                <span className="text-3xl font-display font-black text-white">{data.height / 10}<span className="text-sm text-text-muted ml-1">m</span></span>
              </div>
              <div className="bg-surface/50 rounded-2xl p-6 border border-white/5 relative z-10 hover:border-primary/30 transition-colors shadow-inner" style={{ transform: 'translateZ(40px)' }}>
                <span className="block text-primary/70 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Weight</span>
                <span className="text-3xl font-display font-black text-white">{data.weight / 10}<span className="text-sm text-text-muted ml-1">kg</span></span>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-surface to-surface-light rounded-2xl p-6 border border-white/10 flex justify-between items-center relative z-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" style={{ transform: 'translateZ(20px)' }}>
                <span className="block text-primary/70 text-[10px] uppercase tracking-[0.2em] font-bold">Base Experience</span>
                <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-md">{data.base_experience} XP</span>
              </div>
            </div>
          </Tilt>

          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={2000} className="rounded-[2rem] flex-1">
            <div className="h-full glass-panel-heavy rounded-[2rem] p-8">
              <h2 className="text-xl font-display font-bold mb-6 text-white uppercase tracking-widest flex items-center gap-2" style={{ transform: 'translateZ(30px)' }}>
                <span className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_rgba(255,0,85,0.8)]"></span>
                Traits & Abilities
              </h2>
              <div className="flex flex-col gap-3" style={{ transform: 'translateZ(20px)' }}>
                {data.abilities.map(a => (
                  <div key={a.name} className="bg-surface/50 border border-white/5 px-6 py-4 rounded-xl flex items-center justify-between hover:bg-surface-light hover:border-white/20 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.3)]">
                    <span className="text-text font-bold tracking-wide capitalize">{a.name.replace('-', ' ')}</span>
                    {a.is_hidden && (
                      <span className="text-[10px] border border-accent/50 text-accent px-3 py-1 rounded-sm font-black uppercase tracking-widest shadow-[inset_0_0_10px_rgba(255,0,85,0.2)]">
                        Hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Tilt>
        </div>
      </div>

      {/* Evolution Chain */}
      {data.speciesInfo?.evolution_chain_url && (
        <EvolutionChain url={data.speciesInfo.evolution_chain_url} onSelect={onSelectPokemon} />
      )}
    </motion.div>
  );
}
