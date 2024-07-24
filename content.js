chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action === 'edit-note') {
            const note = request.note
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
    
            const submitButton = document.createElement("button");
            submitButton.className = "submit";
            submitButton.textContent = "Submit";
            submitButton.addEventListener("click", () => {
                note.content = textArea.value;
                chrome.runtime.sendMessage({ action: "send-note", note: note}, function(response) {
            });
                editorDiv.remove();
            });
    
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
        }
    }
)