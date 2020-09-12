

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

    let selectedText;
    let currentTab;


    getText()
        // Получу выделенный текст на странице
        .then(text => selectedText = text)

        // Получу данные об активной вкладке
        .then(() => getActiveTab())

        // Помещу данные об активной вкладке в currentTab
        .then(tab => currentTab = tab)

        // Продублирую активную вкладку
        .then(() => duplicateTab(currentTab))

        // Получу данные о дублированной вкладке
        .then(() => getActiveTab())

        // Помещу данные о дублированной вкладке в currentTab
        .then(tab => currentTab = tab)

        // Добавлю выделенный текст на страницу
        .then(() => writeNewTextOnPage(currentTab, selectedText))
        .catch(err => console.error(err))
}


// Функция возвращает текст выделенный на странице
function getText() {
    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript(
            null,
            // Получить выделенный текст на странице
            { code: getPageSelection() },
            function(selectedTextsArr) {
                resolve(selectedTextsArr[0])
            }
        )
    })
}

// Строковая функция возвращающая текст выделенный на странице
function getPageSelection() {
    return `(function getSelection(){
      return document.getSelection().toString()
    })()`;
}

// Функция получает данные о выделенной вкладке
function getActiveTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0]

            resolve(currentTab)
        })
    })
}

// Функция дублирует вкладку
function duplicateTab(tab) {
    return new Promise((resolve, reject) => {
        chrome.tabs.create(
            { url: tab.url },
            function () {
                resolve()
            }
        )
    })
}

// Функция стирает содержимое страницы и ставит новый текст
function writeNewTextOnPage(tab, text) {
    const pageScript = `document.body.innerHTML = '<h1>${text}</h1>'`

    chrome.tabs.executeScript(
        tab.id,
        { code: pageScript },
    )
}