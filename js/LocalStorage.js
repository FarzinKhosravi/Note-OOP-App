import { NotesDisplay } from "./NoteApp.js";

let removedNotes = [];

class LocalStorage {
  static saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  static getNotes() {
    return localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes"))
      : [];
  }

  static removeNote(notes) {
    const removeNoteButtons = [...document.querySelectorAll(".notes__remove")];
    const preview = document.querySelector(".notes__preview");

    // If there is no note, it will not show the preview :
    if (!notes.length > 0) {
      preview.style.visibility = "hidden";

      return;
    }

    removeNoteButtons.forEach((btn) => {
      const id = btn.dataset.id;

      btn.addEventListener("click", (event) => {
        if (notes.length == 1) {
          event.stopPropagation();

          const removedNote = NotesDisplay.findNote(id);

          notes = notes.filter((note) => note.id !== removedNote.id);

          LocalStorage.saveNotes(notes);

          NotesDisplay.createNoteHTML(notes);

          LocalStorage.removeNote(notes);

          NotesDisplay.removeNotesStyle();

          NotesDisplay.selectNotes();

          removedNotes = [...removedNotes, removedNote];
        } else if (notes.length >= 2) {
          event.stopPropagation();

          const removedNote = NotesDisplay.findNote(id);

          const removedNoteIndex = NotesDisplay.findNoteIndex(notes, id);

          // After deleting first note, next note is automatically selected:
          if (removedNoteIndex == 0) {
            const currentNoteIndex = removedNoteIndex + 1;

            // Selects the note and shows its preview :
            NotesDisplay.createCurrentNote(currentNoteIndex);
          }

          // After deleting every note(except first note), previous note is automatically selected:
          else {
            const currentNoteIndex = removedNoteIndex - 1;

            NotesDisplay.createCurrentNote(currentNoteIndex);
          }

          notes = notes.filter((note) => note.id !== removedNote.id);

          LocalStorage.saveNotes(notes);

          NotesDisplay.createNoteHTML(notes);

          LocalStorage.removeNote(notes);

          NotesDisplay.selectNotes();

          /*
            The note(next or previous) will be automatically styled,
            and the rest of the notes will be unstyled :
          */
          NotesDisplay.setNoteStyle(removedNoteIndex);

          removedNotes = [...removedNotes, removedNote];
        }
      });
    });
  }
}

export default LocalStorage;

export { removedNotes };
