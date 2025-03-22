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

function setCourses(newProgram) {
    const programTabs = document.getElementById('programTabs');
    programTabs.innerHTML = '';
    programs.forEach(({ name }) => {
        let tab = document.createElement('li');
        tab.className = "nav-item";
        tab.innerHTML = `<a class="nav-link ${name === newProgram ? 'active' : ''}" onclick="loadCourses('${name}')">${name}</a>`;
        programTabs.appendChild(tab);
    });
}

function loadCourses(programName, searchQuery = '') {
    const program = programs.find(p => p.name === programName);
    if (!program) return;

    const courseContainer = document.getElementById('all-courses');
    courseContainer.innerHTML = "";
    setCourses(programName);
    
    program.courses.forEach(({ name, image }) => {
        // Skip courses that don't match the search query
        if (searchQuery && !name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return;
        }

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
                </div>
            </div>
        `;
        
        courseContainer.appendChild(card);
    });

    // Add event listeners to like buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.dataset.course;
            const currentLikes = likes[courseId] || { count: 0, liked: false };
            
            if (currentLikes.liked) {
                currentLikes.count--;
                currentLikes.liked = false;
                this.classList.remove('liked');
            } else {
                currentLikes.count++;
                currentLikes.liked = true;
                this.classList.add('liked');
            }
            
            likes[courseId] = currentLikes;
            localStorage.setItem('courseLikes', JSON.stringify(likes));
            this.querySelector('.like-count').textContent = currentLikes.count;
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Load the default program (e.g., Computer Science)
    loadCourses("Computer Science");

    // Add event listener for the search bar
    const searchInput = document.getElementById('searchCourses');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchQuery = searchInput.value.trim();
            const activeProgram = document.querySelector('#programTabs .nav-link.active').textContent;
            loadCourses(activeProgram, searchQuery);
        });
    }

    // Add event listener for the program search bar
    const programSearchInput = document.getElementById('searchPrograms');
    if (programSearchInput) {
        programSearchInput.addEventListener('input', () => {
            const searchQuery = programSearchInput.value.trim();
            const filteredPrograms = programs.filter(program => 
                program.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setCourses(filteredPrograms.length > 0 ? filteredPrograms[0].name : "");
            if (filteredPrograms.length > 0) {
                loadCourses(filteredPrograms[0].name);
            }
        });
    }

    // Add event listener for the sort dropdown
    const sortDropdown = document.getElementById('sortCourses');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', () => {
            const sortValue = sortDropdown.value;
            const activeProgram = document.querySelector('#programTabs .nav-link.active').textContent;
            loadCourses(activeProgram);
        });
    }
});