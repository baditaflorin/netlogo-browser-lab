import type { LibraryModel } from '../library/modelSchema';

export type AgentKind = 'sheep' | 'wolf' | 'red' | 'blue' | 'car' | 'ant' | 'buyer' | 'seller';

export type Agent = {
  id: number;
  kind: AgentKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  satisfied?: boolean;
};

export type FieldCell = {
  x: number;
  y: number;
  value: number;
};

export type SimulationState = {
  kind: LibraryModel['simulationKind'];
  tick: number;
  width: number;
  height: number;
  agents: Agent[];
  fields: FieldCell[];
  metrics: Record<string, number>;
};

type Rng = () => number;

export function createSimulation(model: LibraryModel, seed = 42): SimulationState {
  const rng = mulberry32(seed);
  const parameters = Object.fromEntries(
    model.defaultParameters.map((parameter) => [parameter.name, parameter.default]),
  );

  switch (model.simulationKind) {
    case 'wolf-sheep':
      return createWolfSheep(parameters, rng);
    case 'segregation':
      return createSegregation(parameters, rng);
    case 'traffic':
      return createTraffic(parameters, rng);
    case 'ants':
      return createAnts(parameters, rng);
    case 'market':
      return createMarket(parameters, rng);
  }
}

export function stepSimulation(state: SimulationState): SimulationState {
  switch (state.kind) {
    case 'wolf-sheep':
      return stepWolfSheep(state);
    case 'segregation':
      return stepSegregation(state);
    case 'traffic':
      return stepTraffic(state);
    case 'ants':
      return stepAnts(state);
    case 'market':
      return stepMarket(state);
  }
}

function createWolfSheep(params: Record<string, number>, rng: Rng): SimulationState {
  const fields = grid(28, 20, () => 0.35 + rng() * 0.65);
  const sheep = agents(params.initialSheep ?? 90, 'sheep', rng, 100, 70);
  const wolves = agents(params.initialWolves ?? 35, 'wolf', rng, 100, 70);
  return metrics({
    kind: 'wolf-sheep',
    tick: 0,
    width: 100,
    height: 70,
    fields,
    agents: [...sheep, ...wolves],
    metrics: {},
  });
}

function stepWolfSheep(state: SimulationState): SimulationState {
  const fields = state.fields.map((cell) => ({ ...cell, value: Math.min(1, cell.value + 0.015) }));
  const agents = state.agents
    .map((agent) => {
      const nearest = nearestOther(agent, state.agents, agent.kind === 'wolf' ? 'sheep' : 'wolf');
      const chase =
        agent.kind === 'wolf' && nearest
          ? direction(agent, nearest, 0.8)
          : randomDrift(agent.id + state.tick);
      const avoid =
        agent.kind === 'sheep' && nearest ? direction(nearest, agent, 0.6) : { x: 0, y: 0 };
      const next = wrap(
        {
          ...agent,
          x: agent.x + agent.vx + chase.x + avoid.x,
          y: agent.y + agent.vy + chase.y + avoid.y,
        },
        state,
      );
      next.energy -= agent.kind === 'wolf' ? 0.55 : 0.2;
      if (agent.kind === 'sheep') {
        const cell = fields[Math.abs(Math.floor(next.x + next.y * 3)) % fields.length];
        if (cell.value > 0.5) {
          next.energy += 2.2;
          cell.value = 0.05;
        }
      }
      if (agent.kind === 'wolf' && nearest && distance(next, nearest) < 3.2) {
        next.energy += 8;
      }
      return next;
    })
    .filter((agent) => agent.energy > 0);

  const eaten = new Set<number>();
  agents.forEach((wolf) => {
    if (wolf.kind !== 'wolf') return;
    const sheep = nearestOther(wolf, agents, 'sheep');
    if (sheep && distance(wolf, sheep) < 3.2) eaten.add(sheep.id);
  });
  const survivors = agents.filter((agent) => !eaten.has(agent.id));
  const born = survivors.flatMap((agent) =>
    agent.energy > 13 && (agent.id + state.tick) % 17 === 0
      ? [{ ...agent, id: agent.id + 10000 + state.tick, energy: agent.energy / 2 }]
      : [],
  );
  return metrics({ ...state, tick: state.tick + 1, fields, agents: [...survivors, ...born] });
}

