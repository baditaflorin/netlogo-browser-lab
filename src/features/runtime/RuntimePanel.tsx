import { Cpu, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { initializeCheerpJ, type CheerpJStatus } from './cheerpj';
import { probeWebGPU, type WebGpuProbe } from './webgpu';

export function RuntimePanel() {
  const [gpu, setGpu] = useState<WebGpuProbe>({
    supported: false,
    label: 'Checking WebGPU',
    detail: 'Detecting browser adapter.',
  });
  const [cheerpj, setCheerpj] = useState<CheerpJStatus>('idle');

  useEffect(() => {
    let mounted = true;
    void probeWebGPU()
      .then((result) => {
        if (mounted) setGpu(result);
      })
      .catch(() => {
        if (mounted) {
          setGpu({
            supported: false,
            label: 'WebGPU probe failed',
            detail: 'The canvas preview remains available.',
          });
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleCheerpJ() {
    setCheerpj('loading');
    try {
      await initializeCheerpJ();
      setCheerpj('ready');
    } catch (error) {
      console.error(error);
      setCheerpj('failed');
    }
  }

  return (
    <section className="panel runtime-panel" aria-labelledby="runtime-heading">
      <div className="panel-heading">
        <Cpu aria-hidden="true" />
        <div>
          <p className="eyebrow">Runtime</p>
          <h2 id="runtime-heading">Browser execution stack</h2>
        </div>
      </div>
      <div className="runtime-grid">
        <div className={gpu.supported ? 'status-card good' : 'status-card'}>
          <strong>{gpu.label}</strong>
          <span>{gpu.detail}</span>
        </div>
        <div className={cheerpj === 'ready' ? 'status-card good' : 'status-card'}>
          <strong>CheerpJ {cheerpj}</strong>
          <span>Java runtime loads only on demand to protect first paint.</span>
        </div>
      </div>
      <button
        className="secondary-button"
        data-testid="cheerpj-button"
        disabled={cheerpj === 'loading' || cheerpj === 'ready'}
        onClick={() => void handleCheerpJ()}
        type="button"
      >
        <PlayCircle aria-hidden="true" size={18} />
        {cheerpj === 'ready' ? 'CheerpJ initialized' : 'Initialize CheerpJ'}
      </button>
      {cheerpj === 'failed' ? (
        <p className="notice">
          CheerpJ could not load. The curated visual runner still works offline.
        </p>
      ) : null}
    </section>
  );
}
