//Global variables

var payload = {}

payload.validRecords = []
payload.invalidRecords = []

var rawUsernameKeydown = []
var rawUsernameKeyup = []
var rawPasswordKeydown = []
var rawPasswordKeyup = []

const baseTime = new Big(performance.timing.navigationStart)

const maxAttempts = 3

var impostorUsername
var impostorPassword

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


function isPasswordCorrect() {
    return impostorPassword == $("#etPassword").val()
}

function isUsernameCorrect() {
    return impostorUsername == $("#etUsername").val()
}

function push_invalid_record() {
    payload.invalidRecords.push({
        rawUsernameKeydown: rawUsernameKeydown,
        rawUsernameKeyup: rawUsernameKeyup,
        rawPasswordKeydown: rawPasswordKeydown,
        rawPasswordKeyup: rawPasswordKeyup
    })
}

function push_valid_record() {

    if(
        rawUsernameKeydown.length != impostorUsername.length ||
        rawUsernameKeyup.length != impostorUsername.length || 
        rawPasswordKeydown.length != impostorPassword.length || 
        rawPasswordKeyup.length != impostorPassword.length
    ) return

    payload.validRecords.push({
        rawUsernameKeydown: rawUsernameKeydown,
        rawUsernameKeyup: rawUsernameKeyup,
        rawPasswordKeydown: rawPasswordKeydown,
        rawPasswordKeyup: rawPasswordKeyup
    })

    $("#tvAttempt").text(payload.validRecords.length.toString())

    var progressbar_value = (payload.validRecords.length / maxAttempts) * 100
    progressbar.style.width = progressbar_value + "%";
    progressbar.setAttribute("aria-valuenow", progressbar_value);
    progressbar.innerHTML = Math.round(progressbar_value) + "%"
}

function prepareToSend() {
    $("#divValidate").hide()
    $("#divSend").removeClass("hidden")
    $('#etUsername').prop('readonly', true);
    $('#etPassword').prop('readonly', true);
    $("#btnSend").focus()
}

function validateCredentials() {
    var isDataOK = true
    var forms = document.getElementsByClassName('needs-validation')
    Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            isDataOK = false
        }
        form.classList.add('was-validated')
    })

    if (!isDataOK) return

    if (isPasswordCorrect() && isUsernameCorrect()) {
        push_valid_record()
        if (payload.validRecords.length == maxAttempts) {
            prepareToSend()
        } else {
            $("#etUsername").focus()
        }
    } else {
        push_invalid_record()
        $("#etUsername").focus()
    }
    resetUsernameLog()
    resetPasswordLog()
    
    Array.prototype.filter.call(forms, function (form) {
        form.classList.remove('was-validated')
    })


}

function send_data() {
    var url = '/ws/upload_records'
    var http_request = new XMLHttpRequest()

    http_request.onreadystatechange = () => {
        if (http_request.readyState == 4 && http_request.status == 200) {
            var response = JSON.parse(http_request.response);
            if (response.status == 1) {
                alert("Muestras enviadas correctamente")
                window.location.href = '/impostor2';
            } else {
                alert("Hubo un error al enviar las muestras, por lo que se tendrá que repetir la prueba. Error: " + response.error)
                location.reload();
            }
        }
    }

    http_request.open('POST', url, true)

    payload.belongedUserId = $("#tvImpostorUserId").text()
    payload.username = impostorUsername
    payload.password = impostorPassword

    http_request.setRequestHeader('Content-Type', 'application/json');
    http_request.send(JSON.stringify(payload))
    $('#btnSend').prop('disabled', true);
}

window.onload = () => {

    impostorUsername = $("#tvImpostorUsername").text()
    impostorPassword = $("#tvImpostorPassword").text()

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

}
