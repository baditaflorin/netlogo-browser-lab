import {
  modelLibrarySchema,
  modelMetaSchema,
  type ModelLibrary,
  type ModelMeta,
} from './modelSchema';

const dataUrl = (file: string) => `${import.meta.env.BASE_URL}data/v1/${file}`;

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

export async function fetchModelLibrary(): Promise<ModelLibrary> {
  return modelLibrarySchema.parse(await fetchJson(dataUrl('models.json')));
}

export async function fetchModelMeta(): Promise<ModelMeta> {
  return modelMetaSchema.parse(await fetchJson(dataUrl('models.meta.json')));
}
