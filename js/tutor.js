document.addEventListener("DOMContentLoaded", function () {
    // Get subject from URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const subjectFilter = urlParams.get('subject');
    
    // Show subject filter banner if applicable
    const subjectBanner = document.getElementById('subjectBanner');
    const selectedSubjectSpan = document.getElementById('selectedSubject');
    if (subjectFilter && subjectBanner && selectedSubjectSpan) {
        subjectBanner.classList.remove('d-none');
        selectedSubjectSpan.textContent = subjectFilter;
    }

    const tutors = [
        { name: "Diana Ross", location: "Kotei", price: "50Ghc", subjects: ["Pure Mathematics", "Circuit Theory", "Calculus"], status: "Open for work", image: "/assets/c++.jpeg" },
        { name: "Nulla Culp", location: "New Site", price: "60Ghc", subjects: ["Physics", "Electronics", "Calculus"], image: "/assets/ai.jpeg" },
        { name: "Anna Jone", location: "Bomso", price: "50Ghc", subjects: ["Discrete Mathematics", "Calculus", "Web Design"], image: "https://via.placeholder.com/150" },
        { name: "Gabriel Thomas", location: "Engineering Gate", price: "70Ghc", subjects: ["Electronics", "Calculus"], status: "Open for work", image: "https://via.placeholder.com/150" },
        { name: "Godacoat Irure", location: "Kotei", price: "50Ghc", subjects: ["Calculus", "Java", "Web Design"], status: "Open for work", image: "https://via.placeholder.com/150" }
    ];

    const tutorList = document.getElementById("tutorList");
    const locationFilter = document.getElementById("locationFilter");
    const searchInput = document.getElementById("searchInput");
    const sortDropdown = document.getElementById("sortCourses"); // Add this to your HTML

    // Populate location filter dropdown
    const locations = [...new Set(tutors.map(tutor => tutor.location))];
    locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });

    // Render tutors with optional sorting
    function renderTutors(filteredTutors = tutors) {
        // Apply sorting if specified
        if (sortDropdown && sortDropdown.value) {
            filteredTutors = sortTutors(filteredTutors, sortDropdown.value);
        }

        tutorList.innerHTML = filteredTutors.map(tutor => `
            <div class="col-md-12 tutor-card mb-3" data-name="${tutor.name}">
                <div class="card h-100">
                    <div class="row g-0 h-100">
                        <div class="col-md-4 tutor-image-container">
                            <img src="${tutor.image}" class="img-fluid" alt="${tutor.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body d-flex flex-column h-100">
                                <div class="flex-grow-1">
                                    <h3 class="card-title">${tutor.name}</h3>
                                    <p class="text-muted">${tutor.location}</p>
                                    ${tutor.status ? `<p class="text-success">${tutor.status}</p>` : ''}
                                    <div class="subjects-container">
                                        ${tutor.subjects.map(subj => `<span class="badge bg-primary me-1">${subj}</span>`).join('')}
                                    </div>
                                </div>
                                <div class="d-flex gap-2 mt-3">
                                    <button class="btn btn-primary book-btn">Book Now</button>
                                    <button class="btn btn-secondary review-btn">Review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Sorting function
    function sortTutors(tutorsList, sortBy) {
        return [...tutorsList].sort((a, b) => {
            switch(sortBy) {
                case 'price-low':
                    return parseFloat(a.price) - parseFloat(b.price);
                case 'price-high':
                    return parseFloat(b.price) - parseFloat(a.price);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }

    // Filter tutors by subject, location, and search term
    function filterTutors() {
        const location = locationFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredTutors = tutors.filter(tutor =>
            (location === "" || tutor.location === location) &&
            (subjectFilter ? tutor.subjects.includes(subjectFilter) : true) &&
            (tutor.name.toLowerCase().includes(searchTerm) ||
            tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm))
        ));
        
        renderTutors(filteredTutors);
    }

    // Event delegation for tutor cards
    tutorList.addEventListener("click", (e) => {
        const tutorCard = e.target.closest(".tutor-card");
        if (!tutorCard) return;

        const tutorName = tutorCard.dataset.name;

        if (e.target.closest(".review-btn")) {
            document.getElementById("tutorNameForReview").textContent = `Review for ${tutorName}`;
            const reviewModal = new bootstrap.Modal(document.getElementById("reviewModal"));
            reviewModal.show();
        }

        if (e.target.closest(".book-btn")) {
            const bookingModal = new bootstrap.Modal(document.getElementById("bookingModal"));
            bookingModal.show();
        }
    });

    // Rating stars functionality
    document.querySelectorAll(".rating-stars .star").forEach(star => {
        star.addEventListener("click", () => {
            const value = parseInt(star.dataset.value);
            document.getElementById("ratingValue").value = value;
            document.querySelectorAll(".rating-stars .star").forEach((s, index) => {
                s.classList.toggle("active", index < value);
            });
        });
    });

    // Confirm booking
    document.getElementById("confirmBooking").addEventListener("click", () => {
        const location = document.getElementById("locationSelect").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        alert(`Booking confirmed at ${location} from ${startTime} to ${endTime}`);
        const bookingModal = bootstrap.Modal.getInstance(document.getElementById("bookingModal"));
        bookingModal.hide();
    });

    // Slider functionality
    const recommendationSlider = document.getElementById("recommendationSlider");
    const sliderValue = document.getElementById("sliderValue");

    if (recommendationSlider && sliderValue) {
        recommendationSlider.addEventListener("input", () => {
            sliderValue.textContent = recommendationSlider.value;
        });
    }

    // Submit review functionality
    document.getElementById("submitReview").addEventListener("click", () => {
        const rating = document.getElementById("ratingValue").value;
        const recommendation = recommendationSlider.value;
        const reviewText = document.getElementById("reviewText").value;

        alert(`Review submitted!\nRating: ${rating}\nRecommendation: ${recommendation}\nReview: ${reviewText}`);
        const reviewModal = bootstrap.Modal.getInstance(document.getElementById("reviewModal"));
        reviewModal.hide();
    });

    // Initial render with subject filter applied
    filterTutors();

    // Event listeners for filters and sorting
    locationFilter.addEventListener("change", filterTutors);
    searchInput.addEventListener("input", filterTutors);
    
    if (sortDropdown) {
        sortDropdown.addEventListener("change", filterTutors);
    }

    // Profile icon click handler
    document.querySelector('.profile-icon')?.addEventListener('click', function() {
        window.location.href = 'profile.html';
    });
});