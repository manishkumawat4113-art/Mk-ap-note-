// ==========================================
// 1. HTML ELEMENTS SELECT KARNA
// ==========================================

const addNoteBtn =
    document.querySelector("#addNoteBtn");

const noteModal =
    document.querySelector("#noteModal");

const closeModalBtn =
    document.querySelector("#closeModalBtn");

const noteForm =
    document.querySelector("#noteForm");

const noteTitle =
    document.querySelector("#noteTitle");

const noteContent =
    document.querySelector("#noteContent");

const categoryInput =
    document.querySelector("#categoryInput");

const notesContainer =
    document.querySelector("#notesContainer");

const searchInput =
    document.querySelector("#searchInput");

const filters =
    document.querySelector(".filters");

const totalCount =
    document.querySelector("#totalCount");

const pinnedCount =
    document.querySelector("#pinnedCount");

const deleteAllBtn =
    document.querySelector("#deleteAllBtn");

const emptyMessage =
    document.querySelector("#emptyMessage");

const themeBtn =
    document.querySelector("#themeBtn");

const modalTitle =
    document.querySelector("#modalTitle");


// ==========================================
// 2. APPLICATION STATE
// ==========================================

let notes =
    JSON.parse(
        localStorage.getItem("notes")
    ) || [];

let currentCategory = "all";

let editingNoteId = null;


// ==========================================
// 3. SAVE NOTES
// ==========================================

function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

}


// ==========================================
// 4. GENERATE ID
// ==========================================

function generateId() {

    return Date.now();

}


// ==========================================
// 5. GET SELECTED COLOR
// ==========================================

function getSelectedColor() {

    const selected =
        document.querySelector(
            'input[name="noteColor"]:checked'
        );


    return selected
        ? selected.value
        : "yellow";

}


// ==========================================
// 6. OPEN MODAL
// ==========================================

function openModal() {

    noteModal.classList.remove("hidden");

    noteTitle.focus();

}


// ==========================================
// 7. CLOSE MODAL
// ==========================================

function closeModal() {

    noteModal.classList.add("hidden");

    noteForm.reset();

    editingNoteId = null;

    modalTitle.textContent = "New Note";

}


// ==========================================
// 8. ADD NOTE
// ==========================================

function addNote() {

    const title =
        noteTitle.value.trim();

    const content =
        noteContent.value.trim();

    const category =
        categoryInput.value;

    const color =
        getSelectedColor();


    if (
        title === "" &&
        content === ""
    ) {

        alert("Note me kuch likho.");

        return;
    }


    const newNote = {

        id: generateId(),

        title:
            title || "Untitled Note",

        content: content,

        category: category,

        color: color,

        pinned: false,

        createdAt:
            new Date().toLocaleString()

    };


    notes.push(newNote);


    saveNotes();

    closeModal();

    renderNotes();

}


// ==========================================
// 9. CREATE NOTE ELEMENT
// ==========================================

function createNoteElement(note) {

    const article =
        document.createElement("article");


    article.className =
        `note-card note-${note.color}`;


    article.dataset.id =
        note.id;


    const pinIcon =
        note.pinned
            ? "📌"
            : "";


    article.innerHTML = `

        <div class="note-header">

            <h2 class="note-title">
                ${escapeHTML(note.title)}
            </h2>

            <span class="pin-icon">
                ${pinIcon}
            </span>

        </div>


        <div class="note-content">
            ${escapeHTML(note.content)}
        </div>


        <div class="note-actions">

            <button
                class="edit-note"
                data-action="edit"
            >
                Edit
            </button>

            <button
                class="pin-note"
                data-action="pin"
            >
                ${note.pinned ? "Unpin" : "Pin"}
            </button>

            <button
                class="delete-note"
                data-action="delete"
            >
                Delete
            </button>

        </div>


        <div class="note-footer">

            <span class="note-category">
                ${escapeHTML(note.category)}
            </span>

            <span class="note-date">
                ${escapeHTML(note.createdAt)}
            </span>

        </div>

    `;


    return article;

}


// ==========================================
// 10. ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// 11. GET FILTERED NOTES
// ==========================================

function getFilteredNotes() {

    let result = [...notes];


    // CATEGORY FILTER

    if (currentCategory !== "all") {

        result =
            result.filter(
                note =>
                    note.category ===
                    currentCategory
            );

    }


    // SEARCH

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (search !== "") {

        result =
            result.filter(note => {

                const title =
                    note.title.toLowerCase();

                const content =
                    note.content.toLowerCase();

                return (
                    title.includes(search) ||
                    content.includes(search)
                );

            });

    }


    // PINNED NOTES FIRST

    result.sort(
        (a, b) =>
            Number(b.pinned) -
            Number(a.pinned)
    );


    return result;

}


// ==========================================
// 12. RENDER NOTES
// ==========================================

