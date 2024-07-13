const api = 'http://localhost:8080';

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