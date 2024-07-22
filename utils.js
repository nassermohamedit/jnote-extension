export function loadModules(api, token) {
    if (!token) return;
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
            throw new Error('Response was not ok.');
        }
        return response.json();
    }).then(modules => {
        modules.forEach(module => {
            fetch(`${api}/${module.id}/units`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (!response) {
                    throw Error('Response error');
                }
                return response.json();
            }).then(units => {
                units.forEach(unit => {
                    chrome.contextMenus.create({
                        id: `noted-${unit.id}`,
                        parentId: 'noted',
                        title: unit.name,
                        contexts: ['selection']
                    });
                })
            })
        })
    });
}