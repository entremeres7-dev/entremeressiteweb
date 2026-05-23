import type { SosMamanPostType } from './types';

export const SOS_POST_TYPES: {
  id: SosMamanPostType;
  label: string;
  shortLabel: string;
  icon: 'heart' | 'help-circle' | 'bar-chart';
  placeholder: string;
  composeTitle: string;
}[] = [
  {
    id: 'question',
    label: 'Question du quotidien',
    shortLabel: 'Question',
    icon: 'help-circle',
    placeholder: 'Ex. : Quel lait en poudre utilisez-vous ? Des conseils pour le sommeil ?',
    composeTitle: 'Ma question',
  },
  {
    id: 'confession',
    label: 'Confidence',
    shortLabel: 'Confidence',
    icon: 'heart',
    placeholder: 'Écrivez ce que vous ressentez, sans filtre…',
    composeTitle: 'Ma confidence',
  },
  {
    id: 'poll',
    label: 'Sondage',
    shortLabel: 'Sondage',
    icon: 'bar-chart',
    placeholder: 'Ex. : Quel lait utilisez-vous pour votre bébé ?',
    composeTitle: 'Mon sondage',
  },
];

export function getPostTypeMeta(type: SosMamanPostType) {
  return SOS_POST_TYPES.find((t) => t.id === type) ?? SOS_POST_TYPES[0];
}
