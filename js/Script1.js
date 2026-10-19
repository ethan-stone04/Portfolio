/* =========================
   PROJECTS: LOAD, FILTER, SEARCH
   ========================= */

// Must match the real file name inside your data/ folder exactly.
const PROJECTS_URL = "data/data.json";

// The full list of projects, filled in after fetch() succeeds. Never modified after that.
let allProjects = [];

// The two pieces of state that decide what is visible.
let currentCategory = "All";
let searchTerm = "";

// Show a message above the project grid. isError makes it a red alert.
function showMessage(text, isError) {
    const status = document.getElementById("project-status");
    status.textContent = text;
    status.className = isError ? "alert alert-danger" : "text-muted mb-3";
}

// Clear the message.
function clearMessage() {
    const status = document.getElementById("project-status");
    status.textContent = "";
    status.className = "";
}

// Build ONE Bootstrap card from ONE project object.
function createProjectCard(project) {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card info-card project-card h-100";

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const category = document.createElement("span");
    category.className = "badge category-badge align-self-start mb-2";
    category.textContent = project.category;

    const title = document.createElement("h2");
    title.className = "card-title h5";
    title.textContent = project.title;

    const description = document.createElement("p");
    description.className = "card-text";
    description.textContent = project.description;

    const techList = document.createElement("div");
    techList.className = "d-flex flex-wrap gap-2 mt-auto";
    project.technologies.forEach(function(tech) {
        const badge = document.createElement("span");
        badge.className = "badge skill-badge";
        badge.textContent = tech;
        techList.appendChild(badge);
    });

    body.appendChild(category);
    body.appendChild(title);
    body.appendChild(description);
    body.appendChild(techList);
    card.appendChild(body);
    col.appendChild(card);

    return col;
}

// Show a list of projects in the grid (replacing whatever was there).
function renderProjects(projectList) {
    const grid = document.getElementById("project-grid");
    grid.replaceChildren();

    if (projectList.length === 0) {
        showMessage("No projects match your selection. Try a different category or search term.", false);
        return;
    }

    clearMessage();
    projectList.forEach(function(project) {
        grid.appendChild(createProjectCard(project));
    });
}

// Decide which projects to show: category AND search must both match.
function applyFilters() {
    const term = searchTerm.trim().toLowerCase();

    const filtered = allProjects.filter(function(project) {
        // 1. Category check
        const matchesCategory =
            currentCategory === "All" || project.category === currentCategory;

        // 2. Search check: combine title, description, and technologies into one lowercase string
        const searchableText = (
            project.title + " " +
            project.description + " " +
            project.technologies.join(" ")
        ).toLowerCase();
        const matchesSearch = term === "" || searchableText.includes(term);

        return matchesCategory && matchesSearch;
    });

    renderProjects(filtered);
}

// Mark one filter button as active and the others as inactive.
function setActiveButton(clickedButton) {
    document.querySelectorAll(".filter-btn").forEach(function(button) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
    });
    clickedButton.classList.add("active");
    clickedButton.setAttribute("aria-pressed", "true");
}

// Attach a click listener to every filter button.
function setupFilterButtons() {
    document.querySelectorAll(".filter-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            currentCategory = button.dataset.category;
            setActiveButton(button);
            applyFilters();
        });
    });
}

// Update results every time the visitor types in the search box.
function setupSearch() {
    const input = document.getElementById("project-search");
    if (!input) return;
    input.addEventListener("input", function() {
        searchTerm = input.value;
        applyFilters();
    });
}

// Fetch the JSON file, check it worked, convert it, and display it.
async function loadProjects() {
    // A page opened by double-clicking (file://) can't use fetch().
    if (window.location.protocol === "file:") {
        showMessage(
            "This page was opened as a file. Run it through Live Server (the address should start with http://).",
            true
        );
        return;
    }

    try {
        const response = await fetch(PROJECTS_URL);

        if (!response.ok) {
            throw new Error(
                "Could not find or load '" + PROJECTS_URL + "' (HTTP status " + response.status + ")"
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("'" + PROJECTS_URL + "' must start with [ and contain a list of projects");
        }

        allProjects = data;
        applyFilters();
    } catch (error) {
        console.error("Could not load projects:", error);
        // Showing error.message on the page makes debugging much easier.
        // Once everything works, you can replace this with a friendlier message.
        showMessage("Sorry, the projects could not be loaded. Details: " + error.message, true);
    }
}

// script.js loads on every page, so only run this on the Projects page.
if (document.getElementById("project-grid")) {
    setupFilterButtons();
    setupSearch();
    loadProjects();
}