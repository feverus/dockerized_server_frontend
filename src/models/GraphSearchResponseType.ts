export const GraphSearchResponseTypes = [
    { id: 'Multiple Paragraphs', name: 'Несколько параграфов' },
    { id: 'Single Paragraph', name: 'Параграф' },
    { id: 'Single Sentence', name: 'Предложение' },
    { id: 'List of 3-7 Points', name: 'Список' },
    { id: 'Single Page', name: 'Страница' },
    { id: 'Multi-Page Report', name: 'Многостраничный отчет' },
]
export type GraphSearchResponseType = (typeof GraphSearchResponseTypes)[number]
