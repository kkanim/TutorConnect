document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPath = window.location.pathname.split('/').pop();
    
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        
        // Add active class to current page link
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Handle navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = this.getAttribute('href');
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Dynamic data for sessions
    const sessionData = [Math.floor(Math.random() * 30), Math.floor(Math.random() * 30), Math.floor(Math.random() * 30), Math.floor(Math.random() * 30)];

    // Sessions Chart
    const ctx = document.getElementById("sessionsChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["May 01", "May 03", "May 05", "May 07"],
            datasets: [{
                label: "Sessions",
                data: sessionData,
                backgroundColor: "#8B4C39"
            }]
        },
        options: {
            responsive: true,
        }
    });


    // Dynamic rating and progress
    const randomRating = Math.floor(Math.random() * 40) + 50; // Between 50% and 90%
    document.getElementById("rating-score").textContent = randomRating + "%";
    document.getElementById("progress-bar-fill").style.width = randomRating + "%";
    document.getElementById("rating-percentage").textContent = randomRating + "%";
});