import { env } from './env.js';
import { loadModules } from './utils.js';

const api = env.api;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get('token', data => {
        loadModules(data.token);
    })
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith("noted")) {
        const moduleId = info.menuItemId.split("-")[1];
        const content = info.selectionText;

        const note = {
            content: content,
        };

        chrome.storage.local.get('token', data => {
            fetch(`${api}/${moduleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(note)
            }).then(response => {
                console.log(response);
                if (!response.ok) {
                    console.error("Failed to add note.");
                }
            }).catch(error => console.log('Error adding note: ', error));
        })
    }
});

