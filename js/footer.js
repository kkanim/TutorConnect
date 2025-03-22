function loadfooter (pagedocument){
const footer=pagedocument.querySelector("body > footer");
    footer.className ="footer bg-dark text-white py-4"
footer.innerHTML =`<div class="container text-center">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <h5>Contact Us</h5>
                    <p>Email: support@tutorconnect.com</p>
                    <p>Phone: (123) 456-7890</p>
                </div>
                <div class="col-md-4 mb-3">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white">About Us</a></li>
                        <li><a href="#" class="text-white">Privacy Policy</a></li>
                        <li><a href="#" class="text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div class="col-md-4 mb-3">
                    <h5>Follow Us</h5>
                    <div class="social-links">
                        <a href="#" class="text-white me-3"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-white"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div class="border-top pt-3">
                <p class="mb-0">© 2024 TutorConnect. All rights reserved.</p>
            </div>
        </div>`
}