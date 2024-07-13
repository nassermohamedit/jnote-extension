const api = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    const setTokenButton = document.getElementById('setTokenButton');
    const reloadButton = document.getElementById('reloadButton');

    setTokenButton.addEventListener('click', () => {
        const tokenInput = document.getElementById('token').value;
        if (tokenInput) {
            chrome.storage.local.set({'token': tokenInput}, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error setting item:", chrome.runtime.lastError);
                }
            });
            loadModules(tokenInput);
            alert('Token set successfully!');
        }
    });

    reloadButton.addEventListener('click', () => {
        chrome.storage.local.get('token', data => {
            loadModules(data.token);
        });
    });
});

const loadModules = (token) => {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "noted",
        title: "Note it",
        contexts: ["selection"],
    });
    fetch(api, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (!response.ok) {
            console.log(response);
            throw new Error('Response was not ok.');
        }
        return response.json();
    }).then(modules => {
        modules.forEach(module => {
            chrome.contextMenus.create({
                id: `noted-${module.id}`,
                parentId: 'noted',
                title: module.name,
                contexts: ['selection']
            });
        })
    });
}