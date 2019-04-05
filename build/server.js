"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _myRoutes = _interopRequireDefault(require("./routes/myRoutes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var app = (0, _express.default)();
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());
app.use('/api/v1/', _myRoutes.default);
var port = process.env.PORT || 3050;
var server = app.listen(port, function () {
  return console.log("The server is listening on port ".concat(port));
});
module.exports = server;