import { useEffect, useRef } from 'react'

export const usePrevious = (value: string | undefined): string | undefined => {
    const ref = useRef<string | undefined>(undefined)
    useEffect(() => {
        ref.current = value ? value.replaceAll('/', '') : undefined
    }, [value])
    return ref.current
}
