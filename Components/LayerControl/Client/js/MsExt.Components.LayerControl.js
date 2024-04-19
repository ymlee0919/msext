Ext.define('MsExt.components.LayerControl', {
    extend: 'Ext.tree.Panel',
    region: 'center',
    id : 'msext_layer_control_id',
    bodyBorder: false,
    titleCollapse: false,
    enableColumnHide: false,
    enableColumnMove: false,
    enableColumnResize: false,
    forceFit: true,
    lines: false,
    singleExpand: false,
    useArrows: true,
    animate	: true,
    displayField : 'text',
    root : {
        text : 'Capas',
        leaf : false,
        id : '_ROOT_NODE'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            viewConfig: {
            },
            listeners: {
                'itemcontextmenu' : Ext.bind(me.eventsManager.onRightClick,me.eventsManager),
                'click' : Ext.bind(me.eventsManager.onClick,me.eventsManager)
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    id : 'layer_control_tbar',
                    height : 28,
                    dock: 'top',
                    items : [
                        {
                            tooltip: 'Expandir todas',
                            iconCls: 'icon-expand-all',
                            handler : me.expandAll,
                            scope : me
                        },{
                            tooltip: 'Colapsar todas',
                            iconCls: 'icon-collapse-all',
                            handler : me.collapseAll,
                            scope : me
                        },'-'
                    ]
                },
                {
                    xtype: 'toolbar',
                    id : 'layer_control_bbar',
                    height : 28,
                    dock: 'bottom'
                }
            ]
        });

        me.callParent(arguments);
    },

    // ----------------------------------------------------------------------------
    // OWN PERFORMANCE
    // ----------------------------------------------------------------------------
    // Root menu
    _root_popup : null,

    initRootPopup : function()
    {
        this._root_popup = new Ext.menu.Menu(
        {
            id: '_root_popup_menu',
            style: {
                overflow: 'visible'     // For the Combo popup
            },
            items: [
                {
                    text: 'Ordenar capas',
                    iconCls: 'legend_sort',
                    id : 'legend_sort_menu_id',
                    handler : function(){Ext.create('MsExt.controllers.LayerOrderController').show();}
                }
            ]
        });
    },

    // ----------------------------------------------------------------------------
    // EVENTS MANAGER OBJECT
    eventsManager : {
        // Stack of functions to call when a node is clicked
        onClickStack : [],

        // Stack of functions to call when a node is clicked with the right button of the mouse
        onRightClickStack : [],

        //-------------------------------------------------------------------
        AddOnClick : function(Function, Scope)
        {
            this.onClickStack.push(Ext.bind(Function,Scope));
        },
        //-------------------------------------------------------------------
        AddOnRightClick : function(Function, Scope)
        {
            this.onRightClickStack.push(Ext.bind(Function,Scope));
        },
        //-------------------------------------------------------------------
        onClick : function(node, eventObject)
        {
            for(var i = 0; i < this.onClickStack.length; i++)
                this.onClickStack[i](node, eventObject);
        },
        //-------------------------------------------------------------------
        onRightClick : function(component, node, item, index, eventObject, eOpts )
        {
            eventObject.stopEvent();
            for(var i = 0; i < this.onRightClickStack.length; i++)
                this.onRightClickStack[i](node, eventObject);
            return false;
        }
    },

    //----------------------------------------------------------------------
    // External functions of the layer control
    //----------------------------------------------------------------------
    On : function(EventName, Function, Scope)
    {
        var _event_name = EventName.toLowerCase();
        switch (_event_name)
        {
            case 'clic':
            case 'clik':
            case 'click':
                this.eventsManager.AddOnClick(Function, Scope);
                break;
            case 'rightclick':
            case 'rightclik':
            case 'rightclic':
            case 'right click':
            case 'right clik':
            case 'right clic':
                this.eventsManager.AddOnRightClick(Function, Scope);
                break;
        }
    },


    initMapComponent: function(){
        //this.getView().on('itemcontextmenu', Ext.bind(this.eventsManager.onRightClick,this.eventsManager));
        // Init popups
        this.initRootPopup();

        var nodeClick = function(node, eventObject)
        {
//            this._current_node = node;
//            switch (MsExt.TypeOf(node))
//            {
//                case MsExt.LAYER :
//                    Ext.getCmp('selected_layer').setValue(node.attributes.text);
//                    Ext.getCmp('layer_select').setText(node.attributes.text);
//                    this.ActivateLayerMenu();
//                    break;
//                default :
//                    this.DesactivateLayerMenu();
//                    break;
//            }
        };

        var nodeRightClick = function(node, eventObject)
        {
            switch (MsExt.TypeOf(node))
            {
                case MsExt.ROOT :
                    //this._layer_control.selectPath('/LROOT_NODE');
                    this._root_popup.showAt(eventObject.getXY())
                    break;
                case MsExt.LAYER :
//                    Ext.getCmp('selected_layer').setValue(node.attributes.text);
//                    Ext.getCmp('layer_select').setText(node.attributes.text);
//                    this.current_path = node.getPath('text');
//                    this._layer_popup.showAt(eventObject.getXY())
                    break;
                case MsExt.GROUP :
//                    Ext.getCmp('selected_layer').setValue(node.attributes.text);
//                    Ext.getCmp('layer_select').setText(node.attributes.text);
//                    this.current_path = node.getPath('text');
//                    this._group_popup.showAt(eventObject.getXY())
                    break;
                case MsExt.CLASS :
//                    Ext.getCmp('selected_layer').setValue(node.attributes.text);
//                    Ext.getCmp('layer_select').setText(node.attributes.text);
//                    this.current_path = node.getPath('text');
//                    this._class_popup.showAt(eventObject.getXY())
                    break;
            }
        };

        this.On('rightclick', nodeRightClick, this);
    },

    onLoadMap : function(obj){
        this.updateComponent(obj);
        var _layers = [];
        for(var i = 0; i < obj.length; i++)
            if(obj[i].id.substr(0, 5) == MsExt.LAYER)
                _layers.push([obj[i].text]);

        MsExt.App.Registry.registerValue('Layers', _layers);
    },

    updateComponent : function(obj)
    {
        var me = this, root = me.getRootNode();
        root.removeAll(true);
        root.appendChild(obj);
        me.doLayout();
    }
});