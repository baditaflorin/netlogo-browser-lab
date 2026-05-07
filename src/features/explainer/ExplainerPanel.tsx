import { Brain, ExternalLink } from 'lucide-react';
import type { LibraryModel } from '../library/modelSchema';
import { explainModel } from './localExplainer';

type Props = {
  model: LibraryModel;
};

export function ExplainerPanel({ model }: Props) {
  const explanation = explainModel(model);

  return (
    <section className="panel explainer" aria-labelledby="explainer-heading">
      <div className="panel-heading">
        <Brain aria-hidden="true" />
        <div>
          <p className="eyebrow">Local tutor</p>
          <h2 id="explainer-heading">{explanation.headline}</h2>
        </div>
      </div>
      <p>{explanation.plainLanguage}</p>
      <h3>Mechanics</h3>
      <ul>
        {explanation.mechanics.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3>Try this</h3>
      <ul>
        {explanation.tryThis.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a className="source-link" href={model.sourceUrl} rel="noreferrer" target="_blank">
        Open upstream model <ExternalLink aria-hidden="true" size={16} />
      </a>
    </section>
  );
}
