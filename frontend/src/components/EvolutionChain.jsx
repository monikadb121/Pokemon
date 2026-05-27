import { useQuery } from '@tanstack/react-query';
import { getEvolution, getPokemon } from '../api';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function EvolutionNode({ name, onClick }) {
  const { data } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => getPokemon(name),
  });

  return (
    <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} transitionSpeed={1500} scale={1.1} glareEnable={true} glareMaxOpacity={0.3} glareColor="rgba(0,240,255,0.5)" glarePosition="all" className="rounded-full">
      <motion.div 
        className="bg-surface-light/80 backdrop-blur-md border border-white/10 rounded-full p-4 md:p-6 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center flex-col shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,0.8)] cursor-pointer transition-all duration-300 relative group"
        onClick={() => onClick(name)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/50 transition-colors animate-[spin_4s_linear_infinite] shadow-[inset_0_0_20px_rgba(0,240,255,0)] group-hover:shadow-[inset_0_0_20px_rgba(0,240,255,0.3)]" />
        
        {data ? (
          <img 
            src={data.sprites.front_default} 
            alt={name}
            className="w-20 h-20 md:w-24 md:h-24 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] relative z-10"
            style={{ transform: 'translateZ(40px)' }}
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-2 relative z-10" style={{ transform: 'translateZ(40px)' }}></div>
        )}
        <span className="text-white font-display font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2 relative z-10" style={{ transform: 'translateZ(20px)' }}>{name.replace('-', ' ')}</span>
      </motion.div>
    </Tilt>
  );
}

export default function EvolutionChain({ url, onSelect }) {
  const { data, isLoading } = useQuery({
    queryKey: ['evolution', url],
    queryFn: () => getEvolution(url),
    enabled: !!url,
  });

  if (isLoading || !data) return null;

  const flattenChain = (chain) => {
    const species = [];
    let current = chain;
    while (current) {
      species.push(current.species_name);
      current = current.evolves_to[0]; 
    }
    return species;
  };

  const evolutions = flattenChain(data);

  if (evolutions.length <= 1) return null;

  return (
    <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} perspective={3000} className="rounded-[2rem]">
      <div className="glass-panel-heavy rounded-[2rem] p-8 overflow-hidden relative" style={{ transformStyle: 'preserve-3d' }}>
        <h2 className="text-2xl font-display font-bold mb-10 text-white flex items-center justify-center gap-3 uppercase tracking-widest text-center" style={{ transform: 'translateZ(30px)' }}>
          <span className="w-8 h-[1px] bg-primary/50 shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
          Evolution Protocol
          <span className="w-8 h-[1px] bg-primary/50 shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
        </h2>
        
        <div className="flex flex-row items-center justify-start md:justify-center gap-2 overflow-x-auto pb-12 pt-4 custom-scrollbar px-4" style={{ transform: 'translateZ(40px)' }}>
          {evolutions.map((name, index) => (
            <div key={name} className="flex items-center shrink-0">
              <EvolutionNode name={name} onClick={onSelect} />
              
              {index < evolutions.length - 1 && (
                <div className="w-12 md:w-20 h-[2px] bg-white/10 relative mx-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-0 h-full bg-primary animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(0,240,255,1)] w-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Tilt>
  );
}
