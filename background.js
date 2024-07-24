import { env } from './env.js';
import { loadModules, sendNote } from './utils.js';

const api = env.api;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get('token', data => {
        if (data.token) {
            loadModules(data.token);
        }
    })
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    const content = info.selectionText + `\n[Source](${info.pageUrl})`;
    if (info.menuItemId.startsWith("jnote")) {
        const elements = info.menuItemId.split('-');
        const moduleName = elements[1];
        const unitName = elements[2]
        const unitId = elements[3];
        const note = {
            content: content,
            unitId: unitId,
            moduleName: moduleName,
            unitName: unitName
        };
        chrome.tabs.sendMessage(tab.id, {
            action: "edit-note",
            note: note
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "send-note") {
        const note = message.note;
        sendNote(api, note);
    };
})



