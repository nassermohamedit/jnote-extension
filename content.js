chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action === 'edit-note') {
            const note = request.note
            const submitHandler = (editedText) => {
                note.content = editedText;
                const message = {
                    note: note,
                    action: 'send-note'
                }
                chrome.runtime.sendMessage(message).then(
                    response => {
                        if (response.success) {
                            markNotedText();
                            editor.editor.remove()
                        } else {
                            editor.submitError("Send failed. Please verify your token.");
                        }
                    }
                );
            }
            editor = createEditor(note, submitHandler);
        }
    }
);

const markNotedText = () => {
    console.log('Marked text.');
}

const createEditor = (note, submitHandler) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("note-editor.css");
    document.head.appendChild(link);
    const editorDiv = document.createElement("div");
    editorDiv.className = "editor";
    const textArea = document.createElement("textarea");
    textArea.textContent = note.content;
    editorDiv.appendChild(textArea);
    const formFooter = document.createElement("div");
    formFooter.className = "footer";

    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.style.display = "none";
    editorDiv.appendChild(errorMessage);

    const submitButton = document.createElement("button");
    submitButton.className = "submit";
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", () => submitHandler(textArea.value));
    formFooter.appendChild(submitButton);
    
    const cancelBottom = document.createElement("button");
    cancelBottom.className = "cancel";
    cancelBottom.textContent = "Cancel";
    cancelBottom.addEventListener("click", () => {
        editorDiv.remove();
    });
    formFooter.appendChild(cancelBottom);
    editorDiv.appendChild(formFooter);
    document.body.appendChild(editorDiv);
    return {
        editor: editorDiv,
        submitError: (message) => {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
}
