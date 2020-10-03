function recoverPass() {
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
    var email = $("#etEmail").val()
    var url = '/ws/forgotpassword'
    var http_request = new XMLHttpRequest()
    http_request.onreadystatechange = () => {
        if (http_request.readyState == 4 && http_request.status == 200) {
            var response = JSON.parse(http_request.response);
            if (response.status == 1) {
                alert("Cuenta recuperada: " + response.msg)
                window.location.href = '/';
            } else {
                alert("Hubo un error: " + response.error)
                $('#btnSubmit').prop('disabled', false);
            }
        }
    }

    http_request.open('POST', url, true)
    var payload = {
        email: email,
    }
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.send(JSON.stringify(payload))
    $('#btnSubmit').prop('disabled', true);
}
