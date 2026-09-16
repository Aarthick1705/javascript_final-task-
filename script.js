let employees = [];
let displayedEmployees = [];

const API_URL = "https://dummyjson.com/users";



function fetchEmployees() {

    const message = document.getElementById("message");

    message.innerHTML = "Loading employees...";

    fetch(API_URL)
        .then(response => {

            if (!response.ok) {
                throw new Error("API Error");
            }

            return response.json();
        })

        .then(data => {

            employees = data.users.map(user => {

                return {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    age: user.age,
                    email: user.email,
                    phone: user.phone,
                    department: user.company.department,
                    image: user.image,
                    salary: 50000
                };

            });

            displayedEmployees = [...employees];

            displayEmployees(displayedEmployees);

            message.innerHTML = "Employee data loaded successfully.";

        })

        .catch(error => {

            console.log(error);

            message.innerHTML =
                "Unable to load employee data. Please try again.";

        })

        .finally(() => {

            console.log("API request completed");

        });
}



function displayEmployees(employeeList) {

    const container =
        document.getElementById("employeeContainer");

    container.innerHTML = "";

    displayedEmployees = employeeList;

    if (employeeList.length === 0) {

        container.innerHTML =
            "<p>No employees found.</p>";

        updateEmployeeCount();

        return;
    }

    employeeList.forEach(employee => {

        const card = document.createElement("div");

        card.className = "employee-card";

        card.innerHTML = `

            <img src="${employee.image}"
                 alt="${employee.name}">

            <h2>${employee.name}</h2>

            <p><strong>Age:</strong> ${employee.age}</p>

            <p><strong>Email:</strong> ${employee.email}</p>

            <p><strong>Department:</strong>
                ${employee.department}
            </p>

            // <p><strong>Phone:</strong>
            //     ${employee.phone || "Not available"}
            // </p>

            <p><strong>Salary:</strong>
                ₹${employee.salary.toLocaleString("en-IN")}
            </p>

            <button
                class="delete-btn"
                onclick="deleteEmployee(${employee.id})">
                Delete
            </button>

        `;

        container.appendChild(card);

    });

    updateEmployeeCount();
    calculateSalary();
    highestSalaryEmployee();
}




function searchEmployees() {

    const searchValue =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    const result = employees.filter(employee => {

        return employee.name
            .toLowerCase()
            .includes(searchValue);

    });

    displayEmployees(result);
}


document.getElementById("searchBtn")
    .addEventListener("click", searchEmployees);



document.getElementById("searchInput")
    .addEventListener("input", searchEmployees);




function filterDepartment(department) {

    if (department === "All") {

        displayEmployees([...employees]);

        return;
    }

    const result = employees.filter(employee => {

        return employee.department === department;

    });

    displayEmployees(result);
}


const filterButtons =
    document.querySelectorAll(".filters button");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const department =
            button.getAttribute("data-department");

        filterDepartment(department);

    });

});




function updateEmployeeCount() {

    const count =
        document.getElementById("employeeCount");

    count.innerHTML = displayedEmployees.length;
}



function addEmployee(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const age =
        Number(document.getElementById("age").value);

    const email =
        document.getElementById("email").value.trim();

    const department =
        document.getElementById("department").value;

    const salary =
        Number(document.getElementById("salary").value);

    if (!validateEmployee(name, age, email, department)) {
        return;
    }

    const newEmployee = {

        id: Date.now(),

        name: name,

        age: age,

        email: email,

        department: department,

        salary: salary || 50000,

       

        image: "https://dummyjson.com/icon/default/128"

    };


    employees = [
        ...employees,
        newEmployee
    ];


    displayEmployees([...employees]);

    clearForm();

}


document.getElementById("employeeForm")
    .addEventListener("submit", addEmployee);




function validateEmployee(
    name,
    age,
    email,
    department
) {

    const errorMessage =
        document.getElementById("errorMessage");

    errorMessage.innerHTML = "";

    if (name === "") {

        errorMessage.innerHTML =
            "❌ Please enter employee name";

        return false;
    }

    if (age <= 18) {

        errorMessage.innerHTML =
            "Age must be greater than 18";

        return false;
    }

    if (email === "") {

        errorMessage.innerHTML =
            "Please enter employee email";

        return false;
    }

    if (department === "") {

        errorMessage.innerHTML =
            " Please select department";

        return false;
    }

    return true;
}




function clearForm() {

    document.getElementById("employeeForm").reset();

    document.getElementById("errorMessage")
        .innerHTML = "";

}



function deleteEmployee(id) {

    employees = employees.filter(employee => {

        return employee.id !== id;

    });

    displayEmployees([...employees]);
}




function calculateSalary() {

    const totalSalary =
        displayedEmployees.reduce(
            (total, employee) => {

                return total + employee.salary;

            },
            0
        );


    const averageSalary =
        displayedEmployees.length > 0
            ? totalSalary / displayedEmployees.length
            : 0;


    document.getElementById("totalSalary")
        .innerHTML =
        `₹${totalSalary.toLocaleString("en-IN")}`;


    document.getElementById("averageSalary")
        .innerHTML =
        `₹${Math.round(averageSalary)
            .toLocaleString("en-IN")}`;
}




function highestSalaryEmployee() {

    if (displayedEmployees.length === 0) {

        document.getElementById("highestEmployee")
            .innerHTML = "No employee found.";

        return;
    }


    const highest =
        displayedEmployees.reduce(
            (highest, employee) => {

                return employee.salary > highest.salary
                    ? employee
                    : highest;

            }
        );


    document.getElementById("highestEmployee")
        .innerHTML = `

            <h3>${highest.name}</h3>

            <p>
                Salary:
                ₹${highest.salary.toLocaleString("en-IN")}
            </p>

        `;
}



document.getElementById("sortName")
    .addEventListener("click", () => {

        const sorted =
            [...displayedEmployees].sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );

        displayEmployees(sorted);

    });



document.getElementById("sortAge")
    .addEventListener("click", () => {

        const sorted =
            [...displayedEmployees].sort(
                (a, b) =>
                    a.age - b.age
            );

        displayEmployees(sorted);

    });




document.getElementById("sortSalary")
    .addEventListener("click", () => {

        const sorted =
            [...displayedEmployees].sort(
                (a, b) =>
                    b.salary - a.salary
            );

        displayEmployees(sorted);

    });




function displayDateTime() {

    const now = new Date();

    const date =
        now.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    const time =
        now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });


    document.getElementById("dateTime")
        .innerHTML =
        `Today: ${date} | Time: ${time}`;
}



displayDateTime();

fetchEmployees();