var express = require('express');
var router = express.Router();
var {onDevice, offDevice, getSocketData} =require('../controller/alexaController')
/* GET home page. */

var meterReading = 0, getBstatus, deviceSts="off"; //var used to moniter the device alast status

// logic to handel the device status
getSocketData(function(data){
	if (data.meter && (meterReading < data.meter)) {
		meterReading =data.meter;
	}
	if (data.bstatus) {
		getBstatus = data.bstatus;
	}
	if(data.allt !== undefined){
		deviceSts = data.allt == 1? 'on':'off';
	}
});

// midlware to verify the device status
var bstsVerify = function(req, res, next){
	if (getBstatus == "1") {
		next();
	}
	else{
		res.json({
			toSpeek : `Device is offline so I can't turn on/off the device`
		})
	}
}


// function to add required data to req object
var getAddData = function(req, res, next){
	req.deviceSts = deviceSts;
	next();
}


// function to send the res to lambda
var sendResponce = function(req, res, next){
	res.json({
		toSpeek : req.toSpeek
	});
}


//router to get "ON" request to turn "ON" the device 
router.get('/on',bstsVerify, getAddData, onDevice, sendResponce);

//router to get "OFF" request to turn "OFF" the device 
router.get('/off',bstsVerify, getAddData, offDevice, sendResponce);

//router to tell meter reading to lambda  
router.get('/meter',(req, res)=>{
	console.log(meterReading);
	res.json({
		meter : Math.round(meterReading/32)
	});
});

//router to tell the device status (online/offline) to lambda
router.get('/status',(req, res)=>{
	res.json({
		bstatus : getBstatus
	});
});

module.exports = router;
