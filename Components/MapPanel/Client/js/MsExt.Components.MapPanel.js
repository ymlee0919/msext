Ext.define('MsExt.components.MapPanel', {
    extend: 'Ext.panel.Panel',
    // Panel description
    frame: true,
    id: 'msext_map_panel_id',
    title: 'Mapa',
    region: 'center',
    layout : { type : 'fit'},
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items : [{
                html : '<img id="scalebar" style="visibility: hidden"/><div id="map_container" style="width:100%; height:100%; z-index:3"></div>'
            }],
            dockedItems: [{
                xtype: 'toolbar',
                height: 28,
                id: 'map_panel_tbar_id',
                dock: 'top',
                items : [{
                    xtype	: 'button',
                    iconCls	: 'back',
                    id		: 'back',
                    scale	: 'small',
                    tooltip	: 'Zoom anterior',
                    disabled: true,
                    handler: me.onPrevView,
                    scope: me
                },' ',{
                    xtype	: 'button',
                    iconCls	: 'next',
                    id		: 'next',
                    scale	: 'small',
                    tooltip	: 'Zoom posterior',
                    disabled: true,
                    handler: me.onNextView,
                    scope: me
                },' ', '-',' ',{
                    xtype	: 'button',
                    id		: 'zoom-in',
                    iconCls	: 'zoom_in',
                    scale	: 'small',
                    tooltip	: 'Zoom m&aacute;s',
                    enableToggle: true,
                    handler     : me.onZoomIn,
                    scope: me
                },' ',{
                    xtype	: 'button',
                    id		: 'zoom-out',
                    iconCls	: 'zoom_out',
                    scale	: 'small',
                    tooltip	: 'Zoom menos',
                    enableToggle: true,
                    handler : me.onZoomOut,
                    scope: me
                },' ',{
                    xtype	: 'button',
                    id		: 'zoom-acercar',
                    iconCls	: 'zoom_acercar',
                    scale	: 'small',
                    tooltip	: 'Zoom Acercar',					
                    enableToggle: false,
                    handler     : Ext.Function.bind(me.onZoom, me,['acercar'])
                },' ',{
                    xtype	: 'button',
                    id		: 'zoom-alejar',
                    iconCls	: 'zoom_alejar',
                    scale	: 'small',
                    tooltip	: 'Zoom Alejar',
                    enableToggle: false,
                    handler     : Ext.Function.bind(me.onZoom, me,['alejar'])
                },' ',{
                    xtype	: 'button',
                    id		: 'pan',
                    iconCls	: 'pan',
                    scale	: 'small',
                    tooltip	: 'Desplazamiento',					
                    enableToggle: true,
                    handler     : me.onPan,
                    scope: me
                },' ',{
                    xtype	: 'button',
                    id		: 'full-ext',
                    iconCls	: 'full_ext',
                    scale	: 'small',
                    tooltip	: 'Zoom completo',
                    handler     : me.onFullExt,
                    scope: me
                },'-',{
                    xtype	: 'button',
                    iconCls	: 'distance',
                    id		: 'distance',
                    scale	: 'small',
                    tooltip	: 'Medir distancia'
                },' ',{
                    xtype	: 'button',
                    iconCls	: 'surface',
                    id		: 'area',
                    scale	: 'small',
                    tooltip	: 'Medir &aacute;rea'
                },'-',{
                    xtype	: 'button',
                    iconCls	: 'scalebar_on',
                    id		: 'view_scalebar',
                    scale	: 'small',
                    tooltip	: '(Mostrar/Ocultar) barra de escala',
                    enableToggle: true,
                    pressed	: true,
                    handler     : function()
                    {
                        MsExt.Components.ScaleBar.showOrHide();
                    }
                },'->',{
                    xtype : 'tbtext',
                    text: '<b>Escala: 1 /</b>'
                },{
                    xtype : 'combo',
                    store : me._store_scale,
                    id :'scale',
                    emptyText :'- Seleccione -',
                    editable :true,
                    forceSelection : false,
                    displayField :'scale',
                    valueField :'id_scale',
                    triggerAction : 'all',
                    mode :'local',
                    name : 'scale',
                    maskRe : /^[0-9]$/,
                    regex : /^[1-9][0-9]+$/,
                    listeners : {
                        select : Ext.Function.bind(me.onScaleSelection, this),
                        specialkey: function(field, e)
                        {
                            if (e.getKey() == e.ENTER && field.getRawValue() != '')
                                me.onScaleSelection();
                        }
                    }
                }]
            },{
                xtype: 'toolbar',
                id: 'map_panel_status_bar_id',
                height: 28,
                dock: 'bottom',
                items : [{
                    xtype : 'tbtext',
                    text: '<b>Coordenadas:</b>&nbsp; &nbsp;<b>X:</b>&nbsp;'
                },{
                    xtype : 'tbtext',
                    id : 'x_coord',
                    name: 'x_coord',
                    text: '#',
                    readOnly: true,
                    width: 120
                },{
                    xtype : 'tbspacer', 
                    width : 10
                },{
                    xtype : 'tbtext',
                    text: '<b>Y:</b>&nbsp;'
                },{
                    xtype : 'tbtext',
                    id : 'y_coord',
                    name: 'y_coord',
                    text: '#',
                    readOnly: true,
                    width: 120
                },' ',{
                    xtype : 'tbtext',
                    text: '<b>Capa:</b>'
                },{
                    xtype : 'tbtext',
                    id : 'layer_select',
                    name: 'layer_select',
                    text: 'Ninguna',
                    readOnly: true,
                    width: 120
                }]
            }]
        });
        me.callParent(arguments);
    },
    
    // MapPanel fields
    map_component : new MsExt.MapComponent('map_container'),
    
    __zoom_ext : false,

    // Object to manage the history of views
    stackHistory : {
        _size : 15,
        _cant : 0,
        _current : -1,
        _exts : [],

        //----------------------------------------------------------------------
        // Enable components for back action
        enableBack : function()
        {
            Ext.getCmp('back').enable();
            Ext.getCmp('menu_back').enable();
        },

        //----------------------------------------------------------------------
        // Enable components for next action
        enableNext : function()
        {
            Ext.getCmp('next').enable();
            Ext.getCmp('menu_next').enable();
        },

        //----------------------------------------------------------------------
        // Disable components for back action
        disableBack : function()
        {
            Ext.getCmp('back').disable();
            Ext.getCmp('menu_back').disable();
        },

        //----------------------------------------------------------------------
        // Disable components for next action
        disableNext : function()
        {
            Ext.getCmp('next').disable();
            Ext.getCmp('menu_next').disable();
        },

        //----------------------------------------------------------------------
        // Add a new map extent to the stack
        add : function(extent)
        {
            if(this._cant == this._size)
                this._exts.shift();
            else
                this._exts.slice(this._current++);

            this._exts[this._current] = extent;
            this._cant = this._current + 1;

            this.disableNext();
            if(this._cant > 1)
                this.enableBack();
        },

        //----------------------------------------------------------------------
        // Return the preview extent
        back : function()
        {
            if(this._current)
                this._current--;

            this.enableNext();

            if(this._current)
                this.enableBack();
            else
                this.disableBack();

            return this._exts[this._current];
        },

        //----------------------------------------------------------------------
        // Return the next extent
        next : function()
        {
            if(this._current < this._cant - 1)
                this._current++;

            this.enableBack();
            if(this._current < this._cant - 1)
                this.enableNext();
            else
                this.disableNext();

            return this._exts[this._current];
        },

        clear : function()
        {
            this._cant = 0;
            this._current = -1;
            this._exts = null;
            this._exts = [];

            this.disableBack();
            this.disableNext();
        }
    },
    
    _map_tools : ['zoom-in','zoom-out','pan','full-ext','distance','area'],
	_flag : false,
    
    _store_scale : new Ext.data.ArrayStore(
    {
            fields: ['id_scale', 'scale'],
            data: [
                ['500', '500'],
                ['1000', '1000'],
                ['5000', '5000'],
                ['10000', '10000'],
                ['25000', '25000'],
                ['50000', '50000'],
                ['100000', '100000'],
                ['250000', '250000'],
                ['500000', '500000'],
                ['750000', '750000'],
                ['1500000', '1500000']
            ]
    }),
    
    // MapPanel functions
    initMapComponent : function()
    {
        var _nav_menu_item = [
            {text:'Zoom anterior', id: 'menu_back', iconCls: 'back', disabled: true, handler: this.onPrevView, scope: this},
            {text:'Zoom posterior', id: 'menu_next', iconCls: 'next', disabled: true, handler: this.onNextView, scope: this},
            {text:'Zoom m&aacute;s', iconCls: 'zoom_in', handler: this.onZoomIn, scope:this},
            {text:'Zoom menos', iconCls: 'zoom_out', handler: this.onZoomOut, scope:this},
            {text:'Acercar', iconCls: 'zoom_acercar', handler: function(){this.onZoom('acercar');}, scope: this},
            {text:'Alejar', iconCls: 'zoom_alejar', handler: function(){this.onZoom('alejar');}, scope:this},
            {text:'Desplazamiento', iconCls: 'pan', handler: this.onPan, scope:this},
            {text:'Zoom completo', iconCls: 'full_ext', handler: this.onFullExt, scope:this}	
        ];
        
        MsExt.App.Interface.addMenu('Navegacion',_nav_menu_item);
        
        this.on('resize',this.onResizeMap,this);
    },
    toggleButton : function(btn_id)
    {
        for(var i = 0; i <this._map_tools.length; i++)
            if(this._map_tools[i] == btn_id)
                Ext.getCmp(this._map_tools[i]).toggle(true);
            else
                Ext.getCmp(this._map_tools[i]).toggle(false);
    },
    unToggleButtons : function()
    {
        for(var i = 0; i <this._map_tools.length; i++)
            Ext.getCmp(this._map_tools[i]).toggle(false);
    },        
    onLoadMap : function(obj)
    {
        var ext = obj.extent, img = obj.image, scale = obj.scale, me = this;
        this.map_component.Init();
		
		Ext.get('map_container').on('mousewheel', function(e){
			if(!me._flag)
				me._flag = true;
			else
				return;
			if(e.getWheelDelta() > 0)
				me.onZoom('acercar');
			else 
				me.onZoom('alejar');
			
			me._flag = false;
		});
		
        this.map_component.SetBackImage(img, ext);
        
        Ext.getCmp('scale').setRawValue(scale);
        this.stackHistory.clear();
        this.stackHistory.add(ext);
    },
    updateComponent : function(obj)
    {
        this.map_component.Clean(true);
        this.map_component.Update(obj.image, obj.extent, obj.reference);
        Ext.getCmp('scale').setRawValue(obj.scale);
        if(!this.__zoom_ext)
            this.stackHistory.add(obj.extent);
    },
    getMapComponent : function()
    {
        return this.map_component;
    },
    // Buttons functions -------------------------------------------------------
    onPrevView : function()
    {
        this.__zoom_ext = true;
        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.ZoomRect',{rect_zoom: this.stackHistory.back()});
        MsExt.App.PluginsManager.releaseCurrentPlugin();
        this.__zoom_ext = false;
    },
    onNextView : function()
    {
        this.__zoom_ext = true;
        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.ZoomRect',{rect_zoom: this.stackHistory.next()});
        MsExt.App.PluginsManager.releaseCurrentPlugin();
        this.__zoom_ext = false;
    },
    onZoomIn : function()
    {
        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        this.toggleButton('zoom-in');
        this.map_component.OnNewRectangle({
            listeners : {
                endDrawing : function(MinX, MinY, MaxX, MaxY)
                {
                    // Zoom to a point
                    if(MinX == MaxX && MinY == MaxY)
                    {
                        var pix = this.map_component.geoToPix(MinX, MinY);
                        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.ZoomPoint',
                        {
                            mapa_x : pix.x,
                            mapa_y : pix.y,
                            factor : 2
                        });
                    }
                    // Zoom to a rectangle
                    else
                        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.ZoomRect',
                        {
                            rect_zoom: MinX + " " + MinY  + " " +  MaxX  + " " +  MaxY
                        });
                }
            }, scope : this
        });
    },
    onZoomOut : function()
    {
        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        this.toggleButton('zoom-out');
        this.map_component.OnNewPoint({
            listeners : {
                draw : function(X, Y)
                {
                    MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.ZoomPoint',
                    {
                        mapa_x : X,
                        mapa_y : Y,
                        factor : -1
                    });
                }
            }
        });
    },
    onPan : function()
    {
        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        this.toggleButton('pan');
        this.map_component.OnPan({
            listeners : {
                end : function(X, Y)
                {
                    MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.Pan',
                    {
                        mapa_x : X,
                        mapa_y : Y,
                        factor : -1
                    });
                }
            }
        });
    },
    onZoom : function(_opt)
    {
        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.Zoom',
            { opt : _opt});
    },
    onFullExt : function()
    {
        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.FullExt');
    },
    onScaleSelection : function()
    {
        var _scale = Ext.getCmp('scale').getRawValue();

        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.ChangeScale',
        {
            scale: _scale
        });
        MsExt.App.PluginsManager.releaseCurrentPlugin();
    },
    onResizeMap : function()
    {
        var _w = Ext.get('map_container').getWidth(true);
        var _h = Ext.get('map_container').getHeight(true);

        MsExt.App.PluginsManager.activatePlugin('Components.MapPanel');
        MsExt.App.ServerRequest.PerformMapDrawing('MapPanel.MapPanel.ResizeMap',
        {
            width : _w,
            height : _h
        });

        MsExt.App.PluginsManager.releaseCurrentPlugin();
    }
})