import { Pause, RotateCcw, SlidersHorizontal, StepForward, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LibraryModel } from '../library/modelSchema';
import { renderSimulation } from './render';
import { createSimulation, stepSimulation, type SimulationState } from './simulation';

type Props = {
  model: LibraryModel;
};

export function SimulationCanvas({ model }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [seed, setSeed] = useState(42);
  const initialState = useMemo(() => createSimulation(model, seed), [model, seed]);
  const [state, setState] = useState<SimulationState>(initialState);

  useEffect(() => {
    setRunning(false);
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) renderSimulation(canvas, state);
  }, [state]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setState((current) => {
        let next = current;
        for (let index = 0; index < speed; index += 1) {
          next = stepSimulation(next);
        }
        return next;
      });
    }, 120);
    return () => window.clearInterval(interval);
  }, [running, speed]);

  const metricEntries = Object.entries(state.metrics)
    .filter(([, value]) => Number.isFinite(value))
    .slice(0, 5);

  return (
    <section className="simulator" aria-labelledby="simulation-heading">
      <div className="simulator-topline">
        <div>
          <p className="eyebrow">Visual simulation</p>
          <h1 id="simulation-heading">{model.title}</h1>
        </div>
        <div className="sim-actions">
          <button
            className="icon-button"
            onClick={() => setRunning((value) => !value)}
            title={running ? 'Pause' : 'Run'}
            type="button"
            data-testid="run-button"
          >
            {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button
            className="icon-button"
            onClick={() => setState((current) => stepSimulation(current))}
            title="Step"
            type="button"
          >
            <StepForward aria-hidden="true" />
          </button>
          <button
            className="icon-button"
            onClick={() => {
              setSeed((value) => value + 1);
              setRunning(false);
            }}
            title="Reset"
            type="button"
          >
            <RotateCcw aria-hidden="true" />
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="simulation-canvas" data-testid="simulation-canvas" />
      <div className="controls-strip">
        <label className="speed-control">
          <SlidersHorizontal aria-hidden="true" size={18} />
          Speed
          <input
            aria-label="Simulation speed"
            max="10"
            min="1"
            onChange={(event) => setSpeed(Number(event.target.value))}
            type="range"
            value={speed}
          />
        </label>
        <span className="tick-counter">tick {state.tick}</span>
      </div>
      <div className="metrics-grid" aria-label="Simulation metrics">
        {metricEntries.map(([key, value]) => (
          <div className="metric" key={key}>
            <span>{formatMetricName(key)}</span>
            <strong>{formatMetricValue(value)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatMetricName(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').toLowerCase();
}

function formatMetricValue(value: number): string {
  if (Math.abs(value) < 1 && value !== 0) return value.toFixed(2);
  return value.toFixed(0);
}
