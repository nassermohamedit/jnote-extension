import { env } from './env.js';
import { sendNote } from './utils.js';

const api = env.api;

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "JNote",
        title: "JNote",
        contexts: ["selection"],
    });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    const content = info.selectionText
    if (info.menuItemId === "JNote") {
        const note = {
            content: content,
            sourceUrl: info.pageUrl
        };
        chrome.tabs.sendMessage(tab.id, {
            action: "edit-note",
            note: note
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender);
    if (message.action === "send-note") {
        const note = message.note;
        note.content = note.content + `\n[Source](${sender.url})`;
        sendNote(api, note, (isSent) => sendResponse({success: isSent}));
    }
    return true;
})
