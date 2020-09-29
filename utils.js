var Chance = require('chance');

var random_user_assignation = () => {
    var chance = new Chance();
    return chance.weighted(['imposed', 'personal'], [7, 3])
}


var random_user_of_array = (usersList, weightList) => {
    var chance = new Chance();
    return chance.weighted(usersList, weightList)
}


var gcd = function (a, b) {
    return a ? gcd(b % a, a) : b;
}

var lcm = function (a, b) {
    return a * b / gcd(a, b);
}

function lcm_of_array(input_array) {
    return input_array.reduce(lcm)
}


function getClientIp(req) {
    var ipAddress;
    // The request may be forwarded from local web server.
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
      // 'x-forwarded-for' header may return multiple IP addresses in
      // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
      // the first one
      var forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
      // If request was not forwarded
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
  };


exports.random_user_assignation = random_user_assignation
exports.random_user_of_array = random_user_of_array
exports.lcm = lcm_of_array
exports.getClientIp = getClientIp