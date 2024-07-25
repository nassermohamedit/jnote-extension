export function loadModules(api, token) {
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

export const sendNote = (api, note, postSendHandler) => {
    chrome.storage.local.get('token', data => {
        if (data.token)
            doSend(api, note, data.token).then(success => postSendHandler(success));
    })
}

const doSend = async (api, note, token) => {
    try {
        const response = await fetch(`${api}/units/${note.unitId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content: note.content
            })
        });
        return !!response.ok;
    } catch (error) {
        return false;
    }
};