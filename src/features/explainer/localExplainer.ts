import type { LibraryModel } from '../library/modelSchema';

export type Explanation = {
  headline: string;
  plainLanguage: string;
  mechanics: string[];
  tryThis: string[];
};

export function explainModel(model: LibraryModel): Explanation {
  const parameterNames = model.defaultParameters.map((parameter) => parameter.label.toLowerCase());
  const leverText =
    parameterNames.length > 0
      ? `The main levers are ${parameterNames.join(', ')}. Move one at a time and watch whether the pattern returns to balance or runs away.`
      : 'Start and stop the model to watch whether its pattern stabilizes or keeps changing.';

  return {
    headline: `${model.title} in one minute`,
    plainLanguage: `${model.summary} ${leverText}`,
    mechanics: model.mechanics,
    tryThis: model.teacherPrompts,
  };
}
