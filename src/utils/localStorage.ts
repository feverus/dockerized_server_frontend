import { CHAT_INPUT_STORAGE_KEY, CHAT_STORAGE_KEY, SETTINGS_STORAGE_KEY, defaultSettings } from '../assets'
import { useSettingsStore } from '../store'

export const getSavedMessages = () => {
    try {
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY)
        if (savedMessages) {
            return JSON.parse(savedMessages)
        }
        return []
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error)
        return []
    }
}

export const getInputMessage = () => {
    return JSON.parse(localStorage.getItem(CHAT_INPUT_STORAGE_KEY) ?? '""')
}

export const getCommonSettings = () => {
    try {
        const settings = localStorage.getItem(SETTINGS_STORAGE_KEY)
        if (settings) {
            return { ...defaultSettings, ...JSON.parse(settings) }
        }
        return defaultSettings
    } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
        return defaultSettings
    }
}

export const saveCommonSettings = () => {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}')
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...settings, commonScheme: useSettingsStore.getState().commonScheme }))
}
