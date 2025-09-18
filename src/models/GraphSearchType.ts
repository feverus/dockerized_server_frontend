export const GraphSearchIds = ['LOCAL_SEARCH', 'GLOBAL_SEARCH_ADVANCED']

export type GraphSearchIdType = (typeof GraphSearchIds)[number]

type GraphSearchType = Map<GraphSearchIdType, { name: string; api: string }>

export const GraphSearch: GraphSearchType = new Map([
    ['LOCAL_SEARCH', { name: 'Локальный поиск', api: 'set_graph_local_search_response_type' }],
    ['GLOBAL_SEARCH_ADVANCED', { name: 'Глобальный поиск', api: 'set_graph_global_search_advanced_response_type' }],
])

export const GraphSearchIdsEmptyArray = ['None']
