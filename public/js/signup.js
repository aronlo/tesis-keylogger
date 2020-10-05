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
    if(isDataOK) {
        send_data() 
    } else{
        alert("Error: Algunos de tus campos están mal ingresados.")
    }
}

function parseBool(val)
{
    if ((typeof val === 'string' && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes')) || val === 1)
        return true;
    else if ((typeof val === 'string' && (val.toLowerCase() === 'false' || val.toLowerCase() === 'no')) || val === 0)
        return false;

    return null;
}

function send_data() {
    var name = $("#etName").val()
    var lastname = $("#etLastname").val()
    var age = $("#etAge").val()
    var dni = $("#etDNI").val()
    var email = $("#etEmail").val()
    var username = $("#etUsername").val()
    var password = $("#etPassword").val()
    var genre = $('input[name=rdGenre]:checked', '#signup_form').val()
    var handedness = $('input[name=rdHandedness]:checked', '#signup_form').val()
    var handDesease = $('input[name=rdHandDesease]:checked', '#signup_form').val()
    var isImposedPassword = parseBool($("#tvisImposedPassword").text())

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
                $('#btnSubmit').prop('disabled', false);
            }
        }
    }

    http_request.open('POST', url, true)
    var payload = {
        name: name,
        lastname: lastname,
        age: age,
        dni: dni,
        email: email,
        username: username,
        password: password,
        genre: genre, 
        handedness: handedness,
        handDesease: handDesease,
        isImposedPassword : isImposedPassword
    }
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.send(JSON.stringify(payload))
    $('#btnSubmit').prop('disabled', true);
}

window.onload = () => {

    $("#cbConsent").change(function() {
        if(this.checked) {
            $("#btnSubmit").prop('disabled', false)
        }else{
            $("#btnSubmit").prop('disabled', true)
        }
    });
}