function createSegregation(params: Record<string, number>, rng: Rng): SimulationState {
  const count = Math.round(((params.density ?? 78) / 100) * 560);
  return metrics({
    kind: 'segregation',
    tick: 0,
    width: 100,
    height: 70,
    fields: [],
    agents: agents(count, 'red', rng, 100, 70).map((agent, index) => ({
      ...agent,
      kind: index % 2 === 0 ? 'red' : 'blue',
    })),
    metrics: {},
  });
}

function stepSegregation(state: SimulationState): SimulationState {
  const agents = state.agents.map((agent) => {
    const neighbors = state.agents.filter(
      (other) => other.id !== agent.id && distance(agent, other) < 9,
    );
    const similar = neighbors.filter((other) => other.kind === agent.kind).length;
    const ratio = neighbors.length === 0 ? 1 : similar / neighbors.length;
    if (ratio < 0.35) {
      return {
        ...agent,
        x: (agent.x * 1.7 + state.tick * 13) % state.width,
        y: (agent.y * 1.3 + state.tick * 7) % state.height,
        satisfied: false,
      };
    }
    return { ...agent, satisfied: true };
  });
  return metrics({ ...state, tick: state.tick + 1, agents });
}

function createTraffic(params: Record<string, number>, rng: Rng): SimulationState {
  const count = Math.round(params.cars ?? 38);
  const cars = agents(count, 'car', rng, 100, 70).map((agent, index) => ({
    ...agent,
    x: (index / count) * 100,
    y: 35 + Math.sin(index) * 2,
    vx: 0.4 + rng() * 0.8,
  }));
  return metrics({
    kind: 'traffic',
    tick: 0,
    width: 100,
    height: 70,
    fields: [],
    agents: cars,
    metrics: {},
  });
}

function stepTraffic(state: SimulationState): SimulationState {
  const sorted = [...state.agents].sort((a, b) => a.x - b.x);
  const agents = sorted.map((car, index) => {
    const next = sorted[(index + 1) % sorted.length];
    const gap = next.x > car.x ? next.x - car.x : state.width - car.x + next.x;
    const speed = gap < 8 ? Math.max(0.15, car.vx - 0.18) : Math.min(1.8, car.vx + 0.05);
    return { ...car, vx: speed, x: (car.x + speed) % state.width };
  });
  return metrics({ ...state, tick: state.tick + 1, agents });
}

function createAnts(params: Record<string, number>, rng: Rng): SimulationState {
  return metrics({
    kind: 'ants',
    tick: 0,
    width: 100,
    height: 70,
    fields: grid(34, 22, () => 0),
    agents: agents(params.ants ?? 75, 'ant', rng, 100, 70).map((agent) => ({
      ...agent,
      x: 50,
      y: 35,
      energy: rng() > 0.5 ? 1 : 0,
    })),
    metrics: {},
  });
}

function stepAnts(state: SimulationState): SimulationState {
  const food = { x: 84, y: 18 };
  const home = { x: 50, y: 35 };
  const fields = state.fields.map((cell) => ({ ...cell, value: cell.value * 0.96 }));
  const ants = state.agents.map((ant) => {
    const target = ant.energy > 0.8 ? home : food;
    const pull = direction(ant, target, 0.45);
    const jitter = randomDrift(ant.id + state.tick);
    const next = wrap(
      { ...ant, x: ant.x + pull.x + jitter.x, y: ant.y + pull.y + jitter.y },
      state,
    );
    const cell = fields[Math.abs(Math.floor(next.x / 3 + next.y / 3)) % fields.length];
    cell.value = Math.min(1, cell.value + (ant.energy > 0.8 ? 0.12 : 0.02));
    if (distance(next, food) < 4) next.energy = 1;
    if (distance(next, home) < 4) next.energy = 0;
    return next;
  });
  return metrics({ ...state, tick: state.tick + 1, fields, agents: ants });
}

