let users = [];

window.addEventListener("load", () => {

    const form = document.getElementById('register-form');
    const listContainer = document.getElementById('register-list');
    let errors = [];

    // input fields
    let firstName = document.getElementById('firstName'),
    lastName = document.getElementById('lastName'),
    email = document.getElementById('emailAddress');

    //
    function loadUsers(users = []) {

        listContainer.innerHTML = "";

        users.forEach(({ firstName, lastName, email, id }) => {
            listContainer.innerHTML += `

            <div id="${id}" class="user col col-md-6 col-lg-4">
                <div class="user-info">
                    <p class="h4">${firstName} ${lastName}</p>
                    <p>${email}</p>
                </div>

                <div data-parentid="${id}" class="btns">
                    <button class="delete-user btn btn-danger user-btn">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="edit-user btn btn-warning user-btn">
                        <i class="fas fa-user-edit"></i>
                    </button>
                </div>
            </div>
            
            `
        })
    }

    function addUser(index) {

        const newUser = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            id: Date.now().toString()
        };

        if (index) {
            let indexNum = parseInt(index)

            users = [
                ...users.slice(0, indexNum),
                newUser,
                ...users.slice(indexNum)
            ]

            form.setAttribute("data-editIndex", ""); 
        } else {
            users = [
                ...users,
                newUser
            ]
        }
        loadUsers(users);
    }

    function deleteUser(userId) {

        users = users.filter( ({id}) => id !== userId);
        loadUsers(users);
    }

    function editUser(userId) {

        const index = users.findIndex( ({id}) => id == userId);
        const user = users[index];
        form.setAttribute("data-editIndex", index); 
        
        firstName.value = user.firstName;
        lastName.value = user.lastName;
        email.value = user.email;

        deleteUser(userId);
    }

    function validateForm() {

        errors = []

        let existingUser = users.find(user => user.email == email.value);
        if (existingUser) errors = [...errors, {field: email, error: "User exists already!"}];
        
        let allForms = [firstName, lastName, email]

        const emailTest = /^(([^öäå<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const nameTest = /^([A-Za-zéàë]{2,40} ?)+$/;
        
        let validEmail = emailTest.test(String(email.value).toLowerCase());
        let validFirstN = nameTest.test(String(firstName.value).toLowerCase());
        let validLastN = nameTest.test(String(lastName.value).toLowerCase());

        if (!validEmail) errors = [...errors, {field: email, error: "Invalid email"}];
        if (!validFirstN) errors = [...errors, {field: firstName, error: "Invalid firstName"}];
        if (!validLastN) errors = [...errors, {field: lastName, error: "Invalid lastName"}];

        allForms.forEach(form => {
            if(!form.value) {
                errors = [...errors, {field: form, error: 
                `${form.labels[0].innerText} field is empty!`}];
            }

            form.classList.remove("bg-danger");
            let allSpans = form.parentElement.querySelectorAll("span");
            if (!allSpans.length == 0) allSpans.forEach(span => span.remove());
        })

        errors.forEach(({ field, error }) => {
            field.classList.add("bg-danger");

            let span = document.createElement("span");
            span.innerText = error;

            field.after(span);
        })
        
        return (errors.length == 0);
    }


    // event handlers
    function handleSubmit(e) {

        e.preventDefault();

        if (validateForm()) {
            addUser(this.dataset.editindex);
            form.reset();
        }
    }

    function handleUserClick({target}) {

        if (!target.matches('button')) return;

        const id = target.parentElement.dataset.parentid;
        
        (target.classList[0] == "edit-user") ?
            editUser(id) : deleteUser(id);
    }


    // event listeners
    form.addEventListener("submit", handleSubmit);
    listContainer.addEventListener("click", handleUserClick)


    loadUsers(users)
})