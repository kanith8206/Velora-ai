import { useProductStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GitCompare, 
  Trash2, 
  ArrowLeft, 
  Check, 
  X, 
  Sparkles, 
  Award,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Comparison() {
  const { comparisonList, removeFromComparison, clearComparison } = useProductStore();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeFromComparison(id);
  };

  const handleClear = () => {
    clearComparison();
  };

  // Gather dynamic specs from all products in the comparison list
  const allSpecKeys = Array.from(
    new Set(comparisonList.flatMap(p => Object.keys(p.specs || {})))
  );

  const metrics = [
    { name: 'Price', key: 'price', format: (v) => `$${v.toLocaleString()}` },
    { name: 'Discount', key: 'discount', format: (v) => v > 0 ? `${v}% OFF` : 'None' },
    { name: 'Rating', key: 'rating', format: (v) => `${v} / 5.0` },
    { name: 'Brand', key: 'brand' },
    { name: 'Availability', key: 'availability' },
    ...allSpecKeys.map(key => ({
      name: key,
      specKey: key,
    }))
  ];

  // Logic to determine overall winner among current items (simple heuristic based on rating & pricing value ratio)
  const determineWinner = () => {
    if (comparisonList.length === 0) return null;
    let winner = comparisonList[0];
    let maxScore = 0;
    
    comparisonList.forEach(p => {
      // Score = Rating * 10 + (Discount * 0.5)
      const score = p.rating * 10 + p.discount * 0.2;
      if (score > maxScore) {
        maxScore = score;
        winner = p;
      }
    });
    return winner;
  };

  const winner = determineWinner();

  return (
    <div className="min-h-screen bg-[#060608] text-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative">
      
      {/* GLOW DECO */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1E1E24] pb-6">
        <div>
          <h1 className="font-sans font-extrabold text-3xl text-white flex items-center gap-2">
            <GitCompare className="w-8 h-8 text-[#E2B53E]" />
            Side-by-Side Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare premium devices and services to find the overall winner. Add up to 3 options.
          </p>
        </div>

        {comparisonList.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 py-2.5 px-4 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" /> Clear All Items
          </button>
        )}
      </section>

      {/* COMPARISON CONTENT */}
      {comparisonList.length > 0 ? (
        <div className="space-y-8">
          
          {/* WINNER JUMBOTRON CARD */}
          {winner && comparisonList.length > 1 && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 via-[#AA7C11]/10 to-transparent border border-[#1E1E24] flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center shrink-0 shadow-md">
                <Award className="w-6 h-6 text-black animate-bounce" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h3 className="font-sans font-extrabold text-base sm:text-lg text-white">
                  Velora Overall Winner Recommendation: <span className="text-[#E2B53E]">{winner.name}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  Based on technical performance profiles, active discount indices, and verified rating averages, we recommend {winner.name} as your optimal investment.
                </p>
              </div>
              <button
                onClick={() => navigate(`/chat?prompt=Please write a detailed comparison review and explanation for why ${winner.name} beats the other items.`)}
                className="md:ml-auto bg-[#0C0C0F] hover:bg-[#121216]/80 text-[#E2B53E] text-xs font-bold py-3 px-5 border border-[#1E1E24] rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Explain why
              </button>
            </div>
          )}

          {/* TABLE CONTAINER */}
          <div className="bg-[#0C0C0F]/40 border border-[#1E1E24] rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#1E1E24] bg-[#0C0C0F]/40">
                    <th className="py-6 px-6 font-bold text-slate-400 w-1/4">Comparison Matrix</th>
                    {comparisonList.map((product) => (
                      <th key={product.id} className="py-6 px-6 relative w-1/4 min-w-[200px]">
                        <div className="flex flex-col gap-3">
                          <div className="relative aspect-video w-32 rounded-lg overflow-hidden border border-[#1E1E24]">
                            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-[#E2B53E] uppercase tracking-wider">{product.brand}</span>
                            <Link to={`/product/${product.id}`} className="font-sans font-bold text-slate-100 hover:text-[#E2B53E] block line-clamp-1">
                              {product.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  
                  {/* GENERATIVE METRICS */}
                  {metrics.map((metric, mIdx) => (
                    <tr key={mIdx} className="border-b border-[#1E1E24]/60 hover:bg-[#0C0C0F]/20">
                      <td className="py-4 px-6 font-bold text-slate-400">{metric.name}</td>
                      {comparisonList.map((product) => {
                        let val = '';
                        if (metric.key) {
                          val = metric.format 
                            ? metric.format(product[metric.key]) 
                            : product[metric.key];
                        } else if (metric.specKey) {
                          val = product.specs[metric.specKey] || 'N/A';
                        }
                        return (
                          <td key={product.id} className="py-4 px-6 text-slate-200 font-medium leading-relaxed">
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* PROS & CONS IN THE TABLE */}
                  <tr className="border-b border-[#1E1E24]/60 bg-[#0C0C0F]/20">
                    <td className="py-4 px-6 font-bold text-emerald-400">Pros Audit</td>
                    {comparisonList.map((product) => (
                      <td key={product.id} className="py-4 px-6 text-slate-300">
                        <ul className="space-y-1.5 text-xs list-inside">
                          {product.pros.slice(0, 3).map((p, pIdx) => (
                            <li key={pIdx} className="flex gap-1.5 items-start">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-4 px-6 font-bold text-rose-400">Cons Audit</td>
                    {comparisonList.map((product) => (
                      <td key={product.id} className="py-4 px-6 text-slate-300">
                        <ul className="space-y-1.5 text-xs list-inside">
                          {product.cons.slice(0, 3).map((c, cIdx) => (
                            <li key={cIdx} className="flex gap-1.5 items-start">
                              <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY COMPARISON COMPONENT */
        <div className="text-center py-24 border border-dashed border-[#1E1E24] rounded-2xl max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0C0C0F] border border-[#1E1E24] flex items-center justify-center mx-auto">
            <GitCompare className="w-8 h-8 text-[#E2B53E] animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-sans font-bold text-lg text-slate-300">No products added to compare</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Explore our categories catalog, click the compare double arrow icon on any device card, and evaluate their technical aspects side-by-side.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/5"
          >
            Browse Products
          </Link>
        </div>
      )}

    </div>
  );
}
