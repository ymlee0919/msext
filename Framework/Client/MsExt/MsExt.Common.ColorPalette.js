Ext.define('MsExt.common.ColorPalette', {
    extend: 'Ext.window.Window',
    height: 210,
    width: 460,
    layout: {columns: 2,type: 'table'},
    bodyPadding: 5,
    animateTarget : document.body,
    title: 'Color',
    modal : true,
    resizable : false,
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
            {
                xtype: 'fieldset',
                height: 125,
                width: 177,
                title: 'Color',
                items: [{
                    xtype: 'colormenu',
                    floating: false,
                    listeners: {
                        select: {
                            fn: function(colorpicker, color, options){
                                this.setSampleColor(color, true);
                            },
                            scope: me
                        }
                    }
                }]
            },
            {
                xtype: 'fieldset',
                height: 125,
                width: 262,
                title: 'Personalizado',
                items: [
                {
                    xtype: 'slider',
                    id: 'red_slider',
                    value: 0,
                    fieldLabel: 'Rojo',
                    labelWidth: 45,
                    maxValue: 255,
                    anchor: '100%',
                    listeners: {
                        change: {
                            fn: function(slider, newValue, thumb, options){
                                this._value_r = newValue;
                                this.setSampleColor(this.getRGB(), false);
                            },
                            scope: me
                        }
                    }
                },
                {
                    xtype: 'slider',
                    id: 'green_slider',
                    value: 0,
                    fieldLabel: 'Verde',
                    labelWidth: 45,
                    maxValue: 255,
                    anchor: '100%',
                    listeners: {
                        change: {
                            fn: function(slider, newValue, thumb, options){
                                this._value_g = newValue;
                                this.setSampleColor(this.getRGB(), false);
                            },
                            scope: me
                        }
                    }
                },
                {
                    xtype: 'slider',
                    id: 'blue_slider',
                    value: 0,
                    fieldLabel: 'Azul',
                    labelWidth: 45,
                    maxValue: 255,
                    anchor: '100%',
                    listeners: {
                        change: {
                            fn: function(slider, newValue, thumb, options){
                                this._value_b = newValue;
                                this.setSampleColor(this.getRGB(), false);
                            },
                            scope: me
                        }
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    height: 25,
                    width: 400,
                    layout: {
                        type: 'column'
                    },
                    fieldLabel: 'Color',
                    labelWidth: 45,
                    items: [
                        {
                            xtype : 'draw',
                            viewBox: false,
                            width : 24,
                            height : 24,
                            items : [
                                this.sample_color
                            ]
                        }
                    ]
                }]
            }],
            buttons : [
                {
                    text: 'OK',
                    scope: this,
                    handler: this.fireImageColor
                },{
                    text: 'Cancel',
                    scope: this,
                    handler: function() {
                        this.close();
                    }
                }
            ]
        });

        me.callParent(arguments);
        
        me.addEvents('selected');
    },
    
    fireImageColor: function() {
        this.fireEvent('selected', this.getRGB());
        this.close();
    },

    sample_color : Ext.create('Ext.draw.Sprite',{
        type: 'rect',
        fill: 'black',
        width : 24,
        height : 24,
        x: 0,
        y: 0,
        stroke : 'black',
        "stroke-width" : 1
    }),
    
    // RGB color values
    _value_r : 0,
    _value_g : 0,
    _value_b : 0,
    
    _hex : ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'],
    
    // Update the sliders
    updateSliders : function(color)
    {
        var _r = '0x' + color.substr(0,2);
        var _g = '0x' + color.substr(2,2);
        var _b = '0x' + color.substr(4,2);

        eval('_r = ' + _r + ';');
        eval('_g = ' + _g + ';');
        eval('_b = ' + _b + ';');

        Ext.getCmp('red_slider').setValue(_r,true);
        Ext.getCmp('green_slider').setValue(_g,true);
        Ext.getCmp('blue_slider').setValue(_b,true);
    },
    
    //Function to get the RGB value of the R, G and B values inside the object
    getRGB : function ()
    {
        var text = "", val = "";

        val = this._value_r >> 4;
        text += this._hex[val];
        val = this._value_r & 15;
        text += this._hex[val];

        val = this._value_g >> 4;
        text += this._hex[val];
        val = this._value_g & 15;
        text += this._hex[val];

        val = this._value_b >> 4;
        text += this._hex[val];
        val = this._value_b & 15;
        text += this._hex[val];

        return text;
    },
    
    setSampleColor : function(color, updateSliders)
    {
        this.sample_color.setAttributes({
            fill : "#"+color
        }, true);
        
        this.color = color;
        if(updateSliders)
            this.updateSliders(color);
    }

});