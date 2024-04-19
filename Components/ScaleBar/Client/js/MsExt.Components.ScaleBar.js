Ext.define('MsExt.components.ScaleBar',{
    id : 'msext_scalebar_id',
    
    _scaleBar_color : '000000',

    _scaleBar_border : '000000',

    _map_width : 0,

    _map_height : 0,
    
    initMapComponent : function()
    {
        this._scaleBar_menu = 
        {
            text:'Configurar barra de escala',
            id: '_scaleBar_menu_id',
            iconCls: 'btn_change_scaleBar',
            handler: Ext.Function.bind(this.showWindowScaleBar, this)
        };

        MsExt.App.Interface.addMenu('Ver',this._scaleBar_menu);
    },

    onLoadMap : function(obj)
    {
        var _features = {
            position : obj.position,
            units : obj.units,
            intervals : obj.intervals,
            color : obj.color,
            outlinecolor : obj.outlinecolor,
            width : obj.width,
            height : obj.height
        };
        
        this._scaleBar_color = obj.color;
        this._scaleBar_border = obj.outlinecolor;
        
        MsExt.App.Registry.registerValue('ScaleBar', _features);
        document.getElementById('scalebar').style.visibility = 'visible';
        this.updateComponent(obj);
    },
    
    updateComponent : function(obj)
    {
        document.getElementById('scalebar').src = obj.image;
        document.getElementById('scalebar').width = obj.img_width;
        document.getElementById('scalebar').height = obj.img_heigth;
        
        var _w = Ext.get('map_container').getWidth(true);
        var _h = Ext.get('map_container').getHeight(true);
        this.onResizeMap(_w, _h);
    },
    
    showOrHide : function()
    {
        if(document.getElementById('scalebar').style.visibility == 'hidden')
            this.show();
        else
            this.hide();
    },

    hide : function()
    {
        document.getElementById('scalebar').style.visibility = 'hidden';

        Ext.getCmp('view_scalebar').setIconCls('scalebar_off');
        Ext.getCmp('view_scalebar').setTooltip('Mostrar barra de escala');
        //Ext.getCmp('scale_menu_tools').setIconCls('scalebar_off');
        Ext.getCmp('view_scalebar').toggle(false);
    },

    show : function()
    {
        document.getElementById('scalebar').style.visibility = 'visible';

        Ext.getCmp('view_scalebar').setTooltip('Ocultar barra de escala');
        Ext.getCmp('view_scalebar').setIconCls('scalebar_on');
        //Ext.getCmp('scale_menu_tools').setIconCls('scalebar_on');
        Ext.getCmp('view_scalebar').toggle(true);		
    },

    onResizeMap : function(MapWidth, MapHeight)
    {
        this._map_width = MapWidth;
        this._map_height = MapHeight;
        this.locate();
    },

    locate : function()
    {
        var position = MsExt.App.Registry.getRegisteredValue('ScaleBar').position;
        
        var _sb_width = Ext.get('scalebar').getWidth(true);
        var _sb_height = Ext.get('scalebar').getHeight(true);

        var y = (position[3] == 'U') ? 10 : this._map_height - (_sb_height + 10);
        var x = 0;

        switch (position[4])
        {
            case 'L':
                x = 10;
                break;
            case 'R':
                x = this._map_width - (_sb_width + 10);
                break;
            case 'C':
                x = (this._map_width / 2) - (_sb_width / 2);
                break;
        }

        document.getElementById('scalebar').style.left = x;
        document.getElementById('scalebar').style.top = y;
        document.getElementById('scalebar').style.position = 'absolute';
        
    },

    updateScaleBarColor : function(_color)
    {
        document.getElementById('color_muestra_scaleBar').style.background = '#' + _color;
        MsExt.Components.ScaleBar._scaleBar_color = _color;
    },

    updateScaleBarBorder : function(_color)
    {
        document.getElementById('border_muestra_scaleBar').style.background = '#' + _color;
        MsExt.Components.ScaleBar._scaleBar_border = _color;
    },

    //----------------------------------------------------------------------
    // Stores
    //----------------------------------------------------------------------
    _scaleBar_units : new Ext.data.ArrayStore({
        fields: ['id_unit', 'unit'],
        data: [
        ['MS_FEET', 'Pies'],
        ['MS_INCHES', 'Pulgadas'],
        ['MS_KILOMETERS', 'Kilometros'],
        ['MS_METERS', 'Metros'],
        ['MS_MILES', 'Millas']
        ]
    }),

    _scaleBar_position : new Ext.data.ArrayStore({
        fields: ['id_position', 'position'],
        data: [
        ['MS_UL', 'Superior Izquierda'],
        ['MS_UR', 'Superior Derecha'],
        ['MS_UC', 'Superior Centro'],
        ['MS_LL', 'Inferior Izquierda '],
        ['MS_LR', 'Inferior Derecha'],
        ['MS_LC', 'Inferior Centro']
        ]
    }),
    //----------------------------------------------------------------------

    showWindowScaleBar : function(_source, _layer_name)
    {
        var _features = MsExt.App.Registry.getRegisteredValue('ScaleBar');
        
        var _scaleBar_win = Ext.create('Ext.window.Window',{
            height: 306,
            width: 274,
            layout: {type: 'fit'},
            title: 'Barra de escala',
            animateTarget : 'scalebar',
            iconCls : 'btn_change_scaleBar',
            modal : true,
            resizable : true,
            closable : false,
            items: [{
                xtype: 'form',
                frame: true,
                id : 'scalebar_configwin_id',
                layout: {type: 'form'},
                bodyPadding: 5,
                items: [
                {
                    xtype: 'combobox',
                    width: 220,
                    name: 'position',
                    store : this._scaleBar_position,
                    value : _features.position,
                    fieldLabel: 'Posici&oacute;n',
                    labelWidth: 80,
                    allowBlank: false,
                    blankText: 'Este campo es requerido',
                    emptyText: '- Seleccione -',
                    editable: false,
                    displayField: 'position',
                    forceSelection: true,
                    queryMode: 'local',
                    valueField: 'id_position'
                },
                {
                    xtype: 'combobox',
                    width: 220,
                    name: 'units',
                    store : this._scaleBar_units,
                    value : _features.units,
                    fieldLabel: 'Unidades',
                    labelWidth: 80,
                    allowBlank: false,
                    blankText: 'Este campo es requerido',
                    emptyText: '- Seleccione -',
                    editable: false,
                    displayField: 'unit',
                    forceSelection: true,
                    queryMode: 'local',
                    valueField: 'id_unit'
                },
                {
                    xtype: 'combobox',
                    width: 160,
                    name: 'intervals',
                    fieldLabel: 'Intervalos',
                    labelWidth: 80,
                    allowBlank: false,
                    blankText: 'Este campo es requerido',
                    editable: false,
                    displayField: 'interval',
                    forceSelection: true,
                    value : _features.intervals,
                    queryMode: 'local',
                    store: Ext.create('Ext.data.ArrayStore',{
                        fields: [{name: 'interval'}],
                         data: [[2],[3],[4],[5],[6],[7],[8],[9],[10]]
                    }),
                    valueField: 'interval'
                },
                {
                    xtype: 'checkboxfield',
                    name: 'transparent',
                    fieldLabel: 'Transparente',
                    checked : (_features.transparent == 'on'),
                    labelWidth: 80
                },
                /*{
                    xtype: 'label',
                    html: '<br>'
                },*/
                {
                    xtype: 'fieldcontainer',
                    height: 22,
                    width: 400,
                    layout: {type: 'column'},
                    fieldLabel: 'Color',
                    labelWidth: 80,
                    items: [
                    {
                        xtype: 'label',
                        height: 22,
                        id : 'scalebar_color',
                        html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                        style: {
                            background: '#' + _features.color
                        }
                    },
                    {
                        xtype: 'button',
                        scope : this,
                        handler: function(button, event) {
                            Ext.create('MsExt.common.ColorPalette',{
                                listeners : {
                                    selected : function(color)
                                    {
                                        document.getElementById('scalebar_color').style.background = '#' + color;
                                        this._scaleBar_color = color;
                                    },
                                    afterrender : function(component, options)
                                    {
                                        component.setSampleColor(this._scaleBar_color, true);
                                    },
                                    scope : this
                                }
                            }).show();
                        },
                        text: '. . .'
                    }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    height: 22,
                    width: 400,
                    layout: {
                        type: 'column'
                    },
                    fieldLabel: 'Borde',
                    labelWidth: 80,
                    items: [
                    {
                        xtype: 'label',
                        height: 22,
                        id : 'scalebar_bordercolor',
                        html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                        style: {
                            background: '#' + _features.outlinecolor
                        }
                    },
                    {
                        xtype: 'button',
                        scope : this,
                        handler: function(button, event) {
                            Ext.create('MsExt.common.ColorPalette',{
                                listeners : {
                                    selected : function(color)
                                    {
                                        document.getElementById('scalebar_bordercolor').style.background = '#' + color;
                                        this._scaleBar_border = color;
                                    },
                                    afterrender : function(component, options)
                                    {
                                        component.setSampleColor(this._scaleBar_border, true);
                                    },
                                    scope : this
                                }
                            }).show();
                        },
                        text: '. . .'
                    }
                    ]
                },
                {
                    xtype: 'fieldset',
                    height: 71,
                    width: 243,
                    title: 'Tama&ntilde;o (P%iacute;xeles)',
                    items: [
                    {
                        xtype: 'fieldcontainer',
                        height: 50,
                        layout: {type: 'column'},
                        items: [
                        {
                            xtype: 'textfield',
                            width: 100,
                            name: 'width',
                            value : _features.width,
                            fieldLabel: 'Largo',
                            labelAlign: 'top',
                            labelWidth: 80,
                            columnWidth: 0.4
                        },
                        {
                            xtype: 'label',
                            html: '<br>',
                            columnWidth: 0.2
                        },
                        {
                            xtype: 'textfield',
                            width: 50,
                            name: 'height',
                            value : _features.height,
                            fieldLabel: 'Altura',
                            labelAlign: 'top',
                            labelWidth: 80,
                            columnWidth: 0.4
                        }
                        ]
                    }
                    ]
                }
                ]
            }
            ],
            buttons : [
                {
                    text: 'Aplicar',
                    scope : this,
                    handler: function()
                    {
                        var form = Ext.getCmp('scalebar_configwin_id').getForm(), values = null;
                        if(form.isValid())
                        {
                            values = form.getValues();
                            values.color = this._scaleBar_color;
                            values.outlinecolor = this._scaleBar_border;
                            
                            this.changeScaleBar(values);
                            _scaleBar_win.close();
                        }
                    }
                },{
                    text: 'Cancel',
                    handler: function() {
                        _scaleBar_win.close();
                    }
                }
            ]
        }).show();
    },

    //----------------------------------------------------------------------

    changeScaleBar : function(params)
    {
        var me = this;
        var fn = function(ObjResponse)
        {
            me.updateComponent(ObjResponse);

            document.getElementById('scalebar').width = ObjResponse.width;
            document.getElementById('scalebar').height = ObjResponse.height;

            MsExt.App.Registry.registerValue('ScaleBar', params);
            me.locate();
        }

        MsExt.App.ServerRequest.PerformMapRequest('ScaleBar.ScaleBar.Change', params, fn);
    }
})