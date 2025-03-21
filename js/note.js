const colors = ["#FFFACD", "#AFEEEE", "#E6E6FA" ,"#FFCBD3"];

const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");

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
        updateStorage(); 
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

function updateBackground() {
    if (notesContainer.children.length > 0) {
        notesContainer.classList.add("has-notes"); 
    } else {
        notesContainer.classList.remove("has-notes"); 
    }
}

function showNotes() {
    notesContainer.innerHTML = localStorage.getItem("notes");
}
showNotes();

function updateStorage() {
    localStorage.setItem("notes", notesContainer.innerHTML);
    updateBackground();
}

createBtn.addEventListener("click", () => {
    let note = document.createElement("div");
    note.className = "note";
    note.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    let noteTitle = document.createElement("div");
    noteTitle.className = "note-title";
    noteTitle.setAttribute("contenteditable", "true");
    noteTitle.textContent = "Titre";

    let noteContent = document.createElement("div");
    noteContent.className = "note-content";
    noteContent.setAttribute("contenteditable", "true");
    noteContent.textContent = " ";

    let img = document.createElement("img");
    img.src = "/images/remove.png";
    img.className = "icone-remove";

    note.appendChild(noteTitle);
    note.appendChild(noteContent);
    note.appendChild(img);
    notesContainer.appendChild(note);

    noteTitle.addEventListener("input", updateStorage);
    noteContent.addEventListener("input", updateStorage);

    updateBackground();
});

notesContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG") {
        e.target.parentElement.remove();
        updateStorage();
    }
});