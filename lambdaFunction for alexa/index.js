'use strict';
const Alexa = require('alexa-sdk');
var fetch = require('node-fetch');


const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const data = [
    'A year on Mercury is just 88 days long.',
    'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
    'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
    'On Mars, the Sun appears about half the size as it does on Earth.',
    'Earth is the only planet not named after a god.',
    'Jupiter has the shortest day of all the planets.',
    'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
    'The Sun contains 99.86% of the mass in the Solar System.',
    'The Sun is an almost perfect sphere.',
    'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
    'Saturn radiates two and a half times more energy into space than it receives from the sun.',
    'The temperature inside the Sun can reach 15 million degrees Celsius.',
    'The Moon is moving approximately 3.8 cm away from our planet every year.',
];

const handlers = {
    'LaunchRequest': function() {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function() {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function() {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function() {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function() {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },

    'onDevice': function(){
        var _this = this;
        fetch('https://shapalexa.herokuapp.com/on')
            .then(function(res){
                return res.json();
            })
            .then(function(body){
                _this.response.speak(`${body.toSpeek}`);
                _this.emit(':responseReady');
            })
            .catch(function(err){
                _this.response.speak('unable to on device');
                _this.emit(':responseReady');
            });
        
    },

    'offDevice':function(){
        var _this = this;
        fetch('https://shapalexa.herokuapp.com/off')
            .then(function(res){
                return res.json();
            })
            .then(function(body){
                _this.response.speak(`${body.toSpeek}`);
                _this.emit(':responseReady');
            })
            .catch(function(err){
                _this.response.speak('unable to off device');
                _this.emit(':responseReady');
            });
        
    },

    'getMeterReading' : function(){
        
        var _this = this;
        fetch('https://shapalexa.herokuapp.com/meter')
            .then(function(res){
                return res.json();
            }).then(function(body){
                _this.response.speak(`Your total uses of electricity is ${body.meter} units, and you have to pay ${body.meter*7} rupees for it`);
                _this.emit(':responseReady');
            })
            .catch(function(err){
                _this.response.speak('unable to get meter readings');
                _this.emit(':responseReady');
            });
        
    },

    'getStatus' : function(){
        var _this = this;
        fetch('https://shapalexa.herokuapp.com/status')
            .then(function(res){
                return res.json();
            }).then(function(body){
                if (body.bstatus == "1") {
                    _this.response.speak(`Device status : Online`);
                }
                else{
                    _this.response.speak(`Device status : Offline`);
                }
                
                _this.emit(':responseReady');
            })
            .catch(function(err){
                _this.response.speak('unable to get status');
                _this.emit(':responseReady');
            });
    }
};



exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


