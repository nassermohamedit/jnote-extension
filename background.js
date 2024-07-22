import { env } from './env.js';
import { loadModules } from './utils.js';

const api = env.api;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get('token', data => {
        if (data.token) {
            loadModules(data.token);
        }
    })
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith("noted")) {
        const unitId = info.menuItemId.split("-")[1];
        const content = info.selectionText + `\n[Source](${info.pageUrl})`;
        const note = {
            content: content,
        };

        chrome.storage.local.get('token', data => {
            if (!data.token) return;
            fetch(`${api}/units/${unitId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(note)
            }).then(response => {
                if (!response.ok) {
                    throw Error('Response error')
                }
                // Todo - highlight the selected content in the page
            });
        })
    }
});

