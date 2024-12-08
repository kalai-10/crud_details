const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");

// Fetch all students and render them in the table
async function fetchStudents() {
  try {
    const response = await fetch("http://localhost:5000/students");
    const students = await response.json();

    // Clear the table body before rendering new data
    tableBody.innerHTML = "";

    // Populate table with student data
    students.forEach((student) => {
      const row = `
        <tr>
          <td>${student.rollno}</td>
          <td>${student.name}</td>
          <td>${student.age}</td>
          <td>${student.grade}</td>
          <td>
            <button onclick="deleteStudent('${student.rollno}')">Delete</button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// Add or update a student
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const rollno = document.getElementById("Rollno").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const grade = document.getElementById("grade").value;

  try {
    // Send data to the backend
    await fetch("http://localhost:5000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollno, name, age, grade }),
    });

    // Clear the form
    form.reset();

    // Refresh the table
    fetchStudents();
  } catch (error) {
    console.error("Error adding/updating student:", error);
  }
});

// Delete a student
async function deleteStudent(rollno) {
  try {
    await fetch(`http://localhost:5000/students/${rollno}`, {
      method: "DELETE",
    });

    // Refresh the table
    fetchStudents();
  } catch (error) {
    console.error("Error deleting student:", error);
  }
}

// Initial fetch to load data
fetchStudents();
