import { App, NotesDisplay } from "./NoteApp.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  const displayNote = new NotesDisplay();

  app.appHTML();

  // Sets notes that already exist :
  app.setupApp();

  displayNote.addNote();

  // Sets scroll notes with drag and drop :
  displayNote.setNotesScroll();
});
