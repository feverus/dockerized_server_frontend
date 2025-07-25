export const SearchTypes = [
    { id: 'vector', name: 'Векторный' },
    { id: 'graph', name: 'Графовый' },
    { id: 'both', name: 'Оба' },
]

export type SearchType = (typeof SearchTypes)[number]