function renderNotes() {

    notesContainer.innerHTML = "";


    const filteredNotes =
        getFilteredNotes();


    filteredNotes.forEach(note => {

        const noteElement =
            createNoteElement(note);


        notesContainer.append(
            noteElement
        );

    });


    updateStats();


    if (filteredNotes.length === 0) {

        emptyMessage.classList.remove(
            "hidden"
        );

    } else {

        emptyMessage.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// 13. UPDATE STATS
// ==========================================

function updateStats() {

    totalCount.textContent =
        notes.length;


    const pinned =
        notes.filter(
            note => note.pinned
        ).length;


    pinnedCount.textContent =
        pinned;

}


// ==========================================
// 14. EDIT NOTE
// ==========================================

function editNote(noteId) {

    const note =
        notes.find(
            note => note.id === noteId
        );


    if (!note) {
        return;
    }


    noteTitle.value =
        note.title;


    noteContent.value =
        note.content;


    categoryInput.value =
        note.category;


    const colorRadio =
        document.querySelector(
            `input[name="noteColor"][value="${note.color}"]`
        );


    if (colorRadio) {

        colorRadio.checked = true;

    }


    editingNoteId =
        noteId;


    modalTitle.textContent =
        "Edit Note";


    openModal();

}


// ==========================================
// 15. UPDATE NOTE
// ==========================================

function updateNote() {

    const note =
        notes.find(
            note => note.id === editingNoteId
        );


    if (!note) {
        return;
    }


    const title =
        noteTitle.value.trim();

    const content =
        noteContent.value.trim();


    if (
        title === "" &&
        content === ""
    ) {

        alert("Note me kuch likho.");

        return;
    }


    note.title =
        title || "Untitled Note";


    note.content =
        content;


    note.category =
        categoryInput.value;


    note.color =
        getSelectedColor();


    saveNotes();

    closeModal();

    renderNotes();

}


// ==========================================
// 16. PIN / UNPIN
// ==========================================

function togglePin(noteId) {

    const note =
        notes.find(
            note => note.id === noteId
        );


    if (!note) {
        return;
    }


    note.pinned =
        !note.pinned;


    saveNotes();

    renderNotes();

}


// ==========================================
// 17. DELETE NOTE
// ==========================================

function deleteNote(noteId) {

    notes =
        notes.filter(
            note => note.id !== noteId
        );


    saveNotes();

    renderNotes();

}


// ==========================================
// 18. ADD / UPDATE FORM SUBMIT
// ==========================================

noteForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            editingNoteId !== null
        ) {

            updateNote();

        } else {

            addNote();

        }

    }
);


// ==========================================
// 19. OPEN NEW NOTE
// ==========================================

addNoteBtn.addEventListener(
    "click",
    function () {

        editingNoteId = null;

        modalTitle.textContent =
            "New Note";

        noteForm.reset();

        openModal();

    }
);


// ==========================================
// 20. CLOSE MODAL
// ==========================================

closeModalBtn.addEventListener(
    "click",
    function () {

        closeModal();

    }
);


// ==========================================
// 21. CLICK OUTSIDE MODAL
// ==========================================

noteModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === noteModal
        ) {

            closeModal();

        }

    }
);


// ==========================================
// 22. NOTE ACTIONS
// ==========================================

notesContainer.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {
            return;
        }


        const noteElement =
            button.closest(".note-card");


        if (!noteElement) {
            return;
        }


        const noteId =
            Number(noteElement.dataset.id);


        const action =
            button.dataset.action;


        if (action === "edit") {

            editNote(noteId);

            return;

        }


        if (action === "pin") {

            togglePin(noteId);

            return;

        }


        if (action === "delete") {

            deleteNote(noteId);

            return;

        }

    }
);


// ==========================================
// 23. SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        renderNotes();

    }
);


// ==========================================
// 24. CATEGORY FILTER
// ==========================================

filters.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".filter"
            );


        if (!button) {
            return;
        }


        currentCategory =
            button.dataset.category;


        document
            .querySelectorAll(".filter")
            .forEach(filter => {

                filter.classList.remove(
                    "active"
                );

            });


        button.classList.add(
            "active"
        );


        renderNotes();

    }
);


// ==========================================
// 25. DELETE ALL
// ==========================================

deleteAllBtn.addEventListener(
    "click",
    function () {

        if (notes.length === 0) {
            return;
        }


        const confirmed =
            confirm(
                "Kya aap sabhi notes delete karna chahte ho?"
            );


        if (!confirmed) {
            return;
        }


        notes = [];


        saveNotes();

        renderNotes();

    }
);


// ==========================================
// 26. DARK / LIGHT THEME
// ==========================================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "theme",
            isDark
                ? "dark"
                : "light"
        );

    }
);


// ==========================================
// 27. LOAD SAVED THEME
// ==========================================

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent = "☀️";

}


// ==========================================
// 28. INITIAL RENDER
// ==========================================

renderNotes();
