export const config = {
    api: 'http://localhost:8080'
};


export function loadModules(api, token) {
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