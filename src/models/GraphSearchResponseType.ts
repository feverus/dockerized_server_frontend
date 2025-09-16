export const GraphSearchResponseIds = [
    'Multiple Paragraphs',
    'Single Paragraph',
    'Single Sentence',
    'List of 3-7 Points',
    'Single Page',
    'Multi-Page Report',
] as const

export type GraphSearchResponseIdType = (typeof GraphSearchResponseIds)[number]

type GraphSearchResponseType = Map<GraphSearchResponseIdType, { name: string }>

export const GraphSearchResponse: GraphSearchResponseType = new Map([
    ['Multiple Paragraphs', { name: 'Несколько параграфов' }],
    ['Single Paragraph', { name: 'Один параграф' }],
    ['Single Sentence', { name: 'Одно предложение' }],
    ['List of 3-7 Points', { name: 'Список из 3-7 пунктов' }],
    ['Single Page', { name: 'Одна страница' }],
    ['Multi-Page Report', { name: 'Многостраничный отчет' }],
])
