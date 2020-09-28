//Global variables
var rawUsernameKeydown 
var rawUsernameKeyup 
var rawPasswordKeydown 
var rawPasswordKeyup

function resetUsernameLog() {
    rawUsernameKeydown = []
    rawUsernameKeyup = []
    $("#etUsername").val("")
}

function resetPasswordLog() {
    rawPasswordKeydown = []
    rawPasswordKeyup = []
    $("#etPassword").val("")
}

function usernameKeylog(event) {
    //ignore tab
    if (event.keyCode == 9) return

    if ('keydown' == event.type) {
        rawUsernameKeydown.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: Date.now()
        })
    } else if ('keyup' == event.type) {
        rawUsernameKeyup.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: Date.now()
        })
        //BackSpace
        if (event.keyCode == 8) {
            resetUsernameLog()
        }
    }
}

function passwordKeylog(event) {
    //ignore tab
    if (event.keyCode == 9) return

    if ('keydown' == event.type) {
        rawPasswordKeydown.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: Date.now()
        })
    } else if ('keyup' == event.type) {
        rawPasswordKeyup.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: Date.now()
        })
        //BackSpace
        if (event.keyCode == 8) {
            resetPasswordLog()
        }
    }
}


function login() {
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

function send_data(){
    var username = $("#etUsername").val()
    var password = $("#etPassword").val()

    var url = '/ws/login'
    var http_request = new XMLHttpRequest()

    http_request.onreadystatechange = () => {
        if (http_request.readyState == 4 && http_request.status == 200) {
            var response = JSON.parse(http_request.response);
            if (response.status == 1) {
                alert("Usuario logeado correctamente")
                window.location.href = '/impostor';
            } else {
                alert("Hubo un error al iniciar sesión: " + response.error)
                resetUsernameLog()
                resetPasswordLog()
                $("#etUsername").focus()
            }
        }
    }

    http_request.open('POST', url, true)
    var payload = {
        username: username,
        password: password,
        rawUsernameKeydown: rawUsernameKeydown,
        rawUsernameKeyup : rawUsernameKeyup,
        rawPasswordKeydown: rawPasswordKeydown,
        rawPasswordKeyup: rawPasswordKeyup
    }
    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.send(JSON.stringify(payload))
}

window.onload = function () {
    window.localStorage.clear();
    console.clear();

    rawUsernameKeydown = []
    rawUsernameKeyup = []
    rawPasswordKeydown = []
    rawPasswordKeyup = []

    $("#etUsername").focusin(() => {
        resetUsernameLog()
    })

    $("#etPassword").focusin(() => {
        resetPasswordLog()
    })

    $("#etUsername").focus()
};