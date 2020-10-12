//Global variables
var rawUsernameKeydown 
var rawUsernameKeyup 
var rawPasswordKeydown 
var rawPasswordKeyup

var baseTime =  new Big(performance.timing.navigationStart)

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

function isKeyCodeAllow(event) {
    if (event.keyCode == 9 || //ignore tab
        event.keyCode == 13 || //Enter
        event.keyCode == 16 || //shiftleft
        event.keyCode == 17 || //controlLeft
        event.keyCode == 18 || //altLeft
        event.keyCode == 20 || //capslock
        event.keyCode == 37 ||
        event.keyCode == 38 ||
        event.keyCode == 39 ||
        event.keyCode == 40 ||
        event.keyCode == 91) {
        return true
    } else {
        return false
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

function areEqual(){
    var len = arguments.length;
    for (var i = 1; i< len; i++){
       if (arguments[i] === null || arguments[i] !== arguments[i-1])
          return false;
    }
    return true;
 }

function send_data(){
    var username = $("#etUsername").val()
    var password = $("#etPassword").val()


    if (!areEqual(rawUsernameKeydown.length, rawUsernameKeyup.length, username.length) || !areEqual(rawPasswordKeydown.length, rawPasswordKeyup.length, password.length)) {
        resetPasswordLog()
        resetUsernameLog()
        $("#etUsername").focus()
        return
    }


    var url = '/ws/login'
    var http_request = new XMLHttpRequest()

    http_request.onreadystatechange = () => {
        if (http_request.readyState == 4 && http_request.status == 200) {
            var response = JSON.parse(http_request.response);
            if (response.status == 1) {
                alert("Usuario logeado correctamente")
                window.location.href = '/impostor1';
            } else {
                alert("Hubo un error al iniciar sesión: " + response.error)
                resetUsernameLog()
                resetPasswordLog()

                var forms = document.getElementsByClassName('needs-validation')
                Array.prototype.filter.call(forms, function (form) {
                    form.classList.remove('was-validated')
                })
                $('#btnLogin').prop('disabled', false);
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
    $('#btnLogin').prop('disabled', true);
}

window.onload = function () {
    window.localStorage.clear();
    console.clear();

    rawUsernameKeydown = []
    rawUsernameKeyup = []
    rawPasswordKeydown = []
    rawPasswordKeyup = []

    $("#etUsername").keydown(event => {
        if (isKeyCodeAllow(event)) return
        rawUsernameKeydown.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: baseTime.plus(performance.now()).toString()
        })
    })

    $("#etUsername").keyup(event => {
        if (isKeyCodeAllow(event)) return
        rawUsernameKeyup.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: baseTime.plus(performance.now()).toString()
        })
        //BackSpace
        if (event.keyCode == 8) {
            resetUsernameLog()
        }
    })

    $("#etPassword").keydown(event => {
        if (isKeyCodeAllow(event)) return
        rawPasswordKeydown.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: baseTime.plus(performance.now()).toString()
        })
    })


    $("#etPassword").keyup(event => {
        if (isKeyCodeAllow(event)) return
        rawPasswordKeyup.push({
            keyCode: event.keyCode,
            name: event.code,
            timeStamp: baseTime.plus(performance.now()).toString()
        })
        //BackSpace
        if (event.keyCode == 8) {
            resetPasswordLog()
        }
    })

    $("#etUsername").focusin(() => {
        resetUsernameLog()
    })

    $("#etPassword").focusin(() => {
        resetPasswordLog()
    })

    $("#etUsername").focus()
};