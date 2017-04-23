(function($, widget) {
    $.widget('ui.atomCalculator', {
        // default options
        options: {
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


            // events
            onInput: function() {},
            onResult: function() {},
            onSelect: '',
            onShow: '',
            onHide: '',
        },

        /**
         * Set private widget varables
         */
        _setWidgetVars: function() {
            this.apex = {
                item: $(this.element),
                $elm: $(this.element),
                calculatorButton: null,
                calculator: null

            };

            this._scope = 'ui.atomCalculator'; //For debugging


        }, //_setWidgetVars



        /**
         * Init function. This function will be called each time the widget is referenced with no parameters
         */
        _init: function() {

            //For this plug-in there's no code required for this section
            //Left here for demonstration purposes
            apex.debug.log(this._scope, '_init', this);
        }, //_init



        /**
         * Create function: Called the first time widget is associated to the object
         * Does all the required setup etc and binds change event
         */
        _create: function() {


            this._setWidgetVars();



            if (this.options.showIcon) {
                this.apex.item.after('<button type="button" class="atomCalculatorBtn a-Button a-Button-icon t-Button t-Button--noLabel t-Button--icon" aria-label="calculator" title="Calculator" >' +
                    '<span class="t-Icon fa ' + this.options.icon + '" aria-hidden="true"></span></button>');
                this.apex.calculatorButton = this.apex.item.next('button.atomCalculatorBtn');

            }




            var consoleGroupName = this._scope + '_create';

            apex.debug.log('this:', this);

            //Register Atom calculator



            apex.debug.log('element:', this.apex.item);

            // if (this.options.position == 'right bottom' || this.options.position == 'right top') {
            //     this.options.offset = 47;
            // }

            // Event handling
            //==========================================================================================


            this.options.onShow = function(o, animationCompleted) {

                var extraParams = {
                        inst: o,
                        animationCompleted: animationCompleted
                    },
                    $this = $('#' + o.el.id);

                if (animationCompleted) {
                    $this.trigger('onshow', extraParams);
                    //apex.event.trigger(document.getElementById(o.el.id), 'onshow');
                }

            }
            this.options.onHide = function(o, animationCompleted) {
                var extraParams = {
                        inst: o,
                        animationCompleted: animationCompleted
                    },
                    $this = $('#' + o.el.id);


                if (animationCompleted) {
                    $this.trigger('onhide', extraParams);
                    //apex.event.trigger(document.getElementById(o.el.id), 'onhide');
                }
            }





            // initialize
            //==========================================================================================

            this.options.showEvent = '';

            this.apex.calculator = this.apex.item.calculator(this.options, function(start, end, label) {
                //console.log('---Callback function---');
            }).data('calculator');

            // this.apex.calculator = this.apex.item.calculator(this.options);




            // Show Methods handling
            //==========================================================================================

            if (this.options.showMethod == 'click') {
                this.apex.item.on('click', $.proxy(this._nativeShowCalculator, this));

            } else if (this.options.showMethod == 'icon' && this.options.showIcon) {

                this.apex.calculatorButton.on('click', $.proxy(this._nativeShowCalculator, this));


            } else if (this.options.showMethod == 'clickicon') {

                this.apex.item.on('click', $.proxy(this._nativeShowCalculator, this));
                if (this.options.showIcon) {
                    this.apex.calculatorButton.on('click', $.proxy(this._nativeShowCalculator, this));

                }




            } else if (this.options.showMethod == 'focus') {
                this.apex.item.on('focus', $.proxy(this._nativeShowCalculator, this));
                if (this.options.showIcon) {
                    this.apex.calculatorButton.on('focus', $.proxy(this._nativeShowCalculator, this));

                }


            }

            // else if (this.options.showMethod == 'mouseenter') {
            //     this.apex.item.on('mouseenter', $.proxy(this._nativeShowCalculator, this));
            //     if (this.options.showIcon) {
            //         this.apex.calculatorButton.on('mouseenter', $.proxy(this._nativeShowCalculator, this));
            //     }
            // }



            this._apex_da(this.apex);

        }, //_create



        _nativeShowCalculator: function() {

            if (this.apex.item.is('.disabled')) {
                return false;
            }
            this.apex.calculator.show();
        },

        _nativeHideCalculator: function() {
            if (this.apex.item.is('.disabled')) {
                return false;
            }
            this.apex.calculator.hide();
        },



        _apex_da: function(daElem) {

            var
                pName = daElem.item.attr('id'),

                pOptions = {
                    enable: function() {
                        daElem.item
                            .prop('disabled', false)
                            .atomCalculator('enable') // call native jQuery UI enable
                            .removeClass('apex_disabled')
                            .removeClass('disabled'); // remove disabled class
                    },
                    disable: function() {

                        daElem.item
                            .prop('disabled', true)
                            .atomCalculator('disable')
                            .addClass('apex_disabled')
                            .addClass('disabled');



                    },
                    afterModify: function() {

                        // code to always fire after the item has been modified (value set, enabled, etc.)
                    },
                    loadingIndicator: function(pLoadingIndicator$) {
                        // code to add the loading indicator in the best place for the item
                        return pLoadingIndicator$;
                    }


                };

            apex.widget.initPageItem(pName, pOptions);
        },


        /**
         * Removes all functionality associated with the atomCalculator
         * Will remove the change event as well
         * Odds are this will not be called from APEX.
         */
        destroy: function() {

                apex.debug.log(this._scope, 'destroy', this);
                $.Widget.prototype.destroy.apply(this, arguments); // default destroy
                // unregister calculator
                $(this.element).calculator('destroy');
            } //destroy
    });

})(apex.jQuery, apex.widget);