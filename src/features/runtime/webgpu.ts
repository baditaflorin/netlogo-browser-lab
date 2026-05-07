export type WebGpuProbe = {
  supported: boolean;
  label: string;
  detail: string;
};

export async function probeWebGPU(): Promise<WebGpuProbe> {
  if (!navigator.gpu) {
    return {
      supported: false,
      label: 'WebGPU unavailable',
      detail: 'This browser will use the deterministic canvas renderer.',
    };
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    return {
      supported: false,
      label: 'WebGPU adapter unavailable',
      detail: 'The browser exposed WebGPU but did not return an adapter.',
    };
  }

  const info =
    adapter.info ?? (adapter.requestAdapterInfo ? await adapter.requestAdapterInfo() : {});
  const detail = [info.vendor, info.architecture, info.device, info.description]
    .filter(Boolean)
    .join(' / ');

  return {
    supported: true,
    label: 'WebGPU ready',
    detail:
      detail || 'Adapter detected. V1 keeps stepping deterministic and uses canvas rendering.',
  };
}
