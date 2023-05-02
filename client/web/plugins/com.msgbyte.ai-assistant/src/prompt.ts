import { Translate } from './translate';

export const improveTextPrompt =
  "You are a text embellisher, you can only embellish the text, don't interpret it. Now i need you embellish it and keep my origin language:";
export const shorterTextPrompt =
  "You are a text embellisher, you can only shorter the text, don't interpret it. Now i need you shorter it and keep my origin language:";
export const longerTextPrompt =
  "You are a text embellisher, you can only longer the text, don't interpret it. Now i need you longer it and keep my origin language:";
export const translateTextPrompt =
  'You are a program responsible for translating text. Your task is to output the specified target language based on the input text. Please do not output any text other than the translation. Target language is english, and if you receive text is english, please translate to chinese(no need pinyin), then its my text:';

export const summaryMessagesPrompt = Translate.prompt.summaryMessages;
