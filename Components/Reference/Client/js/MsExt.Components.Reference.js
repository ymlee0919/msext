Ext.define('MsExt.components.Reference', {
    extend: 'Ext.panel.Panel',
    region : 'south',
    height: 195,
    width: 270,
    frame:true,
    id: 'msext_reference_id',
    layout : { type : 'fit'},
    collapsible: true,
    title: 'Reference',
    padding : 3,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items : [{
                html: '<div id="reference_image" style="width:100%; height:100%; z-index:3"></div>'
            }],
            dockedItems: [
            {
                xtype: 'toolbar',
                width: 27,
                dock: 'left',
                items: [
                    {
                        xtype: 'button',
                        width: 18,
                        text: '+',
                        iconCls : 'ref_up',
                        overCls : '',
                        handler : Ext.Function.bind(this.onClickScaleUpDown,this,[10])
                    },
                    {
                        xtype: 'slider',
                        id : 'custom-slider',
                        padding : '0 0 0 3',
                        width: 25,
                        height: 110,
                        value: 0,
                        minValue : 0,
                        maxValue : 100,
                        vertical: true,
                        listeners : {
                            changecomplete : Ext.Function.bind(this.onSliderChange, this)
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls : 'ref_down',
                        width: 18,
                        overCls : '',
                        handler : Ext.Function.bind(this.onClickScaleUpDown,this,[-10])
                    }
                ]
            }
            ]
        });

        me.callParent(arguments);
    },
    
    ref_component : new MsExt.MapComponent('reference_image'),
    
    _max_scale : 0,
    
    _scale : 0,
    
    initMapComponent : function()
    {
        this._reference_menu = {
            text:'Configurar referencia', 
            id: '_reference_menu_id', 
            iconCls: 'reference', 
            handler: Ext.Function.bind(this.onConfigReference, this)
        };

        MsExt.App.Interface.addMenu('Ver',this._reference_menu);
    },
    
    onConfigReference : function()
    {
        var _config_win = Ext.create('Ext.window.Window',{
            height: 380,
            width: 336,
            bodyPadding: 0,
            modal : true,
            closable: false,
            animateTarget : 'msext_reference_id',
            collapsible: true,
            resizable : false,
            layout : 'fit',
            title: 'Configurar referencia',
            items: [
                {
                    xtype: 'form',
                    layout : 'anchor',
                    frame: true,
                    bodyBorder: false,
                    bodyPadding: 0,
                    items: [
                    {
                        xtype: 'radiogroup',
                        id : 'refresh_radiogroup',
                        height: 67,
                        width: 315,
                        autoScroll: false,
                        activeItem: 0,
                        layout: {
                            type: 'anchor'
                        },
                        fieldLabel: 'Actualizaci&oacute;n',
                        columns: 3,
                        vertical: true,
                        items: [
                            {
                                xtype: 'radiofield',
                                name: 'ref_update_type',
                                id : 'ref_update_type_auto',
                                value: 'auto',
                                boxLabel: 'Autom&aacute;tica',
                                listeners: { change: function(){ Ext.getCmp('accept_reference').enable(); } }
                            },
                            {
                                xtype: 'radiofield',
                                name: 'ref_update_type',
                                value: 'personal',
                                id : 'ref_update_type_manual',
                                boxLabel: 'Personalizada',
                                listeners: {
                                    change: function(field, oldValue, newValue, opts)
                                    {
                                        if(!newValue)
                                        {
                                            Ext.getCmp('reference_layers_grid').enable();
                                            
                                            if(Ext.getCmp('reference_layers_grid').getSelectionModel().getCount() > 0)
                                                Ext.getCmp('accept_reference').enable();
                                            else
                                                Ext.getCmp('accept_reference').disable();
                                        }
                                        else Ext.getCmp('reference_layers_grid').disable();
                                    }
                                }
                            },
                            {
                                xtype: 'radiofield',
                                name: 'ref_update_type',
                                value: 'disabled',
                                id : 'ref_update_type_disabled',
                                boxLabel: 'Deshabilitada',
                                listeners: { change: function(){ Ext.getCmp('accept_reference').enable(); } }
                            }
                        ]
                    },{
                        xtype : 'label',
                        html : '<br>'
                    },
                    {
                        xtype: 'fieldset',
                        height: 225,
                        padding: 5,
                        width: 314,
                        layout: {type: 'fit'},
                        items: [
                            {
                                xtype: 'gridpanel',
                                disabled: true,
                                height: 210,
                                id : 'reference_layers_grid',
                                title: 'Capas visualizables',
                                store : new Ext.data.ArrayStore({
                                    fields : ['layer'],
                                    data : MsExt.App.Registry.getRegisteredValue('Layers')
                                }),
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'layer',
                                        flex: 1,
                                        text: 'Nombre'
                                    }
                                ],
                                selModel: Ext.create('Ext.selection.CheckboxModel', {
                                    listeners: {
                                        selectionchange: function(model, selected, options) {
                                            if(selected.length > 0) Ext.getCmp('accept_reference').enable();
                                            else Ext.getCmp('accept_reference').disable();
                                        }
                                    }
                                })
                            }
                        ]
                    }] 
                }
            ],
            buttonAlign : 'center',
            buttons:[
                {
                    id: 'accept_reference',
                    text: 'Aceptar',
                    scope : this,
                    disabled : true,
                    handler : function()
                    {
                        this.changeRefreshWay();
                        _config_win.close();
                    }
                },
                {
                    text: 'Cerrar',
                    handler: function()
                    {
                        MsExt.App.PluginsManager.releaseCurrentPlugin();
                        _config_win.close();
                    }
                }]
        }).show();
        
        var _ref_config = MsExt.App.Registry.getRegisteredValue('Reference');
        if(_ref_config != null)
        {
            Ext.getCmp('ref_update_type_' + _ref_config.way).setValue(true);
            if(_ref_config.way == 'manual')
            {
                var _grid = Ext.getCmp('reference_layers_grid'), 
                    _store = _grid.getStore(),
                    _sm = _grid.getSelectionModel();
                    
                _grid.enable();
                for(var i = 0; i < _ref_config.layers.length; i++)
                    _sm.select(_store.find('layer', _ref_config.layers[i], 0, false, true, true), true);
            }
            Ext.getCmp('accept_reference').disable();
        }
    },

    onLoadMap : function(obj)
    {
        this.ref_component.Init();
        this.ref_component.SetBackImage(obj.image, obj.extent);
        this.setMaxMapScale(obj.scale);
        
        this.ref_component.OnNewRectangle({
            listeners : {
                endDrawing : function(MinX, MinY, MaxX, MaxY)
                {
                    MsExt.App.PluginsManager.activatePlugin('Components.Reference');
                    // Zoom to a point
                    if(MinX == MaxX && MinY == MaxY)
                    {
                        MsExt.App.ServerRequest.PerformMapDrawing('Reference.Reference.ZoomPoint',
                        {
                            mapa_x : MinX,
                            mapa_y : MinY
                        });
                    }
                    // Zoom to a rectangle
                    else
                        MsExt.App.ServerRequest.PerformMapDrawing('Reference.Reference.ZoomRect',
                        {
                            rect_zoom: MinX + " " + MinY  + " " +  MaxX  + " " +  MaxY
                        });

                    MsExt.App.PluginsManager.releaseCurrentPlugin();
                }
            }, scope : this
        });
    },

    updateComponent : function(obj)
    {
        this.ref_component.SwapBackImage(obj.image)
        this.ref_component.SetExtent(obj.extent);
        this.updateSlider(obj.scale);
    },
    
    changeRefreshWay : function()
    {
        var _layers = [], way = '', refParams = {};
        
        if(Ext.getCmp('ref_update_type_auto').getValue())
        {
            this.show();
            Ext.getCmp('msext_layer_control_id').doLayout();
            way = 'auto';
        }
        if(Ext.getCmp('ref_update_type_manual').getValue())
        {
            this.show();
            Ext.getCmp('msext_layer_control_id').doLayout();
            way = 'manual';
        }
        if(Ext.getCmp('ref_update_type_disabled').getValue())
        {
            this.hide();
            Ext.getCmp('msext_layer_control_id').doLayout();
            way = 'disabled';
        }
        
        var _selection = Ext.getCmp('reference_layers_grid').getSelectionModel().getSelection();
        for(var i = 0; i < _selection.length; i++)
            _layers.push(_selection[i].data.layer);
        
        refParams.way = way;
        refParams.layers = _layers;
        
        MsExt.App.Registry.registerValue('Reference', refParams);
        
        
        var fn = function(ObjRespone){this.updateComponent(ObjRespone);}

        MsExt.App.ServerRequest.PerformMapRequest('Reference.Reference.ChangeRefreshWay',
        {
            layers : Ext.encode(_layers),
            way : way
        }, Ext.Function.bind(fn,this));
        MsExt.App.PluginsManager.releaseCurrentPlugin();
    },
    
    onSliderChange : function(Slider, Value)
    {
        var _percent = (Value == 0) ? 105 : 100 - Value

        MsExt.App.PluginsManager.activatePlugin('Components.Reference');
        MsExt.App.ServerRequest.PerformMapDrawing('Reference.Reference.ChangeScale',
            {percent : _percent});
        MsExt.App.PluginsManager.releaseCurrentPlugin();
    },

    onClickScaleUpDown : function(step)
    {
        var Value = Ext.getCmp("custom-slider").getValue() + step;

        MsExt.App.PluginsManager.activatePlugin('Components.Reference');
        MsExt.App.ServerRequest.PerformMapDrawing('Reference.Reference.ChangeScale',
            {percent : 100 - Value});
        MsExt.App.PluginsManager.releaseCurrentPlugin();
    },
    
    updateSlider : function(Scale)
    {
        this._scale = Scale;
        Ext.getCmp("custom-slider").setValue(100 -  (parseInt(Scale) / this._max_scale) * 100 );
    },
    
    setMaxMapScale : function(MapScale)
    {
        this._max_scale = parseInt(MapScale);
    }
});