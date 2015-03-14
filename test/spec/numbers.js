/*globals define, describe, it, beforeEach, jasmine*/
define(['numbers', 'events', 'lib/matchers'], function(numbers, events, matchers) {
    'use strict';

    describe('The numbers module', function() {
        var output;
        beforeEach(function() {
            this.numberInput1 = 1;
            this.numberInput2 = 2;
            this.stringInput1 = '1';
            this.stringInput2 = 'unparsable';
            
            jasmine.addMatchers(matchers);
        });
        
        describe('The add method', function() {
            it('should accept one or more numerical arguments and return the sum of them', function() {
                output = numbers.add(this.numberInput1, this.numberInput2);
                expect(output).toEqual(3);
                expect(output).not.toEqual(4);
            });
            
            it('should try to parse an integer when a string is passed to the method', function() {
                output = numbers.add(this.stringInput1, this.numberInput2);
                expect(output).toEqual(3);
            });
            
            it('should ignore any argument that is not parsable', function() {
                output = numbers.add(this.stringInput1, this.stringInput2);
                expect(output).toEqual(1);
            });
            
            it('should publish an event showing the operands passsed and the result', function() {
                var x, len, calls;
                
                spyOn(events, 'publish');
                //spyOn(events, 'publish').and.callThrough();
                //spyOn(events, 'publish').and.returnValue(false);
                //spyOn(events, 'publish').and.callFake(function(name, args) { window.alert(name) });
                //spyOn(events, 'publish').and.throwError('uh oh!');
                //spyOn(events, 'publish').and.stub();
                //expect(funtion() { numbers.add(1, 1);}).toThrowError('uh oh!');
                
                expect(events.publish.calls.any()).toBe(false);
                numbers.add(this.numberInput1, this.numberInput2);
                expect(events.publish).toHaveBeenCalled();
                expect(events.publish).toHaveBeenCalledWith('added', { 
                    operands: [this.numberInput1, this.numberInput2], 
                    result: 3 
                });
                
                //expect(events.publish.calls.any()).toBe(true);
                expect(events.publish.calls.count()).toEqual(1);
                numbers.add(this.stringInput1, this.numberInput2);
                expect(events.publish.calls.count()).toEqual(2);
                expect(events.publish.calls.argsFor(1)).toEqual([jasmine.any(String), {
                    operands: [this.stringInput1, this.numberInput2],
                    result: 3
                }]);
                 //expect(events.publish.calls.argsFor(1)).toEqual([jasmine.any(String), jasmine.any(Object)]);
//expect(events.publish.calls.mostRecent().args).toEqual([jasmine.any(String), jasmine.any(Object)]);
//expect(events.publish.calls.allArgs()).toEqual([[jasmine.any(String), jasmine.any(Object)], [jasmine.any(String), jasmine.any(Object)]]);

                calls = events.publish.calls.all();
                for(x = 0, len = calls.length; x < len; x+= 1) {
                    expect(calls[x].object.id).toEqual('events');
                }
            });
            
            it('should return numbers that are either odd or even', function() {
                output = numbers.add(this.numberInput1, this.numberInput2);
                expect(output).toBeOdd();
                
                output = numbers.add(this.numberInput1, this.numberInput1);
                expect(output).not.toBeOdd();
            });
        });
        
        describe('The addForFact method', function() {
            it('should invoke the addForFact method too add numbers and return a fact result', function(done) {
                var that = this;
                numbers.addForFact(this.numberInput1, this.numberInput2);
                events.subscribe('addedForFact', function(data) {
                    expect(data.operands).toEqual([that.numberInput1, that.numberInput2]);
                    expect(data.result).toEqual(3);
                    expect(data.triviaFact).toEqual(jasmine.any(String));
                    done();
                });
            });
        });
        
        describe('The addAFterDelay method', function() {
            var noop = function() {}
            
            beforeEach(function() {
                spyOn(numbers, 'add');
                jasmine.clock().install();
            });
            
            afterEach(function() {
                jasmine.clock().uninstall();
            });
            
            it('should invoke the add method after a specified delay', function() {
                numbers.addAfterDelay(1000, noop, 1, 2);
                expect(numbers.add).not.toHaveBeenCalled();
                jasmine.clock().tick(1001);
                expect(numbers.add).toHaveBeenCalled();
            });
        });
        
    });
});
