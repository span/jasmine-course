/*globals define*/
define(['events', 'jquery'], function(events, $) {
    'use strict';
    
    var self = {};
    
    self.add = function add() {
        var operands = Array.prototype.slice.call(arguments);
        var total = 0;
        
        operands.forEach(function(value) {
            if (typeof value === 'string') {
                value = parseInt(value, 10) | 0;
            }
            total += value;
        });
        
        events.publish('added', {
            operands: operands,
            result: total
        });
        
        return total;
    };
    
    self.addForFact = function addForFact() {
        var operands = Array.prototype.slice.call(arguments);
        var total = 0;
        
        operands.forEach(function(value) {
            if (typeof value === 'string') {
                value = parseInt(value, 10) | 0;
            }
            total += value;
        });
        
        $.get('http://numbersapi.com/' + total + '/trivia', function(fact) {
            events.publish('addedForFact', {
                operands: operands,
                result: total,
                triviaFact: fact
            });
        });
        return total;
    }
    
    self.addAfterDelay = function addAfterDelay(delay, callback) {
        var timeoutDelay = Array.prototype.shift.call(arguments);
        var callback = Array.prototype.shift.call(arguments);
        var operands = arguments;
        
        window.setTimeout(function() {
            callback(self.add.apply(this, operands));
        }, timeoutDelay);
    };
    
    return self;
});