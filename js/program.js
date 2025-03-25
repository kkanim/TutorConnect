const programs = [
    {
        name: "Computer Engineering",
        courses: [
            { name: "Embedded Systems", image: "assets/eb.jpeg" },
            { name: "Digital Logic", image: "assets/dl.jpeg" },
            { name: "Circuit Design", image: "assets/cd.jpeg" }
        ]
    },
    {
        name: "Biochemistry",
        courses: [
            { name: "Molecular Biology", image: "assets/mb.jpeg" },
            { name: "Genetics", image: "assets/gen.jpeg" },
            { name: "Enzyme Kinetics", image: "assets/ek.jpeg" }
        ]
    },
    {
        name: "Computer Science",
        courses: [
            { name: "AI", image: "assets/ai.jpeg" },
            { name: "C++", image: "assets/c++.jpeg" },
            { name: "Java", image: "assets/java.jpeg" },
            { name: "Web Based Concepts", image: "assets/web.jpeg" },
            { name: "HCI", image: "assets/hci.jpeg" }
        ]
    },
    {
        name: "Real Estate",
        courses: [
            { name: "Property Management", image: "assets/pm.jpeg" },
            { name: "Investment Strategies", image: "assets/is.jpeg" }
        ]
    },
    {
        name: "Accounting",
        courses: [
            { name: "Financial Accounting", image: "assets/fa.jpeg" },
            { name: "Taxation", image: "assets/tax.jpeg" }
        ]
    },
    {
        name: "Food Science",
        courses: [
            { name: "Food Safety", image: "assets/fs.jpeg" },
            { name: "Nutrition", image: "assets/nut.jpeg" }
        ]
    }
];

let likes = JSON.parse(localStorage.getItem('courseLikes')) || {};

function formatProgramName(param) {
    return param
        .toLowerCase()
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function setCourses(newProgram) {
    const programTabs = document.getElementById('programTabs');
    programTabs.innerHTML = '';
    programs.forEach(({ name }) => {
        let tab = document.createElement('li');
        tab.className = "nav-item";
        tab.innerHTML = `
            <a class="nav-link ${name === newProgram ? 'active' : ''}" 
               onclick="loadCourses('${name}')"
               id="${name.toLowerCase().replace(/ /g, '-')}-tab">
                ${name}
            </a>`;
        programTabs.appendChild(tab);
    });
}

function loadCourses(programName, searchQuery = '') {
    const program = programs.find(p => p.name === programName);
    if (!program) return;

    // Update URL with current program
    const url = new URL(window.location);
    url.searchParams.set('program', programName.toLowerCase().replace(/ /g, '-'));
    window.history.replaceState({}, '', url);

    const courseContainer = document.getElementById('all-courses');
    courseContainer.innerHTML = "";
    setCourses(programName);
    
    program.courses.forEach(({ name, image }) => {
        if (searchQuery && !name.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const courseId = `${programName}-${name}`.replace(/\s+/g, '-');
        const courseLikes = likes[courseId] || { count: Math.floor(Math.random() * 300), liked: false };
        
        const card = document.createElement('div');
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <img src="${image}" class="img-fluid" alt="${name}">
                    <h5 class="mt-2">${name}</h5>
                    <button class="like-btn ${courseLikes.liked ? 'liked' : ''}" data-course="${courseId}">
                        ♥ <span class="like-count">${courseLikes.count}</span>
                    </button>
                    <button class="btn btn-sm btn-outline-primary mt-2 view-tutors-btn" 
                            onclick="window.location.href='tutor.html?subject=${encodeURIComponent(name)}'">
                        View Tutors
                    </button>
                </div>
            </div>`;
        courseContainer.appendChild(card);
    });

    // Like button functionality
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.dataset.course;
            const currentLikes = likes[courseId] || { count: 0, liked: false };
            
            currentLikes.liked = !currentLikes.liked;
            currentLikes.count += currentLikes.liked ? 1 : -1;
            
            this.classList.toggle('liked', currentLikes.liked);
            likes[courseId] = currentLikes;
            localStorage.setItem('courseLikes', JSON.stringify(likes));
            this.querySelector('.like-count').textContent = currentLikes.count;
        });
    });
}

function initializeProgram() {
    const urlParams = new URLSearchParams(window.location.search);
    const programParam = urlParams.get('program');
    
    if (programParam) {
        const formattedName = formatProgramName(programParam);
        const foundProgram = programs.find(p => p.name.toLowerCase() === formattedName.toLowerCase());
        return foundProgram ? foundProgram.name : 'Computer Science';
    }
    return 'Computer Science';
}

function activateTabFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const programParam = urlParams.get('program');
    
    if (programParam) {
        const formattedName = formatProgramName(programParam);
        const tabButton = document.getElementById(`${formattedName.toLowerCase().replace(/ /g, '-')}-tab`);
        if (tabButton) {
            tabButton.click();
            tabButton.scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize with program from URL or default
    const initialProgram = initializeProgram();
    loadCourses(initialProgram);
    activateTabFromURL();

    // Event listeners
    const searchInput = document.getElementById('searchCourses');
    const programSearchInput = document.getElementById('searchPrograms');
    const sortDropdown = document.getElementById('sortCourses');

    searchInput?.addEventListener('input', () => {
        const activeProgram = document.querySelector('#programTabs .nav-link.active').textContent;
        loadCourses(activeProgram, searchInput.value.trim());
    });

    programSearchInput?.addEventListener('input', () => {
        const searchQuery = programSearchInput.value.trim();
        const filteredPrograms = programs.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filteredPrograms.length > 0) {
            loadCourses(filteredPrograms[0].name);
            activateTabFromURL();
        }
    });

    sortDropdown?.addEventListener('change', () => {
        const activeProgram = document.querySelector('#programTabs .nav-link.active').textContent;
        loadCourses(activeProgram);
    });
});