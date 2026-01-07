const Test = require('../Controllers/test.controller');
const Routers=require('express').Router();

Routers.get('/test',Test);
module.exports=Routers;