function sign_up() {
    var isDataOK = true
    var forms = document.getElementsByClassName('needs-validation')
    Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            isDataOK = false
        }
        form.classList.add('was-validated')
    })
    console.log(isDataOK)
    if(isDataOK) send_data()
}

function send_data() {
    var name = $("#etName").val()
    var lastname = $("#etLastname").val()
    var age = $("#etAge").val()
    var email = $("#etEmail").val()
    var username = $("#etUsername").val()
    var password = $("#etPassword").val()
    var genre = $('input[name=rdGenre]:checked', '#signup_form').val()
    var handedness = $('input[name=rdHandedness]:checked', '#signup_form').val()
    var handDesease = $('input[name=rdHandDesease]:checked', '#signup_form').val()

    var url = '/ws/signup'
    var http_request = new XMLHttpRequest()
    http_request.onreadystatechange = () => {
        if (http_request.readyState == 4 && http_request.status == 200) {
            var response = JSON.parse(http_request.response);
            if (response.status == 1) {
                alert("Usuario creado correctamente: " + response.msg)
                window.location.href = '/';
            } else {
                alert("Hubo un error al crear el usuario: " + response.error)
            }
        }
    }

    http_request.open('POST', url, true)
    var payload = {
        name: name,
        lastname: lastname,
        age: age,
        email: email,
        username: username,
        password: password, 
        genre: genre, 
        handedness: handedness,
        handDesease: handDesease
    }
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.send(JSON.stringify(payload))
}