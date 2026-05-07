import { z } from 'zod';

export const parameterSchema = z.object({
  name: z.string(),
  label: z.string(),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  default: z.number(),
  unit: z.string(),
});

export const runtimeSupportSchema = z.object({
  visualPreview: z.boolean(),
  cheerpj: z.string(),
  webgpu: z.string(),
  localExplain: z.string(),
});

export const modelSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  difficulty: z.string(),
  tags: z.array(z.string()),
  sourceUrl: z.string().url(),
  license: z.string(),
  summary: z.string(),
  mechanics: z.array(z.string()),
  defaultParameters: z.array(parameterSchema),
  runtime: runtimeSupportSchema,
  simulationKind: z.enum(['wolf-sheep', 'segregation', 'traffic', 'ants', 'market']),
  teacherPrompts: z.array(z.string()),
  references: z.record(z.string(), z.string().url()),
});

export const modelLibrarySchema = z.object({
  schemaVersion: z.literal('v1'),
  models: z.array(modelSchema),
});

export const modelMetaSchema = z.object({
  schemaVersion: z.literal('v1'),
  artifactVersion: z.string(),
  generatedAt: z.string(),
  sourceCommit: z.string(),
  inputChecksum: z.string(),
  modelCount: z.number(),
});

export type LibraryModel = z.infer<typeof modelSchema>;
export type ModelLibrary = z.infer<typeof modelLibrarySchema>;
export type ModelMeta = z.infer<typeof modelMetaSchema>;
export type Parameter = z.infer<typeof parameterSchema>;
