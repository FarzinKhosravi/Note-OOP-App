import LocalStorage, { removedNotes } from "./LocalStorage.js";

let notes = [];

// Classes :

class App {
  constructor() {
    this.displayNote = new NotesDisplay();
  }

  appHTML() {
    const app = document.querySelector(".notes");

    app.innerHTML = `
          <div class="notes__sidebar">
              <div class="notes__logo">NOTE APP</div>
              <div class="notes__list"></div>
              <button class="notes__add">ADD NOTE</button>
            </div>
            <div class="notes__preview">
              <input type="text" class="notes__title" placeholder="note title ..." />
              <textarea name="" class="notes__body">Take some note ...</textarea>
            </div>
          `;
  }

  // Sets notes that already exist :
  setupApp() {
    notes = LocalStorage.getNotes();

    if (notes.length > 0) {
      NotesDisplay.createNoteHTML(notes);

      // Preview the first note after starting the app :
      this.displayNote.notePreviewLoaded(notes);

      NotesDisplay.removeNotesStyle();

      LocalStorage.removeNote(notes);

      NotesDisplay.selectNotes();
    }
  }
}

class NotesDisplay {
  // Preview the first note after starting the app :
  notePreviewLoaded(notes) {
    const titleInput = document.querySelector(".notes__title");
    const bodyInput = document.querySelector(".notes__body");
    const preview = document.querySelector(".notes__preview");

    const note = notes.find((item, index) => index == 0);

    const id = note.id;

    titleInput.value = note.title;
    bodyInput.value = note.description;

    preview.style.visibility = "visible";

    NotesDisplay.noteEdit(id, note);
  }

  addNote() {
    const addNoteButton = document.querySelector(".notes__add");

    addNoteButton.addEventListener("click", () => {
      notes = LocalStorage.getNotes();

      const note = this.createNote();
      const id = note.id;

      notes = this.sortNotes(note);
      LocalStorage.saveNotes(notes);
      NotesDisplay.createNoteHTML(notes);

      // Only the first note is styled and the rest of the notes are not styled :
      NotesDisplay.removeNotesStyle();

      // Preview the first created note :
      this.notePreview();

      LocalStorage.removeNote(notes);

      NotesDisplay.noteEdit(id, note);

      NotesDisplay.selectNotes();
    });
  }

  createNote() {
    return {
      id: new Date().getTime(),
      title: "New Note",
      description: "Take Some Note",
      createdDate: new Date().toISOString(),
    };
  }

  sortNotes(note) {
    notes = [...notes, note];

    return (notes = notes.sort((a, b) => {
      return new Date(a.createdDate) > new Date(b.createdDate) ? -1 : 1;
    }));
  }

  static createNoteHTML(notes) {
    const descriptionMaxLength = 90;
    const titleMaxLength = 20;

    const notesList = document.querySelector(".notes__list");

    let noteHTML = "";

    notes.forEach((note) => {
      noteHTML += `
            <div class="notes__list-item bg-color" data-id="${note.id}">
          <div class="notes__introduction">
            <div class="notes__small-title title-color">${note.title.substring(
              0,
              titleMaxLength
            )}</div>
            <div class="notes__remove" data-id="${note.id}">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
          <div class="notes__small-body body-color">
          ${note.description.substring(0, descriptionMaxLength)}
          ${note.description.length > descriptionMaxLength ? "..." : ""}
          </div>
          <div class="notes__small-updated">${new Date(
            note.createdDate
          ).toLocaleString("en-US", {
            timeStyle: "short",
            dateStyle: "full",
          })}</div>
        </div>
            `;
    });

    notesList.innerHTML = noteHTML;
  }

  // Only the first note is styled and the rest of the notes are not styled :
  static removeNotesStyle() {
    let selectAllNotes = [...document.querySelectorAll(".notes__list-item")];
    let selectAllTitles = [...document.querySelectorAll(".notes__small-title")];
    let selectAllBodies = [...document.querySelectorAll(".notes__small-body")];

    selectAllNotes = selectAllNotes.filter((note, index) => index !== 0);
    selectAllTitles = selectAllTitles.filter((note, index) => index !== 0);
    selectAllBodies = selectAllBodies.filter((note, index) => index !== 0);

    selectAllNotes.forEach((item) => {
      item.classList.remove("bg-color");
    });
    selectAllTitles.forEach((item) => {
      item.classList.remove("title-color");
    });
    selectAllBodies.forEach((item) => {
      item.classList.remove("body-color");
    });
  }

  // Preview the first created note :
  notePreview() {
    const titleInput = document.querySelector(".notes__title");
    const bodyInput = document.querySelector(".notes__body");
    const preview = document.querySelector(".notes__preview");

    titleInput.value = "New Note";
    bodyInput.value = "Take Some Note...";

    preview.style.visibility = "visible";
  }

  static findNote(id) {
    notes = LocalStorage.getNotes();

    const note = notes.find((item) => item.id == id);

    return note;
  }

  static findNoteIndex(notes, id) {
    const note = NotesDisplay.findNote(id);

    const noteIndex = notes.findIndex((item) => item.id == note.id);

    return noteIndex;
  }

