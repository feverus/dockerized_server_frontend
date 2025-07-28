export const formatFullTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = [hours > 0 ? `${hours} ч ` : '', `${mins < 10 && hours > 0 ? '0' : ''}${mins} мин `, `${secs < 10 ? '0' : ''}${secs} сек`]

    return parts.join('')
}
