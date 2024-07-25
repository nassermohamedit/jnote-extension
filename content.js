const editorCssLink = document.createElement("link");
editorCssLink.rel = "stylesheet";
editorCssLink.href = chrome.runtime.getURL("note-editor.css");
document.head.appendChild(editorCssLink);

const JNote = createElement('div', 'jnote', document.body);
const setting = createElement("div", "setting", JNote);
const hide = createElement("i", "fa-solid fa-angle-down switch", setting);
const show = createElement("i", "fa-solid fa-angle-up switch", setting);
const editor = createElement("div", "editor", JNote);
const head = createElement('div', 'head', editor);
const textArea = createElement('textarea', '', editor);
textArea.placeholder = 'Write a note or capture one from this page to edit.';
const errorMessage = createElement("div", "error-message", editor);
const unitIdInput = createElement("input", "unitIdInput", editor);
errorMessage.style.display = "none";
const footer = createElement('div', "footer", editor);
const submit = createElement('button', 'submit', footer);
submit.textContent = "Submit";
submit.addEventListener('click', () => {
    const note = {
        content: textArea.textContent,
        unitId: unitIdInput.value
    }
    const message = {
        note: note,
        action: 'send-note'
    }
    chrome.runtime.sendMessage(message).then(
        response => {
            if (response.success) {
                console.log("send success!");
            } else {
                editor.submitError("Send failed. Please verify your token.");
            }
        }
    );
});
show.style.display = 'none';
hide.addEventListener('click', () => {
    editor.style.display = 'none';
    hide.style.display = 'none';
    show.style.display = 'block';
});
show.style.display = 'none';
show.addEventListener('click', () => {
    editor.style.display = 'flex';
    hide.style.display = 'block';
    show.style.display = 'none';
});




chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action === 'edit-note') {
            const note = request.note.content;
            const text = textArea.textContent;
            textArea.textContent = (text)?`${text}\n\n${note}`: note;
            
        }
    }
);

function createElement(name, cssClass, parent) {
    const element = document.createElement(name);
    element.className = cssClass;
    if (parent) parent.appendChild(element);
    return element;
}
