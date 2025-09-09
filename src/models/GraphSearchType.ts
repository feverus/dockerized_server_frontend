export const GraphSearchTypes = [
    { id: 'local_search', name: 'Локальный поиск', message: ['LOCAL_SEARCH'] },
    { id: 'global_search_advanced', name: 'Глобальный поиск', message: ['GLOBAL_SEARCH_ADVANCED'] },
    { id: 'both', name: 'Оба', message: ['LOCAL_SEARCH', 'GLOBAL_SEARCH_ADVANCED'] },
]
export type GraphSearchType = (typeof GraphSearchTypes)[number]
