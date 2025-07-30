export const returnGreeting = (name: string = 'Пользователь') => {
    const hours = new Date().getHours()
    if (hours >= 4 && hours < 12) {
        return 'Доброе утро, ' + name + '!'
    } else if (hours >= 12 && hours < 17) {
        return 'Добрый день, ' + name + '!'
    } else if (hours >= 17 && hours < 24) {
        return 'Добрый вечер, ' + name + '!'
    } else {
        return 'Доброй ночи, ' + name + '!'
    }
}
