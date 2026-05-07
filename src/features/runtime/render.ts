import type { Agent, FieldCell, SimulationState } from './simulation';

const colors: Record<Agent['kind'], string> = {
  sheep: '#f8fafc',
  wolf: '#334155',
  red: '#ef4444',
  blue: '#2563eb',
  car: '#f59e0b',
  ant: '#111827',
  buyer: '#14b8a6',
  seller: '#e11d48',
};

export function renderSimulation(canvas: HTMLCanvasElement, state: SimulationState) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const pixelRatio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * pixelRatio);
  canvas.height = Math.round(rect.height * pixelRatio);
  context.scale(pixelRatio, pixelRatio);

  context.fillStyle = '#e2e8f0';
  context.fillRect(0, 0, rect.width, rect.height);
  drawFields(context, state.fields, rect.width, rect.height, state.kind);
  drawTrack(context, state.kind, rect.width, rect.height);

  for (const agent of state.agents) {
    const x = (agent.x / state.width) * rect.width;
    const y = (agent.y / state.height) * rect.height;
    context.beginPath();
    context.fillStyle = colors[agent.kind];
    context.strokeStyle = agent.satisfied === false ? '#0f172a' : 'rgba(15, 23, 42, 0.18)';
    context.lineWidth = agent.kind === 'car' ? 0 : 1;
    if (agent.kind === 'car') {
      context.roundRect(x - 8, y - 4, 16, 8, 3);
    } else {
      context.arc(x, y, agent.kind === 'ant' ? 2.5 : 4.2, 0, Math.PI * 2);
    }
    context.fill();
    context.stroke();
  }
}

function drawFields(
  context: CanvasRenderingContext2D,
  fields: FieldCell[],
  width: number,
  height: number,
  kind: SimulationState['kind'],
) {
  if (fields.length === 0) return;
  const cols = Math.max(...fields.map((field) => field.x)) + 1;
  const rows = Math.max(...fields.map((field) => field.y)) + 1;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  for (const field of fields) {
    const alpha = Math.max(0, Math.min(1, field.value));
    context.fillStyle =
      kind === 'ants'
        ? `rgba(245, 158, 11, ${alpha * 0.5})`
        : `rgba(34, 197, 94, ${0.18 + alpha * 0.45})`;
    context.fillRect(field.x * cellWidth, field.y * cellHeight, cellWidth + 1, cellHeight + 1);
  }
}

function drawTrack(
  context: CanvasRenderingContext2D,
  kind: SimulationState['kind'],
  width: number,
  height: number,
) {
  if (kind === 'traffic') {
    context.strokeStyle = '#64748b';
    context.lineWidth = 18;
    context.beginPath();
    context.moveTo(12, height / 2);
    context.lineTo(width - 12, height / 2);
    context.stroke();
    context.strokeStyle = '#f8fafc';
    context.setLineDash([10, 10]);
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(16, height / 2);
    context.lineTo(width - 16, height / 2);
    context.stroke();
    context.setLineDash([]);
  }
  if (kind === 'ants') {
    context.fillStyle = '#0f766e';
    context.beginPath();
    context.arc(width * 0.5, height * 0.5, 10, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#84cc16';
    context.beginPath();
    context.arc(width * 0.84, height * 0.26, 8, 0, Math.PI * 2);
    context.fill();
  }
}
