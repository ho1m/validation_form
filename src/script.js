let users = [];

window.addEventListener("load", () => {

    const form = document.getElementById('register-form');
    const listContainer = document.getElementById('register-list');
    let correctInfo = false;

    // input fields
    const firstName = document.getElementById('firstName'),
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
        let existingUser = users.find(user => user.email == email.value);
        if (existingUser) return "User already exits!";
        // should add classes instead! + text under field here!

        let filledFirstName = firstName.value, 
            filledLastName = lastName.value, 
            filledEmail = email.value;
        
        document.querySelectorAll(".form-control").forEach(input => {
            if(!input.value) {
            
            }
        })

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        let validEmail = re.test(String(email.value).toLowerCase());

        correctInfo = !existingUser || !filledFirstName || !filledLastName || !filledEmail || !validEmail;

        

    }


    // event handlers
    function handleSubmit(e) {

        e.preventDefault();

        validateForm();

        if (!correctInfo) return; 

        addUser(this.dataset.editindex);

        form.reset();
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