function createMarket(params: Record<string, number>, rng: Rng): SimulationState {
  const buyers = agents(params.buyers ?? 50, 'buyer', rng, 100, 70);
  const sellers = agents(params.sellers ?? 45, 'seller', rng, 100, 70);
  return metrics({
    kind: 'market',
    tick: 0,
    width: 100,
    height: 70,
    fields: [],
    agents: [...buyers, ...sellers],
    metrics: { price: 50 },
  });
}

function stepMarket(state: SimulationState): SimulationState {
  const price = state.metrics.price ?? 50;
  const pressure =
    state.agents.filter((agent) => agent.kind === 'buyer').length -
    state.agents.filter((agent) => agent.kind === 'seller').length;
  const nextPrice = Math.max(
    5,
    Math.min(95, price + pressure * 0.01 + Math.sin(state.tick / 7) * 0.8),
  );
  const agents = state.agents.map((agent) => {
    const center = agent.kind === 'buyer' ? nextPrice : 100 - nextPrice;
    return wrap(
      {
        ...agent,
        x: agent.x + (center - agent.x) * 0.02 + randomDrift(agent.id + state.tick).x,
        y: agent.y + randomDrift(agent.id).y,
      },
      state,
    );
  });
  return metrics({
    ...state,
    tick: state.tick + 1,
    agents,
    metrics: { ...state.metrics, price: nextPrice },
  });
}

function agents(count: number, kind: AgentKind, rng: Rng, width: number, height: number): Agent[] {
  return Array.from({ length: Math.max(0, Math.round(count)) }, (_, index) => ({
    id: index + 1,
    kind,
    x: rng() * width,
    y: rng() * height,
    vx: rng() - 0.5,
    vy: rng() - 0.5,
    energy: 6 + rng() * 8,
  }));
}

function grid(cols: number, rows: number, value: () => number): FieldCell[] {
  return Array.from({ length: cols * rows }, (_, index) => ({
    x: index % cols,
    y: Math.floor(index / cols),
    value: value(),
  }));
}

function metrics(state: SimulationState): SimulationState {
  const counts = state.agents.reduce<Record<string, number>>((acc, agent) => {
    acc[agent.kind] = (acc[agent.kind] ?? 0) + 1;
    return acc;
  }, {});
  const averageSpeed =
    state.agents.reduce((sum, agent) => sum + Math.abs(agent.vx), 0) /
    Math.max(1, state.agents.length);
  const satisfaction =
    state.agents.filter((agent) => agent.satisfied).length / Math.max(1, state.agents.length);
  return { ...state, metrics: { ...state.metrics, ...counts, averageSpeed, satisfaction } };
}

function mulberry32(seed: number): Rng {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wrap(agent: Agent, state: SimulationState): Agent {
  return {
    ...agent,
    x: (agent.x + state.width) % state.width,
    y: (agent.y + state.height) % state.height,
  };
}

function distance(a: Pick<Agent, 'x' | 'y'>, b: Pick<Agent, 'x' | 'y'>): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function nearestOther(agent: Agent, agents: Agent[], kind: AgentKind): Agent | undefined {
  return agents
    .filter((other) => other.kind === kind)
    .sort((a, b) => distance(agent, a) - distance(agent, b))[0];
}

function direction(from: Pick<Agent, 'x' | 'y'>, to: Pick<Agent, 'x' | 'y'>, scale: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  return { x: (dx / length) * scale, y: (dy / length) * scale };
}

function randomDrift(seed: number) {
  const rng = mulberry32(seed);
  return { x: rng() - 0.5, y: rng() - 0.5 };
}
