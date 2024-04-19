Ext.define('MsExt.common.Window', {
    alias : ['MsExt.Window', 'msext.window', 'MsExt.window'],
    extend: 'Ext.window.Window',

    closeWindow : function(){
        var me = this;
        me.getEl().fadeOut({
            opacity: 0,
            easing: 'easeOut',
            duration: 300,
            remove: false,
            useDisplay: false,
            listeners : {
                afteranimate : function()
                {me.close()}
            }
        });
    },

    hideWindow : function(){
        var me = this;
        me.getEl().fadeOut({
            opacity: 0,
            easing: 'easeOut',
            duration: 300,
            remove: false,
            useDisplay: false,
            listeners : {
                afteranimate : function()
                {me.hide()}
            }
        });
    },

    showWindow : function(X, Y){
        var me = this,
            x =  (typeof(X) != 'undefined') ? X :(Ext.get(document.body).getWidth() / 2) - (me.width /2),
            y =  (typeof(Y) != 'undefined') ? Y :(Ext.get(document.body).getHeight() / 2) - (me.height /2);
        me.show();
        me.hide();
        me.showAt(x, y,{
            from : {
                opacity : 0
            }, to : {
                opacity : 1
            }, duration : 200,
            dynamic: true,
            easing : 'easeIn'
        });
    },

    initComponent: function() {
        var me = this;
        /*
        Ext.applyIf(me, {
            listeners : {
                show : function(){
                    me.getEl().fadeIn({
                        opacity: 1,
                        easing: 'easeOut',
                        duration: 300,
                        remove: false,
                        useDisplay: false,
                        listeners : {
                            afteranimate : function()
                            {me.close()}
                        }
                    });
                }
            }
        });
        */
        me.callParent(arguments);
    }
});

