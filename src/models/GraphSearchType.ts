export const GraphSearchTypes = [
    { id: 'local_search', name: 'Локальный поиск', api: 'set_graph_local_search_response_type' },
    { id: 'global_search_advanced', name: 'Глобальный поиск', api: 'set_graph_global_search_advanced_response_type' },
    { id: 'both', name: 'Оба' },
]
export type GraphSearchType = (typeof GraphSearchTypes)[number]
