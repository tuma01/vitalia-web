module.exports = {
    configurations: {
        'chrome.laptop': {
            target: 'chrome.docker',
            width: 1366,
            height: 768,
            deviceScaleFactor: 1,
            mobile: false,
        },
        'chrome.iphone': {
            target: 'chrome.docker',
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            mobile: true,
        },
    },
    storiesFilter: 'critical', // Solo ejecutamos regresión en historias críticas
    threshold: 0.1, // Tolerancia de 0.1% de píxeles
    chromeSelector: '.sb-show-main',
};
