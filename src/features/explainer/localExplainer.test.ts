import { describe, expect, it } from 'vitest';
import type { LibraryModel } from '../library/modelSchema';
import { explainModel } from './localExplainer';

const model: LibraryModel = {
  id: 'traffic-basic',
  title: 'Traffic Basic',
  category: 'Systems',
  difficulty: 'Intro',
  tags: ['traffic'],
  sourceUrl: 'https://example.com',
  license: 'test',
  summary: 'Cars reveal waves.',
  mechanics: ['Cars brake locally.'],
  defaultParameters: [
    { name: 'cars', label: 'Cars', min: 1, max: 10, step: 1, default: 5, unit: 'agents' },
  ],
  runtime: {
    visualPreview: true,
    cheerpj: 'ready',
    webgpu: 'probe',
    localExplain: 'static',
  },
  simulationKind: 'traffic',
  teacherPrompts: ['What changes speed?'],
  references: {},
};

describe('explainModel', () => {
  it('uses model metadata to create a local teaching explanation', () => {
    const explanation = explainModel(model);
    expect(explanation.headline).toContain('Traffic Basic');
    expect(explanation.plainLanguage).toContain('cars');
    expect(explanation.mechanics).toEqual(['Cars brake locally.']);
  });
});
