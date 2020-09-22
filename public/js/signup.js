function sign_up() {
    var isDataOK = true
    var forms = document.getElementsByClassName('needs-validation')
    Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            isDataOK = false
        }
        form.classList.add('was-validated')
    })
    if(isDataOK) send_data()
}

function send_data() {
    var name = $("#etName").val()
    var age = $("#etAge").val()
    var email = $("#etEmail").val()
    var password = $("#etPassword").val()
    var genre = $('input[name=rdGenre]:checked', '#signup_form').val()
    var handedness = $('input[name=rdHandedness]:checked', '#signup_form').val()
    var handDesease = $('input[name=rdHandDesease]:checked', '#signup_form').val()

    var url = '/ws/signup'
    var http_request = new XMLHttpRequest()
    http_request.onreadystatechange = () => {
        if (http_request.readyState == 4  && http_request.status == 200) {
            var response = JSON.parse(http_request.response);
            if(response.status == 1){
                alert("Usuario creado correctamente")
                window.location.href = '/';
            }else{
                alert("Hubo un error al crear el usuario: " + response.error)
            }
        }
    }

    http_request.open('POST', url, true)
    var payload = {
        name: name,
        age: age,
        email: email,
        password: password, 
        genre: genre, 
        handedness: handedness,
        handDesease: handDesease
    }
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.send(JSON.stringify(payload))
}


function login(){
    var url = '/ws/signup'
    var http_request = new XMLHttpRequest()

    http_request.onreadystatechange = () => {
        if (http_request.readyState == 4  ) {
            var response = JSON.parse(http_request.response);
            alert(JSON.stringify(response))
        }
    }

    http_request.open('POST', url, true)

    var payload = {name: 'Aron'}

    http_request.send(payload)
}
