import { describe, expect, it } from 'vitest';
import type { LibraryModel } from '../library/modelSchema';
import { createSimulation, stepSimulation } from './simulation';

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

describe('simulation', () => {
  it('creates and steps a deterministic visual model', () => {
    const state = createSimulation(model, 12);
    const next = stepSimulation(state);
    expect(state.agents).toHaveLength(5);
    expect(next.tick).toBe(1);
    expect(next.agents[0].x).not.toBe(state.agents[0].x);
  });
});
