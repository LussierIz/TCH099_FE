const colors = ["#FFFACD", "#AFEEEE", "#E6E6FA", "#FFCBD3"];
const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");


function createDebouncedUpdate(note) {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => updateNoteOnServer(note), 500);
    };
}

createBtn.addEventListener("click", async () => {
    const noteId = await saveNoteToServer("Titre", "Contenu...");
    if (!noteId) return; 

    let note = document.createElement("div");
    note.className = "note";
    note.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    note.dataset.id = noteId;

    let noteTitle = document.createElement("div");
    noteTitle.className = "note-title";
    noteTitle.setAttribute("contenteditable", "true");
    noteTitle.textContent = "Titre";

    let noteContent = document.createElement("div");
    noteContent.className = "note-content";
    noteContent.setAttribute("contenteditable", "true");
    noteContent.textContent = "Contenu...";

    let img = document.createElement("img");
    img.src = "/images/remove.png";
    img.className = "icone-remove";

    note.appendChild(noteTitle);
    note.appendChild(noteContent);
    note.appendChild(img);

    const debouncedUpdate = createDebouncedUpdate(note);
    noteTitle.addEventListener("input", debouncedUpdate);
    noteContent.addEventListener("input", debouncedUpdate);
    notesContainer.appendChild(note);


    updateNoteOnServer(note);
});


notesContainer.addEventListener("click", function (e) {
    const note = e.target.closest(".note");
    if (note) {
        note.classList.toggle("expanded");

        if (note.classList.contains("expanded")) {
            notesContainer.classList.add("blur-notes");
        } else {
            notesContainer.classList.remove("blur-notes");
        }
    }
    if (e.target.tagName === "IMG") {
        const noteToRemove = e.target.parentElement;
        if (noteToRemove.classList.contains("expanded")) {
            notesContainer.classList.remove("blur-notes");
        }
        noteToRemove.remove();
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const expandedNote = document.querySelector(".note.expanded");
        if (expandedNote) {
            expandedNote.classList.remove("expanded");
            notesContainer.classList.remove("blur-notes");
        }
    }
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".note")) {
        const expandedNote = document.querySelector(".note.expanded");
        if (expandedNote) {
            expandedNote.classList.remove("expanded");
            notesContainer.classList.remove("blur-notes");
        }
    }
});

// function updateBackground() {
//     if (notesContainer.children.length > 0) {
//         notesContainer.classList.add("has-notes");
//     } else {
//         notesContainer.classList.remove("has-notes");
//     }
// }

loadNotesFromServer();

notesContainer.addEventListener("click", async function (e) {
    if (e.target.tagName === "IMG") {
        const noteElement = e.target.closest(".note");
        const noteId = noteElement.dataset.id;

        if (noteElement.classList.contains("expanded")) {
            notesContainer.classList.remove("blur-notes");
        }

        if (noteId) {
            await deleteNoteFromServer(noteId);
        }

        noteElement.remove();
    }
});

async function saveNoteToServer(titre, contenu) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return null;

    try {
        const response = await fetch('http://localhost:8000/api/notes/save', {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + user.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titre: titre,
                contenu: contenu,
                id_utilisateur: user.user_id
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Note enregistrée:', result);
            return result.id_note; // Retourner l'ID de la note
        } else {
            console.error('Erreur:', result);
            return null;
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
        return null;
    }
}

async function updateNoteOnServer(noteElement) {
    const noteId = noteElement.dataset.id;
    const title = noteElement.querySelector(".note-title").textContent.trim();
    const content = noteElement.querySelector(".note-content").textContent.trim();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!noteId) {
        console.warn("Pas d'ID pour cette note, on ne peut pas mettre à jour.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/notes/update/${noteId}`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + user.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titre: title,
                contenu: content
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Note mise à jour :", result);
        } else {
            console.error("Erreur mise à jour :", result);
        }
    } catch (err) {
        console.error("Erreur réseau :", err);
    }
}

async function loadNotesFromServer() {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch(`http://localhost:8000/api/notes/${user.user_id}`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + user.token,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            notesContainer.innerHTML = '';

            result.notes.forEach(note => {
                let noteElement = document.createElement("div");
                noteElement.className = "note";
                noteElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                noteElement.dataset.id = note.id_note;

                let noteTitle = document.createElement("div");
                noteTitle.className = "note-title";
                noteTitle.setAttribute("contenteditable", "true");
                noteTitle.textContent = note.titre || "Titre";

                let noteContent = document.createElement("div");
                noteContent.className = "note-content";
                noteContent.setAttribute("contenteditable", "true");
                noteContent.textContent = note.contenu || " ";

                let img = document.createElement("img");
                img.src = "/images/remove.png";
                img.className = "icone-remove";

                noteElement.appendChild(noteTitle);
                noteElement.appendChild(noteContent);
                noteElement.appendChild(img);
                notesContainer.appendChild(noteElement);

                // Définir le debounce pour chaque note
                const debouncedUpdate = createDebouncedUpdate(noteElement);
                noteTitle.addEventListener("input", debouncedUpdate);
                noteContent.addEventListener("input", debouncedUpdate);
            });

            // updateBackground();
        } else {
            console.error('Error loading notes:', result);
        }
    } catch (error) {
        console.error('Network error loading notes:', error);
    }
}

async function deleteNoteFromServer(noteId) {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await fetch(`http://localhost:8000/api/notes/delete/${noteId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + user.token,
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    if (response.ok) {
        console.log("Note supprimée:", result);
    } else {
        console.error("Erreur suppression:", result);
    }
}