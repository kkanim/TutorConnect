document.addEventListener("DOMContentLoaded", function () {
    const tutors = [
        { name: "Diana Ross", location: "Kotei", price: "50Ghc", subjects: ["Pure Mathematics", "Circuit Theory", "Calculus"], status: "Open for work", image: "/assets/fa.jpeg" },
        { name: "Nulla Culp", location: "New Site", price: "60Ghc", subjects: ["Physics", "Electronics", "Calculus"], image: "https://via.placeholder.com/150" },
        { name: "Anna Jone", location: "Bomso", price: "50Ghc", subjects: ["Discrete Mathematics", "Calculus", "Web Design"], image: "https://via.placeholder.com/150" },
        { name: "Gabriel Thomas", location: "Engineering Gate", price: "70Ghc", subjects: ["Electronics", "Calculus"], status: "Open for work", image: "https://via.placeholder.com/150" },
        { name: "Godacoat Irure", location: "Kotei", price: "50Ghc", subjects: ["Calculus", "Java", "Web Design"], status: "Open for work", image: "https://via.placeholder.com/150" }
    ];

    const tutorList = document.getElementById("tutorList");
    const locationFilter = document.getElementById("locationFilter");
    const searchInput = document.getElementById("searchInput");

    // Populate location filter dropdown
    const locations = [...new Set(tutors.map(tutor => tutor.location))];
    locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });

    // Render tutors
    function renderTutors(filteredTutors = tutors) {
        tutorList.innerHTML = filteredTutors.map(tutor => `
            <div class="col-md-12 tutor-card mb-3" data-name="${tutor.name}">
                <div class="card h-100">
                    <div class="row g-0 h-100">
                        <div class="col-md-4 tutor-image-container">
                            <img src="${tutor.image}" class="img-fluid rounded-start" alt="${tutor.name}">
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
                                    <button class="btn btn-secondary message-btn">Message</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Filter tutors
    function filterTutors() {
        const location = locationFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTutors = tutors.filter(tutor =>
            (location === "" || tutor.location === location) &&
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

        if (e.target.closest(".tutor-image-container")) {
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

recommendationSlider.addEventListener("input", () => {
    sliderValue.textContent = recommendationSlider.value;
});

// Submit review functionality
document.getElementById("submitReview").addEventListener("click", () => {
    const rating = document.getElementById("ratingValue").value;
    const recommendation = recommendationSlider.value;
    const reviewText = document.getElementById("reviewText").value;

    alert(`Review submitted!\nRating: ${rating}\nRecommendation: ${recommendation}\nReview: ${reviewText}`);
    const reviewModal = bootstrap.Modal.getInstance(document.getElementById("reviewModal"));
    reviewModal.hide();
});

    // Initial render
    renderTutors();

    // Event listeners for filters
    locationFilter.addEventListener("change", filterTutors);
    searchInput.addEventListener("input", filterTutors);
});