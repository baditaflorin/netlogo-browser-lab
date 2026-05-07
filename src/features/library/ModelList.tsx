import { Search } from 'lucide-react';
import type { LibraryModel } from './modelSchema';

type Props = {
  models: LibraryModel[];
  selectedId: string;
  query: string;
  category: string;
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSelect: (id: string) => void;
};

export function ModelList({
  models,
  selectedId,
  query,
  category,
  onQueryChange,
  onCategoryChange,
  onSelect,
}: Props) {
  const categories = ['All', ...Array.from(new Set(models.map((model) => model.category))).sort()];
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = models.filter((model) => {
    const categoryMatch = category === 'All' || model.category === category;
    const queryMatch =
      normalizedQuery.length === 0 ||
      [model.title, model.category, model.summary, ...model.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    return categoryMatch && queryMatch;
  });

  return (
    <aside className="library-panel" aria-label="Curated model library">
      <div className="search-box">
        <Search aria-hidden="true" size={18} />
        <input
          aria-label="Search models"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search models"
        />
      </div>
      <div className="category-tabs" aria-label="Model categories">
        {categories.map((item) => (
          <button
            className={item === category ? 'chip active' : 'chip'}
            key={item}
            onClick={() => onCategoryChange(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="model-list" data-testid="model-list">
        {filtered.map((model) => (
          <button
            className={model.id === selectedId ? 'model-row selected' : 'model-row'}
            key={model.id}
            onClick={() => onSelect(model.id)}
            type="button"
          >
            <span>
              <strong>{model.title}</strong>
              <small>{model.category}</small>
            </span>
            <span className="difficulty">{model.difficulty}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
