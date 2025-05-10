export const returnGreeting = (name: string | null | undefined) => {
    // ToDo а надо ли время?
    if (name === undefined || name === null) name = 'Пользователь'
    if (new Date().getHours() >= 4 && new Date().getHours() < 12)
        // return ('Доброе утро, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
        return 'Доброе утро, ' + name + '!'
    else if (new Date().getHours() >= 12 && new Date().getHours() < 17)
        // return ('Добрый день, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
        return 'Добрый день, ' + name + '!'
    else if (new Date().getHours() >= 17 && new Date().getHours() < 24)
        // return ('Добрый вечер, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
        return 'Добрый вечер, ' + name + '!'
    // return ('Доброй ночи, ' + name + '! Ваше текущее время - ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, "0"))
    else return 'Доброй ночи, ' + name + '!'
}
