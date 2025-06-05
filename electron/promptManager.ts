import translateBasePrompt from './prompts/translate';
import enhanceBasePrompt from './prompts/enhance';
import PromptComponents from './prompts/promptComponents';

interface TranslationPromptParams {
  readonly additionalInstruction: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
  readonly text: string;
}

interface EnhancePromptParams {
  readonly text: string;
  readonly language: string;
  readonly directive: string;
  readonly output: string;
}

const BASE_PROMPTS: Record<string, PromptComponents> = {
  translation: translateBasePrompt,
  enhance: enhanceBasePrompt
};

function buildTranslationPrompt(params: TranslationPromptParams): string {
  const { additionalInstruction, sourceLanguage, targetLanguage, text } = params;
  const prompt = BASE_PROMPTS.translation;
  
  const additionalInstructionFormatted = additionalInstruction 
    ? `${additionalInstruction}\n` 
    : '';
  const sourceLanguageFormatted = `Start : ${sourceLanguage}\n`;
  const targetLanguageFormatted = `Destination : ${targetLanguage}\n`;
  const textFormatted = `### Text ###\n${text}`;
  
  return [
    prompt.head,
    prompt.guide,
    prompt.instruction,
    additionalInstructionFormatted,
    sourceLanguageFormatted,
    targetLanguageFormatted,
    textFormatted
  ].join('');
}

function buildEnhancePrompt(params: EnhancePromptParams): string {
  const { text, language, directive, output } = params;
  const prompt = BASE_PROMPTS.enhance;
  const languageFormatted = `Language: ${language}\n`;
  const directiveFormatted = `Directive: ${directive}\n\n`;
  const textFormatted = `<<<TEXT>>>\n${text}\n<<<TEXT>>>\n\n`;
  const outputFormatted = `**Assistant output:**\n${output}`;

  return [
    prompt.head,
    prompt.guide,
    prompt.instruction,
    languageFormatted,
    directiveFormatted,
    textFormatted,
    outputFormatted
  ].join('');
}

const promptManager = {
  buildTranslationPrompt,
  buildEnhancePrompt
};

export default promptManager; 