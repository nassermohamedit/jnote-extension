import { env } from './env.js';
import { loadModules } from './utils.js';

const api = env.api;

document.addEventListener('DOMContentLoaded', () => {
    const setTokenButton = document.getElementById('setTokenButton');
    const reloadButton = document.getElementById('reloadButton');

    setTokenButton.addEventListener('click', () => {
        const tokenInput = document.getElementById('token').value;
        if (tokenInput) {
            console.log('khra', tokenInput);
            chrome.storage.local.set({'token': tokenInput}, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error setting item:", chrome.runtime.lastError);
                }
            });
            loadModules(api, tokenInput);
            alert('Token set successfully!');
        }
    });

    reloadButton.addEventListener('click', () => {
        chrome.storage.local.get('token', data => {
            loadModules(api, data.token);
        });
    });
});
