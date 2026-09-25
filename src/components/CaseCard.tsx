import { MapPin } from 'lucide-react';
import { casePath, type CasePage } from '../content/pages';

export const CaseCard = ({ item }: { item: CasePage }) => (
  <a
    href={casePath(item.slug)}
    className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col hover:border-brand/20 hover:shadow-xl transition-all duration-500"
  >
    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
      <img
        src={item.photos[0].src}
        alt={`${item.area} ${item.category} 현장 사진`}
        loading="lazy"
        width={800}
        height={600}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
    </div>
    <div className="p-8 flex flex-col flex-1">
      <div className="flex items-center gap-2 text-xs font-bold text-brand mb-3">
        <MapPin className="w-3.5 h-3.5" />
        {item.area} · {item.category}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">{item.summary}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {item.tags.map(tag => (
          <span key={tag} className="text-[11px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </a>
);
