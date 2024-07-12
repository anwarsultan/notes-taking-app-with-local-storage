document.getElementById('add-note').addEventListener('click', function() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value;

    if (noteText.trim() !== "") {
        addNoteToDOM(noteText); // Add the note
        noteInput.value = "";
        saveNoteToLocalStorage(noteText); // Save the note
    }
});

let editingNoteId = null; // Variable to track the note being edited

function addNoteToDOM(noteText, noteId = Date.now()) {
    const notesDiv = document.getElementById('notes');
    let noteElement = document.querySelector(`.note[data-id="${noteId}"]`);
    
    if (noteElement) {
        noteElement.innerHTML = `
            ${noteText}
            <button class="edit-btn" onclick="editNotePrompt(${noteId})" aria-label="Edit Note">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteNote(${noteId})" aria-label="Delete Note">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
    } else {
        noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.dataset.id = noteId; // Assign a unique id to each note
        noteElement.innerHTML = `
            ${noteText}
            <button class="edit-btn" onclick="editNotePrompt(${noteId})" aria-label="Edit Note">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteNote(${noteId})" aria-label="Delete Note">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        notesDiv.appendChild(noteElement);
    }
}

function saveNoteToLocalStorage(noteText, noteId) {
    const notes = getNotesFromLocalStorage();
    if (noteId) {
        const index = notes.findIndex(note => note.id === noteId);
        if (index > -1) {
            notes[index].text = noteText;
        }
    } else {
        noteId = Date.now(); // Unique id for each note
        notes.push({ id: noteId, text: noteText });
    }
    localStorage.setItem('notes', JSON.stringify(notes));
}

function getNotesFromLocalStorage() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function loadNotesFromLocalStorage() {
    const notes = getNotesFromLocalStorage();
    notes.forEach(note => addNoteToDOM(note.text, note.id));
}

function deleteNote(noteId) {
    const notes = getNotesFromLocalStorage();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    const noteElement = document.querySelector(`.note[data-id="${noteId}"]`);
    if (noteElement) {
        noteElement.remove();
    }
}

function editNotePrompt(noteId) {
    const notes = getNotesFromLocalStorage();
    const note = notes.find(note => note.id === noteId);
    if (note) {
        const newText = prompt("Edit your note:", note.text);
        if (newText !== null) {
            addNoteToDOM(newText, noteId); // Update the note display
            saveNoteToLocalStorage(newText, noteId); // Update the note in localStorage
        }
    }
}

// Load notes when the page is loaded
document.addEventListener('DOMContentLoaded', loadNotesFromLocalStorage);
