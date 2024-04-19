// Define a plugin
Ext.define('MsExt.Plugin',{
    // Fields
    isPlugAndPlay : true,
    config : {
        name : null
    },
    // Constructor
    constructor : function(Name){
        this.initConfig({
            name : Name
        })
    },
    // Functions
    init : function(){},
    enable : function(){},
    disable : function(){},
	show : function(){},
    hide : function(){},
    isVisible : function(){},
    getName : function(){},
    getId : function(){
        return 'Plugins.' + this.name;
    }
});

MsExt.App = {

    //-------------------------------------------------------------------------------
    // Plugins manager
    PluginsManager : {
        ////Fields of MsExt.App object
        // Name of the current item
        // The name always have the format as "[Components|Plugins].id"
        __current_item_id : null,
        // Last active item
        __last_active_item : null,
        // Store of plugins
        __store : [],
        // Function for register a plugin
        registerPlugin : function()
        {
            var args = arguments,
                _plugin_name = args[0],
                _plugin = args[1],
                _full_plugin_name = "MsExt.Plugin." + _plugin_name;

            // Check if exists
            if(Ext.isDefined(this.__store[_plugin_name])){
                console.log("The plugin " + _plugin_name.toString() + ' already exists');
                return;
            }

            // Extend a plugin
            _plugin.extend = 'MsExt.Plugin';
            // Define the plugin
            Ext.define(_full_plugin_name, _plugin);
            // Create the plugin and store
            this.__store[_plugin_name] = Ext.create(_full_plugin_name, _plugin_name);
        },
        // Function for init all plugins
        initPlugins : function()
        {
            var _plugin;
            for(_plugin in this.__store)
            {
                if( typeof(this.__store[_plugin]) != 'function')
                {
                    MsExt.App.PluginsManager.activatePlugin(this.__store[_plugin].getId());
                    this.__store[_plugin].init();
                }
            }
        },
        // Return the instance of a plugin by it name
        getInstanceOf : function()
        {
            var _plugin_name = arguments[0];
            return ( typeof (this.__store[_plugin_name]) != 'undefined' )
                ? this.__store[_plugin_name]
                : null;
        },
        // Function to know if a plugin is registered or not
        isRegistered : function()
        {
            return ( typeof(this.__store[arguments[0]]) != 'undefined' );
        },
        // Function for init the PluginsManager object
        init : function()
        {
            this.initPlugins();
            Ext.define('MsExt.App.WinPlgManager',{
                extend : 'Ext.window.Window',
                title: 'Gestor de plugins',iconCls : 'plugins_manager',
                closable:false,modal: true,shadow:'frame',
                width: 250,height: 330,border:true,plain:true,
                layout: 'fit', animateTarget : '_plg_mng_btn',

                initComponent: function() {
                    var me = this;

                    Ext.applyIf(me, {
                        items: [{
                            xtype : 'grid',width : '100%',height: '100%',id : '_plg_grid_id',
                            stripeRows: true,columnLines: true,enableColumnHide : false,
                            viewConfig: {forceFit:true},
                            store : Ext.create('Ext.data.ArrayStore', {
                                fields : [{name : 'plugin',type: 'string'}, {name: 'name',type: 'string'},{name: 'state',type: 'boolean'}]
                            }),
                            columns:[
                                Ext.create('Ext.grid.RowNumberer'),
                                {header: "Plugin",flex: 1,dataIndex: 'name',align: 'left'},
                                {xtype: 'checkcolumn',header: 'Activo',dataIndex: 'state',width: 70,editor: {xtype: 'checkbox',cls: 'x-grid-checkheader-editor'}}
                            ],
                            selModel: Ext.create('Ext.selection.RowModel', {singleSelection:true}),
                            listeners : {
                                afterrender : function(component, options){
                                    var _states = [], _plugin, _plugins = MsExt.App.PluginsManager.__store;

                                    for(_plugin in _plugins)
                                    {
                                        if(typeof(_plugins[_plugin]) != 'object') continue;
                                        if(_plugins[_plugin].isPlugAndPlay) _states.push([_plugin, _plugins[_plugin].getName(), _plugins[_plugin].isVisible()]);
                                        else _states.push([_plugin, '<i>' + _plugins[_plugin].name + '</i>', null]);
                                    }

                                    component.getStore().loadData(_states);
                                }
                            }
                        }],
                        buttons:[
                            {
                                text: 'Aplicar',
                                handler: function() {
                                    var _grid_store = me.getComponent('_plg_grid_id').getStore(),
                                        _plugins = MsExt.App.PluginsManager.__store,
                                        _count = _grid_store.getCount(),i = 0;

                                    // Cycle by each row of the grid store
                                    for(; i < _count; i++)
                                    {
                                        var _plugin_name = _grid_store.getAt(i).get('plugin');
                                        if(_plugins[_plugin_name].isPlugAndPlay)
                                        {
                                            if(_grid_store.getAt(i).get('state')) _plugins[_plugin_name].show();
                                            else _plugins[_plugin_name].hide();
                                        }
                                    }
                                }
                            },
                            {text: 'Cerrar',handler: function() {me.close();}}]
                    });

                    me.callParent(arguments);
                }
            });

            // The button for show the window for management
            var _plg_btn = new Ext.Button({
                id      : '_plg_mng_btn',
                iconCls :'plugins_manager',
                tooltip : 'Gestor de plugins',
                text    : '<b>Plugins</b>',
                handler : function(){Ext.create('MsExt.App.WinPlgManager').show();}
            });

            MsExt.App.Interface.getToolBar().add(['->','-',_plg_btn,'-']);
        },// End of init function
        //------------------------------------------------------------------------------
        // Activate an element of the application
        activatePlugin : function(ItemId)
        {
            this.__last_active_item = this.__current_item_id
            this.__current_item_id = ItemId;
        },
        // Release the last activated element of the application
        releaseCurrentPlugin : function()
        {
            if(this.__last_active_item != null)
            {
                this.__current_item_id = this.__last_active_item;
                this.__last_active_item = null;
            }
        },
		enablePlugin : function(PluginName)
		{
			if(typeof(this.__store[PluginName]) != 'undefined')
				this.__store[PluginName].enable();
		},
		disablePlugin : function(PluginName)
		{
			if(typeof(this.__store[PluginName]) != 'undefined')
				this.__store[PluginName].disable();
		}

    },// END OF PluginsManager Object

    //-------------------------------------------------------------------------------
    // Interface
    Interface : {
        //// FIELDS
        // Application component
        __application : null,
        // Menu bar of the application
        __app_menu_bar : Ext.create('Ext.toolbar.Toolbar',{
            height: 28,
            id: 'app_menu_bar',
            dock: 'top',
            items : ['-']
        }),
        // Toolbar of the application
        __app_buttons_bar : Ext.create('Ext.toolbar.Toolbar',{
            height: 28,
            id: 'app_buttons_bar',
            dock: 'top',
            items : ['-']
        }),
        // Left panel for tools
        __tools_panel : Ext.create('Ext.panel.Panel',{
            region : 'center',
            split:true,
            layout:'accordion',
            layoutConfig:{animate:true}
        }),
        //-------------------------------------------------
        // Object for control menu items of the application
        __menu_controller : {
            /* Array for store the menu structure
             * Array structure:
             *  [menu_name] -> Array [menu] = Ext.menu */
            __menu_store : new Array(),

            // Insert a new menu item
            insertMenuItem : function(menu, Ext_menu_item)
            {
                // If the menu items does not exist, create one
                if( typeof(this.__menu_store[menu]) == 'undefined' )
                    this.__menu_store[menu] = new Array();

                // Get the text of the menu item
                var _menu_item_name = Ext_menu_item.text; // Review function name

                if( typeof(this.__menu_store[menu][_menu_item_name]) != 'undefined' )
                    alert('El item ' + _menu_item_name + ' para el menu ' + menu + ' ya existe');
                else
                    this.__menu_store[menu][_menu_item_name] = Ext_menu_item;
            },

            // Insert a new submenu item
            insertSubMenuItem : function(menu, menu_item_name, Ext_submenu_item)
            {
                // If the menu is not created
                if( typeof(this.__menu_store[menu]) == 'undefined' )
                    this.__menu_store[menu] = new Array();

                // If the menu item does not exist, it is created.
                // Else is added
                if( typeof(this.__menu_store[menu][menu_item_name]) == 'undefined' )
                {
                    this.__menu_store[menu][menu_item_name] = new Ext.menu.Item(
                    {
                        text : menu_item_name,
                        menu : [Ext_submenu_item]
                    });
                }
                else
                {
                    // Verify that the new submenu item does not exist
                    for(var i = 0; i < this.__menu_store[menu][menu_item_name].menu.items.getCount(); i++)
                    {
                        var _item = this.__menu_store[menu][menu_item_name].menu.items.item(i);
                        if(_item.text == Ext_submenu_item.text)
                        {
                            alert('Ya existe el item de menu ' + menu + ' \\ ' + menu_item_name + ' \\ ' + _item.text);
                            return;
                        }
                    }

                    // If subitem does not exist, add the subitem
                    this.__menu_store[menu][menu_item_name].menu.addItem(Ext_submenu_item);
                }
            },

            // Render the registered menu
            renderMenu : function()
            {
                var _menu = null, _menu_name, id = 0;

                // Iterate each menu
                for(_menu_name in this.__menu_store)
                {

                    if(typeof(this.__menu_store[_menu_name]) == 'function')
                        continue;

                    _menu = new Ext.menu.Menu();
                    // Iterate each menu item and insert it into the menu
                    for(_item in this.__menu_store[_menu_name])
                    {
                        if(typeof(this.__menu_store[_menu_name][_item]) == 'function')
                            continue;
                        _menu.add(this.__menu_store[_menu_name][_item]);
                    }

                    // Create a split button to insert it into the menu
                    var _split_button = new Ext.button.Button({
                        text : '<b>'+ _menu_name + '</b>',
                        menu : _menu,
                        split: true,
                        id : 'menu_' + (id++).toString() + '_id'
                    });

                    // Insert the split button into the bar of menu
                    MsExt.App.Interface.getMenuBar().add(_split_button);
                    MsExt.App.Interface.getMenuBar().add('-');
                    MsExt.App.Interface.getMenuBar().doLayout();
                }
            },

            // Render the menu by a given order
            renderMenuByOrder : function(_menu_order)
            {
                var _menu = null;
                var _menu_name = null;

                // Iterate each menu name of the order
                for(var i = 0; i < _menu_order.length; i++)
                {
                    _menu_name = _menu_order[i];

                    _menu = new Ext.menu.Menu();
                    // Iterate each menu item and insert it into the menu
                    if( typeof(this.__menu_store[menu]) == 'undefined' )
                        continue;

                    for(_item in this.__menu_store[_menu_name])
                        _menu.add(this.__menu_store[_menu_name][_item]);

                    // Create a split button to insert it into the menu
                    var _split_button = new Ext.SplitButton({
                        text : '<b>'+ _menu_name + '</b>',
                        menu : _menu,
                        split: false,
                        id : 'menu_' + _menu_name + '_id'
                    });

                    // Insert the split button into the bar of menu
                    MsExt.App.Interface.getMenuBar().add(_split_button);
                }
            }
        },// End of __menu_controller object

        //// FUNCTIONS
        // Return the bar of the application for the menu
        getMenuBar : function()
        {
            return this.__app_menu_bar;
        },

        // Return the bar of the application for the menu
        getToolBar : function()
        {
            return this.__app_buttons_bar;
        },

        //----------------------------------------------------------------------
        // Add a menu into the menu bar
        addMenu : function()
        {
            var menuName = arguments[0],
                menuItem = arguments[1];
            if(Ext.isArray(menuItem))
                for(var i = 0; i < menuItem.length; i++)
                    this.insertMenuItem(menuName, menuItem[i]);
            else
                this.insertMenuItem(menuName, menuItem);
        },

        // Insert a new menu item
        insertMenuItem : function()
        {
            var _str_plugin = MsExt.App.PluginsManager.__current_item_id + "",
                menu = arguments[0],
                menuConfig = arguments[1];
            menuConfig.handler = Ext.Function.createInterceptor(menuConfig.handler, function(){
                MsExt.App.PluginsManager.activatePlugin(_str_plugin);
                return true;
            });
            this.__menu_controller.insertMenuItem(menu, new Ext.menu.Item(menuConfig));
        },

        // Insert a new sub menu item
        insertSubMenuItem : function(menu, menu_item_name, Ext_submenu_item)
        {
            var _str_plugin = MsExt.App.PluginsManager.__current_item_id + "",
                menu = arguments[0],
                subMenu = arguments[1],
                menuConfig = arguments[2];

            menuConfig.handler = Ext.Function.createInterceptor(menuConfig.handler, function(){
                MsExt.App.PluginsManager.activatePlugin(_str_plugin);
                return true;
            });
            this.__menu_controller.insertSubMenuItem(menu, subMenu, new Ext.menu.Item(menuConfig));
        },

        insertToolBarSeparator : function()
        {
            if(arguments.length == 0)
                this.__app_buttons_bar.add(['-']);
            else
                this.__app_buttons_bar.add([{
                    xtype : 'tbseparator',
                    id : arguments[0]
                }]);
        },

        insertToolBarButton : function()
        {
            var _str_plugin = MsExt.App.PluginsManager.__current_item_id + "";
            var _btn_config = arguments[0];
            _btn_config.handler = Ext.Function.createInterceptor(_btn_config.handler, function(){
                MsExt.App.PluginsManager.activatePlugin(_str_plugin);
                return true;
            });
            this.__app_buttons_bar.add(_btn_config);
        },

        insertToolsPanel : function(panel)
        {
            this.__tools_panel.add(panel);
        },

        // Function to render the main application
        render : function()
        {
            MsExt.Components.MapPanel = Ext.create('MsExt.components.MapPanel');
            MsExt.Components.Reference = Ext.create('MsExt.components.Reference');
            MsExt.Components.ScaleBar = Ext.create('MsExt.components.ScaleBar');
            MsExt.Components.LayerControl = Ext.create('MsExt.components.LayerControl');

            this.__application = Ext.create('Ext.container.Viewport',
            {
                layout: {type: 'border'},
                items: [MsExt.Components.MapPanel,
                    {
                        xtype: 'panel',
                        width: 270,
                        layout: {type: 'border'},
                        collapsible: true,
                        title: 'Control de capas',
                        region: 'west',
                        split: true,
                        floatable: false,
                        items: [MsExt.Components.LayerControl,MsExt.Components.Reference]
                    },{
                        xtype: 'panel',
                        height: 82,
                        title: 'MsExt - Framework for GIS Web',
                        region: 'north',
                        dockedItems: [this.__app_menu_bar, this.__app_buttons_bar]
                    },{
                        xtype: 'panel',
                        region:'east',
                        title : 'Herramientas',
                        collapsible: true,
                        collapsed : false,
                        iconCls:'tools',
                        split:true,
                        width: 250,
                        minSize: 250,
                        maxSize: 250,
                        items: [this.__tools_panel]
                    }]
            });
        }
    },// END OF Interface Object

    //-------------------------------------------------------------------------------
    // Object for server requests
    ServerRequest : {
        // Build a JsonStore for load data from a module
        // Params:
        //	ServerFunction: Name of the function to invoke for load data.
        //		Function format: File.Class.Function
        //	JsonConfigObj: Config object of the Ext.JsonStore
        BuildJsonStore : function(ServerFunction, JsonConfigObj)
        {
            var _current_item = MsExt.App.PluginsManager.__current_item_id,
                _function_name = "Load." + _current_item + "." + ServerFunction;

            if( typeof(JsonConfigObj.baseParams) == 'undefined' )
                JsonConfigObj.baseParams = {
                    fn : _function_name
                };
            else
                JsonConfigObj.baseParams.fn = _function_name;

            JsonConfigObj.url = 'App/Server/fn_call.php';

            return new Ext.data.JsonStore(JsonConfigObj);
        },

        // Perform a request to application. This function is used for request data to the app
        // Do not redraw the map.
        // Params:
        //	ServerFunction: Name of the function to invoke for make the request.
        //		Function format: File.Class.Function
        //	Params: Object with the params of the function.
        //	CallbackFn: Function to manage the server response.
        //		This function recive as paramenter the Json of the response
        PerformAppRequest : function(ServerFunction, Params, CallbackFn)
        {
            var _function_name = "Request.App.App." + ServerFunction;

            if(typeof(Params) == 'undefined')
                Params = {
                    fn : _function_name
                };
            else
            {
                Params.fn = _function_name;
            }

            Ext.Ajax.request(
                {
                    url : 'App/Server/fn_call.php',
                    method : 'post',
                    params : Params,
                    callback : function(options, success, response)
                    {
                        var _response = 0;
                        var _error = false;
                        try
                        {

                            _response = Ext.decode(response.responseText, true);
                            if(_response == null) Ext.Msg.alert('Error del servidor', response.responseText);
                            else
                            {
                                if(_response.success)
                                    CallbackFn(_response);
                                else
                                    Ext.Msg.alert(_response.response[0].error, _response.response[0].desc);
                            }
                        }
                        catch(error)
                        {
                            Ext.Msg.alert('Error en el cliente', error);
                            EndPaint();
                        }
                    }
                });
        },

        // Perform a syncronic request to application. This function is used for request data to the app
        // Do not redraw the map.
        // Params:
        //	ServerFunction: Name of the function to invoke for make the request.
        //		Function format: File.Class.Function
        //	Params: Object with the params of the function.
        PerformSyncAppRequest : function(ServerFunction, Params, AppHandleError)
        {
            var _params = (Params == null) ? {
                fn : ''
            } : Params;
            _params.fn =  "Request.App.App." + ServerFunction;
            _params = Ext.Object.toQueryString(_params);

            var connection = new Ext.data.Connection();
            var xhr = connection.getXhrInstance();

            xhr.open('POST', 'App/Server/fn_call.php', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(_params);

            try
            {
                var _response = Ext.decode(xhr.responseText, true);
                // Error from the server
                if(_response == null)
                {
                    this.ShowServerError(xhr.responseText);
                    return false;
                }

                if(_response.success)
                    return _response;
                else
                {
                    if(typeof(AppHandleError) == 'undefined' || AppHandleError === true)
                        this.ShowErrors(_response.errors);

                    return false;
                }
            }
            catch(error)
            {
                Ext.Msg.alert('Error en el cliente', error);
                return false;
            }
        },

        // Perform a request to the map. This function is used for request data from the map
        // but not redraw the map.
        // Params:
        //	ServerFunction: Name of the function to invoke for make the request.
        //		Function format: File.Class.Function
        //	Params: Object with the params of the function.
        //	CallbackFn: Function to manage the server response.
        //		This function recive as paramenter the Json of the response
        PerformMapRequest : function(ServerFunction, Params, CallbackFn)
        {
            var _current_item = MsExt.App.PluginsManager.__current_item_id,
                _function_name = "Request." + _current_item + "." + ServerFunction,
                _item_id = _current_item.split('.')[1];

            if(typeof(Params) == 'undefined')
                Params = {
                    fn : _function_name
                };
            else
            {
                Params.fn = _function_name;
            }

            Ext.Ajax.request(
                {
                    url : 'App/Server/fn_call.php',
                    method : 'post',
                    params : Params,
                    callback : function(options, success, response)
                    {
                        var _response = 0;
                        var _error = false;
                        try
                        {
                            try
                            {
                                _response = Ext.decode(response.responseText);
                            }
                            catch(exception)
                            {
                                //EndPaint();
                                Ext.Msg.alert('Error del servidor', response.responseText);
                            }

                            if(_response.success) CallbackFn(eval("_response." + _item_id));
                            else
                                Ext.Msg.alert(_response.response[0].error, _response.response[0].desc);
                        }
                        catch(error)
                        {
                            //EndPaint();
                            Ext.Msg.alert('Error en el cliente', error);
                        }
                    }
                });
        },

        // Perform a synchron request to the map. This function is used for request data from the map
        // but not redraw the map.
        // Params:
        //	ServerFunction: Name of the function to invoke for make the request.
        //		Function format: File.Class.Function
        //	Params: Object with the params of the function.
        PerformSyncMapRequest : function(ServerFunction, Params, AppHandleError)
        {
            var _current_item = MsExt.App.PluginsManager.__current_item_id,
                _function_name = "Request." + _current_item + "." + ServerFunction,
                _item_id = _current_item.split('.')[1],
                _params = (Params == null) ? {fn : ''} : Params;

            _params.fn =  _function_name;
            _params = Ext.Object.toQueryString(_params);

            var connection = new Ext.data.Connection();
            var xhr = connection.getXhrInstance();

            MsExt.Common.Message.showMessage('Cargando datos','Por favor espere...','LoadingData');

            xhr.open('POST', 'App/Server/fn_call.php', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(_params);

            MsExt.Common.Message.hideMessage();

            try
            {
                var _response = Ext.decode(xhr.responseText, true);
                // Error from the server
                if(_response == null)
                {
                    this.ShowServerError(xhr.responseText);
                    return false;
                }

                if(_response.success)
                    return _response[_item_id];
                else
                {
                    if(typeof(AppHandleError) == 'undefined' || AppHandleError === true)
                        this.ShowErrors(_response.errors);

                    return false;
                }
            }
            catch(error)
            {
                Ext.Msg.alert('Error en el cliente', error);
                return false;
            }
        },

        // Perform drawing on the map. This function is used for draw in the map and process request to.
        // Params:
        //	ServerFunction: Name of the function to invoke for make the request.
        //		Function format: File.Class.Function
        //	Params: Object with the params of the function.
        //	CallbackFn: Function to manage the server response.
        //		This function recive as paramenter the Json of the response
        PerformMapDrawing : function(ServerFunction, Params)
        {
            var _current_item = MsExt.App.PluginsManager.__current_item_id,
                _function_name = "Draw." + _current_item + "." + ServerFunction,
                _item_id = _current_item.split('.')[1],
                _caller = _current_item.split('.')[0];

            if(Params == null)
                Params = {
                    fn : _function_name
                };
            else
                Params.fn = _function_name;

            var _params = Ext.Object.toQueryString(Params);

            var connection = new Ext.data.Connection();
            var xhr = connection.getXhrInstance();

            MsExt.Common.Message.showMessage('Cargando mapa','Por favor espere...','LoadingMap');

            xhr.open('POST', 'App/Server/fn_call.php', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(_params);

            MsExt.Common.Message.hideMessage();

            try
            {
                var _response = Ext.decode(xhr.responseText, true);
                // Error from the server
                if(_response == null)
                {
                    this.ShowServerError(xhr.responseText);
                    return false;
                }

                if(_response.success)
                {
                    var component;
                    for(component in MsExt.Components)
                        if(MsExt.Components[component].updateComponent)
                            MsExt.Components[component].updateComponent(_response[component]);

                    if (_caller != 'Components')
                        return _response[_item_id];
                }
                else
                {
                    if(typeof(AppHandleError) == 'undefined' || AppHandleError === true)
                        this.ShowErrors(_response.errors);

                    return false;
                }
            }
            catch(error)
            {
                Ext.Msg.alert('Error en el cliente', error);
                return false;
            }
        },

        // Error management
        ShowServerError : function(ErrorText)
        {
            var _win_error = Ext.create('MsExt.Window', {
                title: 'Error',
                height: 200,
                width: 450,
                plain: true,
                modal: true,
                resizable : false,
                maximizable : true,
                layout : { type : 'fit'},
                items : [
                    {
                        xtype : 'panel',
                        height: '100%',
                        width: '100%',
                        border : true,
                        frame : true,
                        autoScroll : true,
                        html : ErrorText
                    }],
                closable : true,
                closeAction : 'destroy',
                buttonAlign : 'center',
                buttons :[
                    {
                        text : 'OK',
                        handler : function()
                        {
                            _win_error.closeWindow();
                        }
                    }]
            });
            _win_error.show();
        },

        ShowErrors : function(Errors)
        {
            var _html_error = '';
            for(var i = 0; i < Errors.length; i++)
                _html_error += '<font color=red><b>' + Errors[i].error + '</b></font>'+
                    '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>' + Errors[i].description + '</i><br>';

            this.ShowServerError(_html_error);
        }
    },// END OF ServerRequest Object

    //-------------------------------------------------------------------------------
    // Object to register global values
    Registry : {
        // Storage
        __storage : [],
        // Function to manage values to share for all the application
        registerValue : function(Key, Value)
        {
            this.__storage[Key] = Value;
        },

        getRegisteredValue : function(Key)
        {
            if(typeof(this.__storage[Key]) != 'undefined')
                return this.__storage[Key];

            return null;
        },

        deleteRegisteredValue : function(Key)
        {
            if(typeof(this.__storage[Key]) != 'undefined')
            {
                delete this.__storage[Key];
                this.__storage[Key] = null;
            }
        },

        clearRegistry : function()
        {
            delete this.__storage;
            this.__storage = null;
            this.__storage = new Array();
        }
    },// END OF Registry Object

    msgCt : null,

    InfoMessage : function(title, format)
    {
        function createBox(t, s){
            return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
        }

        if(!this.msgCt){
            this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
        }
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.core.DomHelper.append(this.msgCt, createBox(title, s), true);
        m.hide();
        m.slideIn('t').ghost("t", {delay: 1500, remove: true});
    },

    loadMap : function(Source, Mapfile, MapName)
    {
        //var _scope = this;
        var _w = Ext.get('map_container').getWidth(true);
        var _h = Ext.get('map_container').getHeight(true);

        Ext.Ajax.timeout = 90000;

        var OnLoad = function(ObjResponse)
        {
            var component;
            for(component in MsExt.Components)
                if(MsExt.Components[component].onLoadMap)
                    MsExt.Components[component].onLoadMap(ObjResponse[component]);

            MsExt.Common.Message.hideMessage();
        };

        this.ServerRequest.PerformAppRequest('Loader.Loader.LoadMap',
            {
                map_name : Mapfile,
                width : _w,
                height : _h,
                source : Source
            },
            Ext.Function.bind(OnLoad,this));
    },

    initComponents : function()
    {
        var component;
        for(component in MsExt.Components)
        {
            if(typeof(MsExt.Components[component])== 'object')
            {
                this.PluginsManager.activatePlugin('Components.' + component.toString());
                MsExt.Components[component].initMapComponent();
            }
        }
    }
}

Ext.onReady(function(){

    Ext.Loader.setConfig({enabled: true});
    Ext.Loader.setPath('Ext.ux', 'Framework/Client/ExtJs/ux');

    Ext.require(['Ext.ux.CheckColumn']);

    Ext.QuickTips.init();

    MsExt.App.Interface.render();
    MsExt.App.initComponents();
    MsExt.App.PluginsManager.init();
    MsExt.App.Interface.__menu_controller.renderMenu();
    MsExt.App.PluginsManager.disablePlugin('SpecialMaps');

    MsExt.App.loadMap('BaseMaps','CubaStreets.map','Mapa de prueba');
});
