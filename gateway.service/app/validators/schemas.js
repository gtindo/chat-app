
exports.register = {
  "type": "object",
  "required": ["username", "email", "password"],
  "properties": {
    "username": {"type": "string"},
    "email": {"type": "string", "isEmail": true},
    "password": {"type": "string", "minLenght": 6}
  }
}


exports.login = {
  "type": "object",
  "required": ["username", "password"],
  "properties": {
    "username": {"type": "string"},
    "password": {"type": "string"}
  }
}

