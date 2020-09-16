
// Установка пункта в контекстное меню браузера
chrome.contextMenus.create(
    {
        "title": "Показать выделенный текст на отдельной вкладке",
        "contexts": ["selection"],
        "onclick": onClickHandler
    }
)

// Обработчик щелчка по пункту
function onClickHandler() {
    getText()
        // Получу выделенный текст на странице
        .then(selectedTextArr => selectedTextArr[0])
        .then(selectedText => showTextAtNextTab(selectedText))
        .catch(err => console.error(err))
}


// Функция возвращает текст выделенный на странице
function getText() {
    return promisifyCallbackFn(
        chrome.tabs.executeScript,
        // Работаю с активной вкладкой
        null,
        // Получить выделенный текст на странице
        { code: getPageSelection() }
    )
}

// Строковая функция возвращающая текст выделенный на странице
function getPageSelection() {
    return `(function getSelection(){
      return document.getSelection().toString()
    })()`;
}

// Функция показывает переданный текст на новой вкладке
function showTextAtNextTab(selectedText) {
    return promisifyCallbackFn(
        chrome.tabs.create,
        { url: makeTextAsURL(selectedText) },
    )
}

// Функция делает из переданного текста URL для показа текста на странице
function makeTextAsURL(text) {
    const blob = new Blob([`<h1>${text}</h1>`], {type: 'text/html'})
    return URL.createObjectURL(blob)
}

// Отобещанивание функции
function promisifyCallbackFn(fn, ...fnArgs) {
    return new Promise((resolve, reject) => {
        try {
            fn(...fnArgs, resolve)
        }
        catch(err) {
            reject(err)
        }
    })
}