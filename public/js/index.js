function login(){
    var url = '/ws/login'
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