  // Selects the note and shows its preview :
  static createCurrentNote(currentNoteIndex) {
    const titleInput = document.querySelector(".notes__title");
    const bodyInput = document.querySelector(".notes__body");

    const currentNote = notes[currentNoteIndex];
    const id = currentNote.id;

    titleInput.value = currentNote.title;
    bodyInput.value = currentNote.description;

    NotesDisplay.noteEdit(id, currentNote);
  }

  static noteEdit(id, note) {
    const preview = document.querySelector(".notes__preview");
    const previewChildren = [...preview.children];
    const titleInput = document.querySelector(".notes__title");
    const bodyInput = document.querySelector(".notes__body");

    note = NotesDisplay.findNote(id);

    previewChildren.forEach((item) => {
      item.addEventListener("blur", () => {
        removedNotes.forEach((removeItem) => {
          notes = notes.filter((item) => item.id != removeItem.id);
        });

        note.title = titleInput.value;
        note.description = bodyInput.value;
        note.createdDate = new Date().toISOString();

        notes = notes.sort((a, b) => {
          return new Date(a.createdDate) > new Date(b.createdDate) ? -1 : 1;
        });

        LocalStorage.saveNotes(notes);

        NotesDisplay.createNoteHTML(notes);

        NotesDisplay.removeNotesStyle();

        NotesDisplay.selectNotes();

        LocalStorage.removeNote(notes);
      });
    });
  }

  static selectNotes() {
    let selectAllNotes = [...document.querySelectorAll(".notes__list-item")];
    const preview = document.querySelector(".notes__preview");
    const previewChildren = [...preview.children];

    selectAllNotes.forEach((note) => {
      const id = note.dataset.id;

      const titleInput = document.querySelector(".notes__title");
      const bodyInput = document.querySelector(".notes__body");

      const selectedNote = selectAllNotes.find((item) => item.dataset.id == id);
      const noteTitle = selectedNote.querySelector(".notes__small-title");
      const noteBody = selectedNote.querySelector(".notes__small-body");

      note.addEventListener("click", () => {
        selectAllNotes.forEach((item) => {
          const classList = item.classList;

          if (classList.contains("bg-color")) {
            item.classList.remove("bg-color");

            item
              .querySelector(".notes__small-title")
              .classList.remove("title-color");

            item
              .querySelector(".notes__small-body")
              .classList.remove("body-color");
          }
        });

        selectedNote.classList.add("bg-color");
        noteTitle.classList.add("title-color");
        noteBody.classList.add("body-color");

        const notePreview = NotesDisplay.findNote(id);

        titleInput.value = notePreview.title;
        bodyInput.value = notePreview.description;

        previewChildren.forEach((item) => {
          item.addEventListener("blur", () => {
            notePreview.title = titleInput.value;
            notePreview.description = bodyInput.value;
            notePreview.createdDate = new Date().toISOString();

            notes = notes.sort((a, b) => {
              return new Date(a.createdDate) > new Date(b.createdDate) ? -1 : 1;
            });

            LocalStorage.saveNotes(notes);

            NotesDisplay.createNoteHTML(notes);

            NotesDisplay.removeNotesStyle();

            NotesDisplay.selectNotes();

            LocalStorage.removeNote(notes);
          });
        });
      });
    });
  }

  /*
    The note(next or previous) will be automatically styled,
    and the rest of the notes will be unstyled :
  */
  static setNoteStyle(removedNoteIndex) {
    if (removedNoteIndex == 0) {
      NotesDisplay.removeNotesStyle();
    } else {
      let selectAllNotes = [...document.querySelectorAll(".notes__list-item")];

      const currentNoteIndex = removedNoteIndex - 1;

      const currentNote = notes[currentNoteIndex];
      const id = currentNote.id;

      //

      const currentNoteHTML = selectAllNotes.find(
        (note) => note.dataset.id == id
      );

      const currentNoteTitle = currentNoteHTML.querySelector(
        ".notes__small-title"
      );

      const currentNoteBody =
        currentNoteHTML.querySelector(".notes__small-body");

      currentNoteHTML.classList.add("bg-color");
      currentNoteTitle.classList.add("title-color");
      currentNoteBody.classList.add("body-color");

      //

      selectAllNotes = selectAllNotes.filter((item) => item.dataset.id != id);

      selectAllNotes.forEach((item) => {
        const titleNote = item.querySelector(".notes__small-title");
        const bodyNote = item.querySelector(".notes__small-body");

        item.classList.remove("bg-color");
        titleNote.classList.remove("title-color");
        bodyNote.classList.remove("body-color");
      });
    }
  }

  // Sets scroll notes with drag and drop :
  setNotesScroll() {
    const notesList = document.querySelector(".notes__list");
    notesList.style.cursor = "pointer";

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function (e) {
      notesList.style.cursor = "pointer";
      notesList.style.userSelect = "none";

      pos = {
        left: notesList.scrollLeft,
        top: notesList.scrollTop,
        // Get the current mouse position :
        x: e.clientX,
        y: e.clientY,
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
      // How far the mouse has been moved :
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      // Scroll the element :
      notesList.scrollTop = pos.top - dy;
      notesList.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
      notesList.style.cursor = "pointer";
      notesList.style.removeProperty("user-select");

      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    // Attach the handler :
    notesList.addEventListener("mousedown", mouseDownHandler);
  }
}

export { App, NotesDisplay };
