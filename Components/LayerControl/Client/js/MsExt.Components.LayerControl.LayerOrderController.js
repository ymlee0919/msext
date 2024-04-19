Ext.define('MsExt.controllers.LayerOrderController', {
    extend: 'MsExt.common.Window',
    //extend: 'Ext.window.Window',
    height: 480,
    width: 400,
    layout: {
        type: 'fit'
    },
    title: '<center>Control de capas</center>',
    closable : false,
    modal : true,
    collapsible : true,
    resizable : false,
    animateTarget : 'msext_layer_control_id',
    id : 'msext_layerOrderController_win_id',

    // Tree component
    selfTree : null,

    initComponent: function() {
        var me = this;

        me.selfTree = Ext.create('Ext.tree.Panel',{
            id : 'msext_layerOrderController_tree_id',
            selModel: Ext.create('Ext.selection.RowModel', {
                listeners: {
                    selectionchange: function(tree, selected, eOpts)
                    {
                        if(selected.length == 0)
                        {
                            Ext.getCmp('del_group_btn_id').disable();
                            Ext.getCmp('del_layer_btn_id').disable();
                        }
                        else
                        {
                            // Enable or disable delete layer group
                            if(!selected[0].isLeaf() && !selected[0].isRoot())
                                Ext.getCmp('del_group_btn_id').enable();
                            else
                                Ext.getCmp('del_group_btn_id').disable();
                            // Enable or disable delete a single layer
                            if(selected[0].isLeaf())
                            {
                                if(selected[0].parentNode.isRoot())
                                    Ext.getCmp('del_layer_btn_id').enable();
                                else
                                {
                                    if(selected[0].parentNode.childNodes.length == 1)
                                        Ext.getCmp('del_layer_btn_id').disable();
                                    else
                                        Ext.getCmp('del_layer_btn_id').enable();
                                }
                            }
                            else
                                Ext.getCmp('del_layer_btn_id').disable();
                        }
                    }
                }
            }),
            viewConfig:{
                plugins : {
                    ptype: 'treeviewdragdrop'
                },
                listeners : {
                    beforedrop : function(node, data,overModel, dropPosition, dropHandlers, eOpts)
                    {
                        // If the selected item is group
                        if(!data.records[0].isLeaf())
                        {
                            if(!overModel.isLeaf())
                            {
                                if(overModel.isRoot()) return true; else return false;
                            }
                            else
                            {
                                if(!overModel.parentNode.isRoot())return false;
                            }
                        }
                        return (data.records[0].parentNode.childNodes.length > 1);
                    }
                }
            },
            useArrows: true,
            root : {
                text : 'Capas',
                expanded : true
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            iconCls : 'add_group',
                            id : 'add_group_btn_id',
                            tooltip: 'Crear nuevo grupo de capas',
                            handler : me.onCreateGroup,
                            scope : me
                        },'-',{
                            xtype: 'button',
                            tooltip: 'Eliminar grupo',
                            iconCls : 'del_group',
                            id : 'del_group_btn_id',
                            disabled : true,
                            handler : me.onDelGroup,
                            scope : me
                        },{
                            xtype: 'button',
                            tooltip: 'Eliminar capa',
                            iconCls : 'delete_layer',
                            id : 'del_layer_btn_id',
                            disabled : true,
                            handler : me.onDelLayer,
                            scope : me
                        }
                    ]
                }
            ]
        });

        Ext.applyIf(me, {
            items: [
                me.selfTree
            ],

            buttons : [
                {
                    text : 'Aceptar',
                    handler : function()
                    {
                        me.applyChanges();
                        me.close();
                    }
                },{
                    text : 'Aplicar',
                    handler : me.applyChanges,
                    scope : me
                },{
                    text : 'Cerrar',
                    handler : me.close,
                    scope : me

                }
            ],
            listeners : {
                beforerender : function(component, options)
                {
                    var _root = MsExt.Components.LayerControl.getRootNode(),
                        _group, _node, _layers = [];
                    if(!_root.hasChildNodes()) return true;
                    for(var i = 0; i < _root.childNodes.length; i++)
                    {
                        if(MsExt.TypeOf( _root.getChildAt(i)) == MsExt.LAYER)
                        {
                            _layers.push({
                                text : _root.childNodes[i].data.text,
                                icon : _root.childNodes[i].data.icon,
                                leaf : true
                            });
                        }
                        else
                        {
                            _node = _root.getChildAt(i);
                            if(MsExt.TypeOf( _node ) == MsExt.GROUP)
                            {
                                _group = {text : _node.data.text,leaf : false,expanded : true,children : []};

                                for(var j = 0; j < _node.childNodes.length; j++)
                                {
                                    _group.children.push({
                                        text : _node.childNodes[j].data.text,
                                        icon : _node.childNodes[j].data.icon,
                                        leaf : true
                                    });
                                }
                                _layers.push(_group);
                            }
                        }
                    }

                    me.selfTree.getRootNode().appendChild(_layers);
                    return true;
                }
            }
        });

        me.callParent(arguments);
    },

    // ---------------------------------------------------------------------------
    // INTERNAL FUNCTIONS
    // ---------------------------------------------------------------------------
    // Group Creation
    onCreateGroup : function()
    {
        var me = this;
        var _win = Ext.create('Ext.window.Window',{
            height: 110,
            width: 370,
            animateTarget : 'add_group_btn_id',
            resizable: false,
            layout: {
                type: 'fit'
            },
            title: 'Crear nuevo grupo de capas',
            modal: true,
            items: [
                {
                    xtype: 'form',
                    id : 'new_group_form_id',
                    frame: true,
                    bodyPadding: 5,
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Grupo',
                            id : 'group_name_textfield_id',
                            labelWidth: 60,
                            value : "",
                            anchor: '100%',
                            allowBlank: false,
                            validator : Ext.bind(me.existsGroup, me),
                            invalidText : 'El nombre del nuevo grupo no es v&aacute;lido'
                        }
                    ]
                }],
            buttons : [{
                text : 'Aceptar',
                handler : function()
                {
                    if(Ext.getCmp('new_group_form_id').getForm().isValid())
                    {
                        me.createGroup(Ext.getCmp('group_name_textfield_id').getValue());
                        _win.close();
                    }
                }
            },{
                text : 'Cancelar',
                handler : function()
                {
                    _win.close();
                }
            }]
        }).show();
    },

    createGroup : function(groupName)
    {
        this.selfTree.getRootNode().appendChild({
            text : groupName,
            leaf : false
        });
    },

    existsGroup : function(groupName)
    {
        if(groupName.trim().length == 0)
            return "El nombre del grupo es incorrecto";

        var _root = this.selfTree.getRootNode();
        for(var i = 0; i < _root.childNodes.length; i++)
        {
            if( (!_root.getChildAt(i).isLeaf()) && _root.childNodes[i].data.text == groupName)
                return "Ya existe un grupo con ese nombre";
        }
        return true;
    },
    //-----------------------------------------------------------------------
    // Delete Group
    onDelGroup : function()
    {
        var me = this;
        Ext.Msg.show({
            title:'Eliminar',
            animateTarget : 'del_group_btn_id',
            msg: 'Usted est&aacute; a punto de eliminar un grupo.<br>Desea eliminar las capas que este contiene?',
            buttons: Ext.Msg.YESNOCANCEL,
            buttonText :{
                yes : 'Si',
                no : 'No',
                cancel : 'Cancelar'
            },
            fn: function(buttonId){
                switch(buttonId)
                {
                    case "yes":
                        me.delGroup(true);
                        break;
                    case "no":
                        me.delGroup(false);
                        break;
                    default : break;
                }
            },
            icon: Ext.MessageBox.QUESTION,
            scope : this
        });
    },

    delGroup : function(delLayers)
    {
        if(!delLayers)
        {
            var _node = this.selfTree.getSelectionModel().getLastSelected();
            if(_node.hasChildNodes())
            {
                for(var i = 0; i < _node.childNodes.length; i++)
                {
                    this.selfTree.getRootNode().insertBefore({
                        text : _node.childNodes[i].data.text,
                        icon : _node.childNodes[i].data.icon,
                        leaf : true
                    }, _node);
                }
            }
        }

        this.selfTree.getRootNode().removeChild(this.selfTree.getSelectionModel().getLastSelected(), true);
    },
    //-------------------------------------------------------------------------
    // Delete Layer
    onDelLayer : function()
    {
        var me = this;
        Ext.Msg.show({
            title:'Eliminar',
            animateTarget : 'del_layer_btn_id',
            msg: 'Realmente desea eliminar esta capa?',
            buttons: Ext.Msg.YESNO,
            buttonText :{
                yes : 'Si',
                no : 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            fn: function(buttonId){
                if(buttonId == "yes")
                {
                    var _node = me.selfTree.getSelectionModel().getLastSelected();
                    _node.parentNode.removeChild(_node);
                }
            }
        });
    },
    //------------------------------------------------------------------------
    // Apply changes
    applyChanges : function()
    {
        var me = this,
            _root = me.selfTree.getRootNode(),
            _list = [], i = 0, j = 0,
            _group = null,
            _layers = null;

        // Iterate each node to build the array with the order
        // [{type : LAYER, name : LAYER_NAME}, {type : GROUP, name : GROUP_NAME, layers : [{...},...]}]
        for(; i < _root.childNodes.length; i++)
        {
            // Is is leaf is a layer
            if(_root.getChildAt(i).isLeaf())
            {
                _list.push({
                    type : 'LAYER',
                    name : _root.childNodes[i].data.text
                });
            }
            // Else is a group
            else
            {
                j = 0;
                _group = _root.childNodes[i];
                _layers = [];
                // Iterate each layer of the group
                for(;j < _group.childNodes.length; j++)
                {
                    _layers.push({
                        type : 'LAYER',
                        name : _group.childNodes[j].data.text
                    });
                }
                _list.push({
                    type : 'GROUP',
                    name : _group.data.text,
                    layers : _layers
                });
            }
        }

        MsExt.App.PluginsManager.activatePlugin('Components.LayerControl');
        MsExt.App.ServerRequest.PerformMapDrawing('LayerControl.LayerControl.SetLayerOrder',
            {order : Ext.encode(_list)});
        MsExt.App.PluginsManager.releaseCurrentPlugin();
    }
});
