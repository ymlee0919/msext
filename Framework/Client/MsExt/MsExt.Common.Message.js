Ext.define('MsExt.Common.Message',{
    statics : {
        _current_type : null,

        blockScreen : function()
        {
            document.getElementById('blanck_screen').style.width = Ext.getBody().getWidth();
            document.getElementById('blanck_screen').style.height = Ext.getBody().getHeight();
        },

        freeScreen : function()
        {
            document.getElementById('blanck_screen').style.width = 0;
            document.getElementById('blanck_screen').style.height = 0;
        },

        showMessage : function(Caption, Message, Type)
        {
            this.blockScreen();

            if(this._current_type != Type)
            {
                document.getElementById('MessagesImage').innerHTML = document.getElementById(Type).innerHTML
                this._current_type = Type;
            }

            document.getElementById('loading-indicator').innerHTML = Caption;
            document.getElementById('loading_div-msg').innerHTML = Message;
            document.getElementById('loading_div').style.visibility = 'visible';
        },

        hideMessage : function()
        {
            this.freeScreen();
            document.getElementById('loading_div').style.visibility = 'hidden';
        }
    }
});
