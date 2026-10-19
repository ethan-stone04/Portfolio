
const PROJECTS_URL = "data/data.json";

let allProjects = [];

let currentCategory = "All";
let searchTerm = "";

function showMessage(text, isError) {
    const status = document.getElementById("project-status");
    status.textContent = text;
    status.className = isError ? "alert alert-danger" : "text-muted mb-3";
}

function clearMessage() {
    const status = document.getElementById("project-status");
    status.textContent = "";
    status.className = "";
}

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

function applyFilters() {
    const term = searchTerm.trim().toLowerCase();

    const filtered = allProjects.filter(function(project) {
        // 1. Category check
        const matchesCategory =
            currentCategory === "All" || project.category === currentCategory;

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

function setActiveButton(clickedButton) {
    document.querySelectorAll(".filter-btn").forEach(function(button) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
    });
    clickedButton.classList.add("active");
    clickedButton.setAttribute("aria-pressed", "true");
}

function setupFilterButtons() {
    document.querySelectorAll(".filter-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            currentCategory = button.dataset.category;
            setActiveButton(button);
            applyFilters();
        });
    });
}

function setupSearch() {
    const input = document.getElementById("project-search");
    if (!input) return;
    input.addEventListener("input", function() {
        searchTerm = input.value;
        applyFilters();
    });
}


// script.js loads on every page, so only run this on the Projects page.
if (document.getElementById("project-grid")) {
    setupFilterButtons();
    setupSearch();
    loadProjects();
}
