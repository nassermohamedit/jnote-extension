export function loadModules(api, token) {
    if (!token) return;
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "jnote",
        title: "Note It",
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
            chrome.contextMenus.create({
                id: `jnote-${module.name}`,
                parentId: 'jnote',
                title: `${module.name}`,
                contexts: ['selection']
            });
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
                        id: `jnote-${module.name}-${unit.name}-${unit.id}`,
                        parentId: `jnote-${module.name}`,
                        title: `${unit.name}`,
                        contexts: ['selection']
                    });
                })
            })
        })
    });
}

const sendNote = (api, note) => { 
    chrome.storage.local.get('token', data => {
        if (!data.token) return;
        fetch(`${api}/units/${note.unitId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
                content: note.content
            })
        }).then(response => {
            if (!response.ok) {
                console.log('Response error: ', response)
            }
            // Todo - highlight the selected content in the page
        });
    })
}