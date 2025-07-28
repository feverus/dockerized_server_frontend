import { Chip } from '@mui/material'

type TagProps = { tag: string }

const getLabel = (tag: string) => {
    switch (tag) {
        case 'local_search_chunk':
            return 'Графовый локальный поиск'
        case 'global_search_chunk':
            return 'Графовый глобальный поиск'
        case 'chunk':
            return 'Векторный поиск'
    }
    return tag
}

const getColor = (tag: string) => {
    switch (tag) {
        case 'local_search_chunk':
            return '#5060a050'
        case 'global_search_chunk':
            return '#a0605050'
        case 'chunk':
            return '#50a06050'
    }
    return '#60606050'
}

export const Tag = ({ tag }: TagProps) => {
    return (
        <Chip
            label={getLabel(tag)}
            size="small"
            sx={{
                backgroundColor: getColor(tag),
                marginRight: '10px',
                marginTop: '10px',
                borderRadius: '5px',
            }}
        />
    )
}
