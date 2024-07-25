const shadowHost = document.createElement('div');
shadowHost.id = 'host';
document.body.appendChild(shadowHost);
const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

const styles = document.createElement("link");
styles.rel = "stylesheet";
styles.href = chrome.runtime.getURL("note-editor.css");

shadowRoot.appendChild(styles);

const JNote = document.createElement('div');
JNote.className = 'jnote';
JNote.innerHTML = `
    <div class="setting">
        <i class="gg-chevron-down switch hide"></i>
        <i class="gg-chevron-up-o switch show" style="display: none;"></i>
    </div>
    <div class="editor">
        <div class="head"></div>
        <textarea placeholder="Write a note or capture one from this page to edit."></textarea>
        <div class="error-message" style="display: none;"></div>
        <input class="unitIdInput" type="text">
        <div class="footer">
            <button class="submit">Submit</button>
        </div>
    </div>
`;

shadowRoot.appendChild(JNote);

const setting = JNote.querySelector('.setting');
const hide = setting.querySelector('.hide');
const show = setting.querySelector('.show');
const editor = JNote.querySelector('.editor');
const textArea = editor.querySelector('textarea');
const errorMessage = editor.querySelector('.error-message');
const unitIdInput = editor.querySelector('.unitIdInput');
const submit = editor.querySelector('.submit');

submit.addEventListener('click', () => {
    const note = {
        content: textArea.value,
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
                errorMessage.textContent = "Send failed. Please verify your token.";
                errorMessage.style.display = "block";
            }
        }
    );
});

hide.addEventListener('click', () => {
    editor.style.display = 'none';
    hide.style.display = 'none';
    show.style.display = 'block';
});

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
            textArea.textContent = (text) ? `${text}\n\n${note}` : note;
        }
    }
);

function createElement(name, cssClass, parent) {
    const element = document.createElement(name);
    element.className = cssClass;
    if (parent) parent.appendChild(element);
    return element;
}
