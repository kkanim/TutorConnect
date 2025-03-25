document.addEventListener("DOMContentLoaded", function () {
    const collegeSelect = document.getElementById("college");
    const programmesSelect = document.getElementById("programmes");
    const subjectsContainer = document.getElementById("subjects-container");
    const daysContainer = document.getElementById("days-container");
  
    // Data for colleges, programmes, and subjects
    const data = {
      colleges: {
        "College Of Science": ["Computer Science", "Mathematics", "Physics"],
        "College of Builds And Art": ["Architecture", "Fine Arts"],
        "College Of Health and Applied Science": ["Nursing", "Optometry"],
        "College of Humanities": ["History", "Philosophy"],
        "College of Agriculture": ["Agronomy", "Horticulture"],
      },
      subjects: {
        "Computer Science": ["Programming", "Data Structures", "Algorithms"],
        Mathematics: ["Calculus", "Algebra", "Statistics"],
        Physics: ["Mechanics", "Electromagnetism", "Quantum Physics"],
        Architecture: ["Design", "Construction", "Urban Planning"],
        "Fine Arts": ["Painting", "Sculpture", "Art History"],
        Nursing: ["Anatomy", "Pharmacology", "Patient Care"],
        Optometry: ["Optics", "Ocular Disease", "Vision Science"],
        History: ["Ancient History", "Modern History", "World History"],
        Philosophy: ["Ethics", "Metaphysics", "Logic"],
        Agronomy: ["Crop Science", "Soil Science", "Plant Breeding"],
        Horticulture: ["Plant Pathology", "Landscape Design", "Floriculture"],
      },
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    };
  
    // Function to populate programmes based on selected college
    collegeSelect.addEventListener("change", function () {
      const selectedCollege = collegeSelect.value;
      programmesSelect.innerHTML = "<option value=''>Select Programme</option>"; // Reset programmes dropdown
  
      if (selectedCollege && data.colleges[selectedCollege]) {
        data.colleges[selectedCollege].forEach((programme) => {
          const option = document.createElement("option");
          option.value = programme;
          option.textContent = programme;
          programmesSelect.appendChild(option);
        });
      }
    });
  
    // Function to populate subjects based on selected programme
    programmesSelect.addEventListener("change", function () {
      const selectedProgramme = programmesSelect.value;
      subjectsContainer.innerHTML = ""; // Reset subjects container
  
      if (selectedProgramme && data.subjects[selectedProgramme]) {
        data.subjects[selectedProgramme].forEach((subject) => {
          const label = document.createElement("label");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "subjects";
          checkbox.value = subject;
          checkbox.id = subject;
  
          label.htmlFor = subject;
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(subject));
  
          subjectsContainer.appendChild(label);
        });
      }
    });
  
    // Function to limit subject selection to 4
    subjectsContainer.addEventListener("change", function (event) {
      if (event.target.type === "checkbox") {
        const selectedSubjects = Array.from(
          subjectsContainer.querySelectorAll('input[type="checkbox"]:checked')
        );
        if (selectedSubjects.length > 4) {
          alert("You can select a maximum of 4 subjects.");
          event.target.checked = false; // Uncheck the last selected checkbox
        }
      }
    });
  
    // Function to populate days checkboxes
    data.days.forEach((day) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "days";
      checkbox.value = day;
      checkbox.id = day;
  
      const label = document.createElement("label");
      label.htmlFor = day;
      label.textContent = day;
  
      daysContainer.appendChild(checkbox);
      daysContainer.appendChild(label);
      daysContainer.appendChild(document.createElement("br"));
    });
  });