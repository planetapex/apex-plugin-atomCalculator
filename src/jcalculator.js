(function(window, $, undefined) {
    (function() {
        var VERSION = '1.0',
            pluginName = 'calculator',
            autoInitSelector = '.calculator-here',
            $body, $calculatorsContainer,
            containerBuilt = false,
            baseTemplate = '' +
            '<div class="calculator">' +
            '<i class="calculator--pointer"></i>' +
            '<div class="calculator--content"></div>' +
            '</div>',
            defaults = {

                displayMode: 'extended',
                showIcon: false,
                icon: 'fa-calculator',
                position: 'bottom left',
                textAlignment: 'rtl',
                theme: 'material',
                buttonStyle: null,
                showMethod: 'click',
                showEvent: 'focus',
                offset: 12,
                keyboardNav: true,
                clearKey: null,
                plsmnsKey: null,
                percKey: null,
                readOnly: true,

                classes: '',
                inline: false,
                autoClose: false,
                calcID: null,

                // events
                onInput: function() {},
                onResult: function() {},
                onSelect: '',
                onShow: '',
                onHide: '',
            },

            calculator;

        var Calculator = function(el, options) {
            this.el = el;
            this.$el = $(el);

            this.opts = $.extend(true, {}, defaults, options, this.$el.data());

            if ($body == undefined) {
                $body = $('body');
            }

            if (this.el.nodeName == 'INPUT') {
                this.elIsInput = true;
            }

            this.inited = false;
            this.visible = false;
            this.silent = false; // Need to prevent unnecessary rendering

            this.keys = [];



            // this._createShortCuts();
            this.init()
        };

        calculator = Calculator;

        calculator.prototype = {
            VERSION: VERSION,
            init: function() {


                if (!containerBuilt && !this.opts.inline && this.elIsInput) {
                    this._buildCalculatorsContainer();
                }
                this._buildBaseHtml();

                if (this.elIsInput) {
                    if (!this.opts.inline) {
                        // Set extra classes for proper transitions
                        this._setPositionClasses(this.opts.position);
                        this._bindEvents()
                    }

                    this.$calculator.on('mousedown', this._onMouseDownCalculator.bind(this));
                    this.$calculator.on('mouseup', this._onMouseUpCalculator.bind(this));
                }




                if (this.opts.classes) {
                    this.$calculator.addClass(this.opts.classes)
                }

                if (this.opts.keyboardNav) {
                    this._bindKeyboardEvents();
                }
                this.opts.calcID = 'jCalc_' + Math.floor(Math.random() * 10000000 + 10000);
                new $.fn.calculator.Body(this, '', this.opts);

                this.inited = true;
            },

            /*
            Keyboard binding
         
             */

            _bindKeyboardEvents: function() {
                this.$el.on('keydown.adp', this._onKeyDown.bind(this));
                this.$el.on('keyup.adp', this._onKeyUp.bind(this));
                this.$el.on('hotKey.adp', this._onHotKey.bind(this));
            },


            _onKeyDown: function(e) {
                var code = e.which;
                this._registerKey(code);
                // console.log('e', e);
                // console.log('ins', this.$calculator.find('.jcalculator span#opa'));



                if ((code >= 96 && code <= 105) || code == 110) {
                    var spn = code == 110 ? 'Dot' : 0 + code - 96;

                    e.preventDefault();
                    // $(this.$calculator).find('.jcalculator span#num' + spn).trigger('click');

                    $('#' + this.opts.calcID).find('span#num' + spn).trigger('click');
                    spn = '';


                } else if (code == 106 || code == 107 || code == 109 || code == 111) {

                    var spn = '';

                    switch (code) {
                        case 106: // multiply
                            spn = 'm';
                            break;
                        case 107: // plus
                            spn = 'a';
                            break;
                        case 109: // minus
                            spn = 's';
                            break;
                        case 111: // divide
                            spn = 'd';
                            break;

                    }
                    e.preventDefault();
                    $('#' + this.opts.calcID).find('span#op' + spn).trigger('click');
                    spn = '';

                } else if (code == 13) { // Enter     
                    e.preventDefault();
                    $('#' + this.opts.calcID).find('span#ope').trigger('click');
                    spn = '';
                } else if (code == 27) { // Esc
                    e.preventDefault();
                    this.hide();
                }
            },

            _onKeyUp: function(e) {
                var code = e.which;
                this._unRegisterKey(code);
            },

            _onHotKey: function(e, hotKey) {
                this._handleHotKey(hotKey);
            },

            _registerKey: function(key) {
                var exists = this.keys.some(function(curKey) {
                    return curKey == key;
                });

                if (!exists) {
                    this.keys.push(key)
                }
            },

            _unRegisterKey: function(key) {
                var index = this.keys.indexOf(key);

                this.keys.splice(index, 1);
            },



            _bindEvents: function() {
                this.$el.on(this.opts.showEvent + '.adp', this._onShowEvent.bind(this));
                this.$el.on('mouseup.adp', this._onMouseUpEl.bind(this));
                this.$el.on('blur.adp', this._onBlur.bind(this));
                this.$el.on('keyup.adp', this._onKeyUpGeneral.bind(this));
                $(window).on('resize.adp', this._onResize.bind(this));
                $('body').on('mouseup.adp', this._onMouseUpBody.bind(this));
            },


            _buildCalculatorsContainer: function() {
                containerBuilt = true;
                $body.append('<div class="calculators-container" id="calculators-container"></div>');
                $calculatorsContainer = $('#calculators-container');
            },

            _buildBaseHtml: function() {
                var $appendTarget,
                    $inline = $('<div class="calculator-inline">');

                if (this.el.nodeName == 'INPUT') {
                    if (!this.opts.inline) {
                        $appendTarget = $calculatorsContainer;
                    } else {
                        $appendTarget = $inline.insertAfter(this.$el)
                    }
                } else {
                    $appendTarget = $inline.appendTo(this.$el)
                }

                this.$calculator = $(baseTemplate).appendTo($appendTarget);

                if (this.opts.theme == 'material') this.$calculator.find('.calculator--pointer').addClass('mat');
                else if (this.opts.theme == 'dark') this.$calculator.find('.calculator--pointer').addClass('drk');
                else if (this.opts.theme == 'light') this.$calculator.find('.calculator--pointer').addClass('lit');



                this.$content = $('.calculator--content', this.$calculator);

            },



            _setPositionClasses: function(pos) {
                pos = pos.split(' ');
                var main = pos[0],
                    sec = pos[1],
                    classes = 'calculator -' + main + '-' + sec + '- -from-' + main + '-';

                if (this.visible) classes += ' active';

                this.$calculator
                    .removeAttr('class')
                    .addClass(classes);
            },

            setPosition: function(position) {
                position = position || this.opts.position;

                var dims = this._getDimensions(this.$el),
                    selfDims = this._getDimensions(this.$calculator),
                    pos = position.split(' '),
                    top, left,
                    offset = parseInt(this.opts.offset),
                    main = pos[0],
                    secondary = pos[1];



                switch (main) {
                    case 'top':
                        top = dims.top - selfDims.height - offset;
                        // console.log('top', top);
                        break;
                    case 'right':
                        left = parseFloat(dims.left) + parseFloat(dims.width) + offset;
                        // console.log('left', left);
                        break;
                    case 'bottom':
                        top = dims.top + dims.height + offset;
                        break;
                    case 'left':
                        left = dims.left - selfDims.width - offset;
                        break;
                }

                switch (secondary) {
                    case 'top':
                        top = parseFloat(dims.top);
                        break;
                    case 'right':
                        left = dims.left + dims.width - selfDims.width;
                        break;
                    case 'bottom':
                        top = dims.top + dims.height - selfDims.height;
                        break;
                    case 'left':
                        left = dims.left;
                        break;
                    case 'center':
                        if (/left|right/.test(main)) {
                            top = dims.top + dims.height / 2 - selfDims.height / 2;
                        } else {
                            left = dims.left + dims.width / 2 - selfDims.width / 2;
                        }
                }

                this.$calculator
                    .css({
                        left: left + 'px',
                        top: top + 'px'
                    })
            },

            _getDimensions: function($el) {
                var offset = $el.offset();
                var dims = {
                    width: $el.outerWidth(),
                    height: $el.outerHeight(),
                    left: offset.left,
                    top: offset.top
                }
                return dims;
            },
            clear: function() {
                //  this.views[this.currentView]._render();
                // this._setInputValue();

            },

            show: function() {
                var onShow = this.opts.onShow;
                // console.log('showing', this.opts.position);
                this.setPosition(this.opts.position);
                this.$calculator.addClass('active');
                this.visible = true;

                if (onShow) {
                    this._bindVisionEvents(onShow)
                }
            },

            hide: function() {
                var onHide = this.opts.onHide;

                this.$calculator
                    .removeClass('active')
                    .css({
                        left: '-100000px'
                    });

                this.focused = '';
                this.keys = [];

                this.inFocus = false;
                this.visible = false;
                this.$el.blur();

                if (onHide) {
                    this._bindVisionEvents(onHide)
                }
            },

            _bindVisionEvents: function(event) {
                this.$calculator.off('transitionend.dp');
                event(this, false);
                this.$calculator.one('transitionend.dp', event.bind(this, this, true))
            },


            _trigger: function(event, args) {
                this.$el.trigger(event, args)
            },



            destroy: function() {
                var _this = this;
                _this.$el
                    .off('.adp')
                    .data('calculator', '');


                _this.focused = '';


                if (_this.opts.inline || !_this.elIsInput) {
                    _this.$calculator.closest('.calculator-inline').remove();
                } else {
                    _this.$calculator.remove();
                }
            },

            _onShowEvent: function(e) {
                if (!this.visible) {
                    this.show();
                }
            },

            _onBlur: function() {
                if (!this.inFocus && this.visible) {
                    this.hide();
                }
            },

            _onMouseDownCalculator: function(e) {
                this.inFocus = true;
            },

            _onMouseUpCalculator: function(e) {
                this.inFocus = false;
                e.originalEvent.inFocus = true;

            },

            _onKeyUpGeneral: function(e) {
                var val = this.$el.val();

                if (!val) {
                    this.clear();
                }
            },

            _onResize: function() {
                if (this.visible) {
                    this.setPosition();
                }
            },

            _onMouseUpBody: function(e) {
                if (e.originalEvent.inFocus) return;

                if (this.visible && !this.inFocus) {
                    this.hide();
                }
            },

            _onMouseUpEl: function(e) {
                e.originalEvent.inFocus = true;
                setTimeout(this._onKeyUpGeneral.bind(this), 4);
            },

        };


        $.fn.calculator = function(options) {



            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName,
                        new Calculator(this, options));
                } else {
                    var _this = $.data(this, pluginName);

                    _this.opts = $.extend(true, _this.opts, options);
                    //   _this.update();
                }
            });
        };

        $.fn.calculator.Constructor = Calculator;

        $(function() {
            $(autoInitSelector).calculator();
        })

    })();

    ;



    /*body Part*/

    ;
    (function() {
        calculator = $.fn.calculator,
            dp = calculator.Constructor;
        calculator.Body = function(d, type, opts) {

            var self = this;

            var calc = d;
            this.d = d;

            this.type = type;
            this.opts = opts;

            this.$display = $(calc.el); //element

            // this.calcID = 343242342; //calc.opts.calcID; //element


            if (calc.opts.textAlignment == 'rtl') {
                this.$display.css({ 'text-align': 'right' });
            }

            if (calc.opts.readOnly) {
                this.$display.attr('readOnly', true);
            }


            if (this.opts.displayMode == "basic") { //jCalculator Obj
                this.$calc = $(this.template1)
                    .appendTo(this.d.$content)
                    .addClass("temp1")
            } else {
                this.$calc = $(this.template2)
                    .appendTo(this.d.$content)
                    .addClass("temp2");

            }

            $('');

            this.$calc.attr('id', calc.opts.calcID);
            this.$calc.addClass('temp');

            if (calc.opts.buttonStyle) {
                this.$calc.find('span').addClass('buttonStyle' + calc.opts.buttonStyle);
            }

            /**
             * Add theme
             */
            this.$calc.addClass(calc.opts.theme);
            if (this.opts.theme == 'light') {
                this.$calc.find('span').addClass('ani-lit');
            } else {
                this.$calc.find('span').addClass('ani-mat');
            }



            $('span.clear-btn', this.$calc).on('click', this._clrPress.bind(self));
            $('span.num-btn', this.$calc).on('click', this._numPress.bind(self));
            //
            $("span.plusminus-btn", this.$calc).on('click', this._signPress.bind(self));
            // Percent operations
            $('span.percent-btn', this.$calc).on('click', this._percPress.bind(self));
            // $('span.func-btn', this.$calc).on('click', this._funcPress.bind(self));
            $('.func-btn').on('click', this._funcPress.bind(self));
            $('span.eql-btn', this.$calc).on('click', this._eqPress.bind(self));




            this.init();




        };



        calculator.Body.prototype = {
            init: function() {
                this.resetCalculator("0");


            },

            template1: '' +
                '<div class="jcalculator">' +
                /*row 1*/
                '<span id="num7" class="num-btn seven">7</span>' +
                '<span id="num8" class="num-btn eight">8</span>' +
                '<span id="num9" class="num-btn nine">9</span>' +
                '<span id="opd" class="op func-btn divide">&#247;</span>' +


                /*row 2*/
                '<span id="num4" class="num-btn four">4</span>' +
                '<span id="num5" class="num-btn five">5</span>' +
                '<span id="num6" class="num-btn six">6</span>' +
                '<span id="opm" class="op func-btn multiply">x</span>' +


                /*row 3*/
                '<span id="num1" class="num-btn one">1</span>' +
                '<span id="num2" class="num-btn two">2</span>' +
                '<span id="num3" class="num-btn three">3</span>' +
                '<span id="ops" class="op func-btn subtract">-</span>' +

                /*row 4*/

                '<span class="clear-btn clear">C</span>' +
                '<span id="num0"  class="num-btn zero-btn zero">0</span>' +
                '<span id="ope" class="eq eql-btn">=</span>' +
                '<span id="opa" class="op func-btn add">+</span>' +

                '</div>'

            ,

            template2: '' +
                '<div class="jcalculator">' +
                /*row 1*/
                '<span class="clear-btn clear">C</span>' +
                '<span id="oppsms" class="op  plusminus-btn plusminus">&#177</span>' +
                '<span id="opper" class="op percent-btn percent">%</span>' +
                '<span id="opd" class="op func-btn divide">&#247;</span>' +

                /*row 2*/
                '<span id="num7" class="num-btn seven">7</span>' +
                '<span id="num8" class="num-btn eight">8</span>' +
                '<span id="num9" class="num-btn nine">9</span>' +
                '<span id="opm" class="op func-btn multiply">x</span>' +

                /*row 3*/
                '<span id="num4" class="num-btn four">4</span>' +
                '<span id="num5" class="num-btn five">5</span>' +
                '<span id="num6" class="num-btn six">6</span>' +
                '<span id="opa" class="op func-btn add">+</span>' +

                /*row 4*/
                '<span id="num1" class="num-btn one">1</span>' +
                '<span id="num2" class="num-btn two">2</span>' +
                '<span id="num3" class="num-btn three">3</span>' +
                '<span id="ops" class="op func-btn subtract">-</span>' +

                /*row 5*/
                '<span id="num0"  class="num-btn zero-btn zero">0</span>' +
                // '<span id=""  class=""></span>' +
                '<span id="numDot" class = "num-btn dot">.</span>' +
                '<span id="ope" class="eq eql-btn">=</span>' +
                '</div>',


            show: function() {

                this.$el.addClass('active');
                this.acitve = true;
            },

            hide: function() {
                this.$el.removeClass('active');
                this.active = false;
            },

            round: function(value, decimals) {
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
            },


            pull: function() {
                return this.$display.val() || this.$display.text();
            },


            push: function(val) {
                if (this.$display.is('input')) this.$display.val(val);
                else this.$display.text(val);

            },

            /*clear*/

            resetCalculator: function(curValue) {
                this.push(curValue);


                $(".func-btn").removeClass("currFunction");
                this.$display.data("isCurrFunction", false);
                this.$display.data("CurrFunction", "");
                this.$display.data("isPrevFunction", false);
                this.$display.data("PrevFunction", "");
                this.$display.data("valueOneLocked", false);
                this.$display.data("valueTwoLocked", false);
                this.$display.data("valueOne", curValue);
                this.$display.data("valueTwo", 0);
                this.$display.data("fromPrevious", false);
                this.$display.data("typing1stChar", true);
                this.$display.data("isRunTotal", false);




            },
            resetDisplay: function(curValue, setValueOne, val2, setValueTwo) {
                this.push(curValue);

                $(".func-btn").removeClass("currFunction");
                this.$display.data("isPrevFunction", false);
                this.$display.data("PrevFunction", '');

                if (setValueOne) {
                    this.$display.data("valueOneLocked", true);
                    this.$display.data("valueOne", curValue);

                } else {
                    this.$display.data("valueOneLocked", false);
                    this.$display.data("valueOne", 0);

                }

                if (setValueTwo) {
                    this.$display.data("valueTwoLocked", true);
                    this.$display.data("valueTwo", val2);

                } else {
                    this.$display.data("valueTwoLocked", false);
                    this.$display.data("valueTwo", 0);

                }

                this.$display.data("typing1stChar", true);
                this.$display.data("isRunTotal", false);
                this.$display.data("memPlus", 0);


                this.$display.data("fromPrevious", false);


            },

            recursion: function(curValue) {
                this.push(curValue);

                $(".func-btn").removeClass("currFunction");
                this.$display.data("isPrevFunction", false);
                this.$display.data("PrevFunction", '');
                this.$display.data("valueOneLocked", true);
                this.$display.data("valueOne", curValue);
                this.$display.data("valueTwoLocked", true);
                this.$display.data("valueTwo", 0);
                this.$display.data("typing1stChar", true);
                this.$display.data("isRunTotal", false);
                this.$display.data("fromPrevious", false);


            },


            _clrPress: function(e) {
                this.ripple(e.target);
                this.resetCalculator("0");


            },
            _numPress: function(e) {
                // console.log('num pressed', e);
                this.ripple(e.target);
                this.$display.data("memPlus", 0);
                var $numPressed = $(e.target).text().trim(),
                    dispValue = this.pull();
                // if (dispValue == "0") {
                //     dispValue = "";
                // }

                var newValue = dispValue + $numPressed;



                if ((this.$display.data("isCurrFunction") == true) && (this.$display.data("valueOneLocked") == true)) {
                    // console.log("2nd Entry");
                    if (this.$display.data("typing1stChar") === true) { //first Digit
                        // console.log("first Digit");
                        if ($numPressed == '.') {
                            this.push('0' + $numPressed);

                        } else {
                            this.push($numPressed);
                        }



                    } else { //2nd...
                        // console.log("2nd character....");
                        if ($numPressed == '.') {
                            // console.log('dot pressed');
                            if (dispValue.indexOf('.') >= 1) {

                            } else if (dispValue.length > 0) {
                                this.push(newValue);

                            } else {
                                this.push('0' + $numPressed);
                            }
                            //    else if ($numPressed == '.' && this.pull() == '0.' && this.pull().length == 2) {




                        } else if ($numPressed == '0' && dispValue == '0') {
                            // console.log('0 pressed');
                            this.$display.data("typing1stChar", true);

                        } else {
                            // console.log('other pressed');

                            this.push(newValue);

                        }
                    }


                    this.$display.data("valueTwo", this.pull());
                    this.$display.data("valueTwoLocked", true);
                    this.$display.data("typing1stChar", false);





                    // Clicking on a number fresh/first Entry
                } else {
                    // console.log("First Entry");
                    if (this.$display.data("typing1stChar") === true) {
                        // console.log("first character");
                        if ($numPressed == '.') {
                            // console.log("dot pressed")
                            if (dispValue.indexOf('.') < 1) {
                                this.push('0' + $numPressed);

                            } else {
                                this.push($numPressed);
                                if (this.pull() == '.') {
                                    this.push('0' + $numPressed);
                                }
                            }
                            this.$display.data("typing1stChar", false);
                        } else if ($numPressed == '0' && dispValue == '0') {
                            // console.log("0 pressed")
                            this.$display.data("typing1stChar", true);
                        } else {
                            this.push($numPressed);
                            this.$display.data("typing1stChar", false);
                        }

                    } else {
                        // console.log("2nd character…");
                        if ($numPressed == '.') {
                            // console.log('dot pressed');
                            if (dispValue.indexOf('.') >= 1) {
                                // console.log('>= 1');

                            } else {
                                // console.log('=0');
                                //this.push('0' + $numPressed);
                                this.push(newValue);
                            }
                            //    else if ($numPressed == '.' && this.pull() == '0.' && this.pull().length == 2) {




                        } else if ($numPressed == '0' && dispValue == '0') {
                            // console.log('0 pressed');
                            this.$display.data("typing1stChar", true);

                        } else {
                            // console.log('other pressed');

                            this.push(newValue);

                        }
                    }
                }
            },

            _signPress: function(e) {
                this.ripple(e.target);
                if ((this.$display.data("valueOneLocked") == false) && (this.$display.data("valueTwoLocked") == false)) {
                    var changesign = this.pull();
                    changesign = changesign * -1;
                    this.push(changesign);
                } else if ((this.$display.data("valueOneLocked") == true)) {
                    var changesign = this.$display.data("valueTwo");
                    changesign = changesign * -1;
                    this.$display.data("valueTwo", changesign);
                    this.push(changesign);
                } else if ((this.$display.data("valueTwoLocked") == true)) {
                    var changesign = this.$display.data("valueOne");
                    changesign = changesign * -1;
                    this.$display.data("valueOne", changesign);
                    this.push(changesign);
                }

            },
            _percPress: function(e) {
                this.ripple(e.target);
                var percentNum, finalValue;
                if ((this.$display.data("valueOneLocked") == false && this.$display.data("valueTwoLocked") == false) || (this.$display.data("valueOneLocked") == true && this.$display.data("valueTwoLocked") == false && this.$display.data("isCurrFunction") === true)) {
                    percentNum = this.pull();
                    finalValue = percentNum / 100;
                    //this.push(finalValue);
                    this.resetCalculator(finalValue);

                } else if ((this.$display.data("valueTwoLocked") == true) && (this.$display.data("CurrFunction") == "-") || (this.$display.data("CurrFunction") == "+")) {
                    percentNum = this.$display.data("valueTwo");
                    var newNum = this.$display.data("valueOne");
                    percentNum = percentNum / 100;
                    finalValue = newNum * percentNum;
                    this.push(finalValue);
                    this.$display.data("valueTwo", finalValue);
                } else if ((this.$display.data("valueTwoLocked") === true) && (this.$display.data("CurrFunction") == "x") || (this.$display.data("CurrFunction") == String.fromCharCode(247))) {
                    percentNum = this.$display.data("valueTwo");
                    finalValue = percentNum / 100;
                    this.push(finalValue);
                    this.$display.data("valueTwo", finalValue);
                }

                this.$display.data("typing1stChar", true);


                this.ripple(e.target);

            },
            _funcPress: function(e) {
                this.ripple(e.target);
                // console.log('fun pressed', e);
                var dispVal = this.pull();
                var pendingFunction = $(e.target).text().trim();

                if (this.$display.data("isCurrFunction") === true) {
                    this.$display.data("PrevFunction", this.$display.data("CurrFunction"))
                    this.$display.data("isPrevFunction", true);
                    this.$display.data("isRunTotal", true);
                    this.$display.data("typing1stChar", true);
                    if (this.$display.data("valueTwoLocked")) {
                        this._eqPress.call(this, e, this.$display.data("CurrFunction"));
                    }


                } else {
                    this.$display.data("valueOne", dispVal);
                    this.$display.data("valueOneLocked", true);
                    this.$display.data("typing1stChar", true);
                    this.$display.data("isRunTotal", false);

                }

                this.$display.data("isCurrFunction", true);
                this.$display.data("CurrFunction", pendingFunction);
                // Visually represent the current function
                $("span.func-btn").removeClass("currFunction");
                $(e.target).addClass("pendingFunction");




            },
            _eqPress: function(e, parmFunction) {
                this.ripple(e.target);
                var eqlbBtn = $(e.target).text().trim(),
                    finalValue;

                if (this.$display.data("valueOneLocked") && this.$display.data("valueTwoLocked")) {
                    var currfunction, val1, val2;
                    currfunction = parmFunction || this.$display.data("CurrFunction");


                    val1 = this.$display.data("valueOne");
                    val2 = this.$display.data("valueTwo");

                    switch (currfunction) {
                        case "+":
                            finalValue = parseFloat(val1) + parseFloat(val2);
                            break;
                        case "-":
                            finalValue = parseFloat(val1) - parseFloat(val2);
                            break;
                        case "x":
                            finalValue = parseFloat(val1) * parseFloat(val2);
                            break;
                        case String.fromCharCode(247):
                            finalValue = parseFloat(val1) / parseFloat(val2);
                            break;
                    }
                } else {
                    finalValue = this.pull();

                }

                // finalValue = finalValue.toFixed(15);
                finalValue = this.round(finalValue, 8);


                // this.push(finalValue)


                // if (finalValue % 1 != 0) {
                //     console.log(finalValue);
                //     var decimalPlaces = finalValue.toString().split(".")[1].length;
                //     if (decimalPlaces > 6) {
                //         finalValue = finalValue.toPrecision(6);
                //     } else {
                //         finalValue = finalValue.toPrecision();
                //     }
                // }


                if (this.$display.data("isRunTotal") === true) {
                    this.resetDisplay(finalValue, true);

                } else {
                    this.resetCalculator(finalValue);
                }






            },

            ripple: function(elm) {

                /**
                 * Material ripple effect
                 */
                if ($(elm).hasClass('ripple')) {
                    $(elm).removeClass('ripple');
                    setTimeout(function() {
                        $(elm).addClass('ripple')
                    }, 0);
                } else {
                    $(elm).addClass('ripple');
                }



            }
        };
    })();


})(window, jQuery);