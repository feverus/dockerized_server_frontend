export const GraphSearchTypes = [
    { id: 'local_search', name: 'Локальный поиск' },
    { id: 'global_search_advanced', name: 'Глобальный поиск' },
    { id: 'both', name: 'Оба' },
]
export type GraphSearchType = (typeof GraphSearchTypes)[number]
