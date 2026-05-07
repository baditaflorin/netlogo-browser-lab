import { useQuery } from '@tanstack/react-query';
import { ExternalLink, GitFork, Heart, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExplainerPanel } from './features/explainer/ExplainerPanel';
import { fetchModelLibrary, fetchModelMeta } from './features/library/fetchLibrary';
import { ModelList } from './features/library/ModelList';
import type { LibraryModel } from './features/library/modelSchema';
import { RuntimePanel } from './features/runtime/RuntimePanel';
import { SimulationCanvas } from './features/runtime/SimulationCanvas';
import { loadPreferences, savePreferences } from './features/storage/preferences';

const repositoryUrl =
  import.meta.env.VITE_GITHUB_REPOSITORY_URL ??
  'https://github.com/baditaflorin/netlogo-browser-lab';
const paypalUrl = import.meta.env.VITE_PAYPAL_URL ?? 'https://www.paypal.com/paypalme/florinbadita';
const version = import.meta.env.VITE_APP_VERSION ?? '0.1.0';
const commit = import.meta.env.VITE_GIT_COMMIT ?? 'local';

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const libraryQuery = useQuery({ queryKey: ['model-library', 'v1'], queryFn: fetchModelLibrary });
  const metaQuery = useQuery({ queryKey: ['model-meta', 'v1'], queryFn: fetchModelMeta });
  const models = useMemo(() => libraryQuery.data?.models ?? [], [libraryQuery.data?.models]);
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    let mounted = true;
    void loadPreferences().then((prefs) => {
      if (!mounted || !prefs) return;
      setSelectedId(prefs.selectedModelId);
      setQuery(prefs.searchQuery);
      setCategory(prefs.category);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (models.length > 0 && !models.some((model) => model.id === selectedId)) {
      setSelectedId(models[0].id);
    }
  }, [models, selectedId]);

  useEffect(() => {
    if (selectedId) {
      void savePreferences({ selectedModelId: selectedId, searchQuery: query, category });
    }
  }, [selectedId, query, category]);

  const selectedModel = useMemo<LibraryModel | undefined>(
    () => models.find((model) => model.id === selectedId) ?? models[0],
    [models, selectedId],
  );

  if (libraryQuery.isLoading) {
    return <main className="loading">Loading curated NetLogo library...</main>;
  }

  if (libraryQuery.isError || !selectedModel) {
    return (
      <main className="loading error">
        <h1>Model library unavailable</h1>
        <p>The static data artifact could not be loaded. Try refreshing after the next publish.</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">
            NL
          </span>
          <div>
            <p className="eyebrow">NetLogo in browser</p>
            <strong>NetLogo Browser Lab</strong>
          </div>
        </div>
        <nav aria-label="Project links" className="project-links">
          <a href={repositoryUrl} rel="noreferrer" target="_blank">
            <Star aria-hidden="true" size={17} />
            Star on GitHub
          </a>
          <a href={paypalUrl} rel="noreferrer" target="_blank">
            <Heart aria-hidden="true" size={17} />
            PayPal
          </a>
        </nav>
      </header>

      <main className="workspace">
        <ModelList
          category={category}
          models={models}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          onSelect={setSelectedId}
          query={query}
          selectedId={selectedModel.id}
        />
        <div className="main-column">
          <SimulationCanvas model={selectedModel} />
          <div className="detail-grid">
            <ExplainerPanel model={selectedModel} />
            <RuntimePanel />
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>
          v{version} · commit{' '}
          <a href={`${repositoryUrl}/commit/${commit}`} rel="noreferrer" target="_blank">
            {commit}
          </a>
        </span>
        <span>
          data {metaQuery.data?.artifactVersion ?? 'loading'} ·{' '}
          {metaQuery.data ? new Date(metaQuery.data.generatedAt).toLocaleDateString() : 'checking'}
        </span>
        <a href={repositoryUrl} rel="noreferrer" target="_blank">
          Repository <GitFork aria-hidden="true" size={15} />
        </a>
        <a href="https://ccl.northwestern.edu/netlogo/models/" rel="noreferrer" target="_blank">
          NetLogo Models Library <ExternalLink aria-hidden="true" size={15} />
        </a>
      </footer>
    </div>
  );
}
