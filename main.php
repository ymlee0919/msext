<?php
    session_start();
/*
    if (!isset($_SESSION['_user_id']))
    {
        header("Location:index.php");
        return;
    }
*/
    if ($_SESSION['APP_PATH'])
        unset($_SESSION['APP_PATH']);

    if ($_SESSION['MSEXT_MAP_NAME'])
        unset($_SESSION['MSEXT_MAP_NAME']);

    if ($_SESSION['FRAMEWORK_PATH'])
        unset($_SESSION['FRAMEWORK_PATH']);

    if ($_SESSION['reference_refresh'])
        unset($_SESSION['reference_refresh']);

    if ($_SESSION['reference_refresh_layers'])
        unset($_SESSION['reference_refresh_layers']);

    // Load MapScript extension
    if (!extension_loaded("MapScript"))
        dl('php_mapscript.' . PHP_SHLIB_SUFFIX);

    $cwd = getcwd();
    $_cwd = str_replace('\\', '/', $cwd);

    $_SESSION['APP_PATH'] = $_cwd;
    $_SESSION['FRAMEWORK_PATH'] = $_cwd . '/Framework/Server/MsExt';

    $_SESSION['reference_refresh'] = 'auto';
    $_SESSION['reference_refresh_layers'] = [];
?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>MsExt Framework Ver 2.0</title>
    <style type="text/css">
        <!--
        .msext-presentation {
            padding: 1px 2px;
            text-align: center;
            background-image: none;
            background-color: #6f6f6f;
            background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #777777), color-stop(100%, #656565));
            background-image: -webkit-linear-gradient(top, #777777, #656565);
            background-image: -moz-linear-gradient(top, #777777, #656565);
            background-image: -o-linear-gradient(top, #777777, #656565);
            background-image: linear-gradient(top, #777777, #656565);
            -moz-border-radius-topleft: 8px;
            -webkit-border-top-left-radius: 8px;
            border-top-left-radius: 8px;
            -moz-border-radius-topright: 8px;
            -webkit-border-top-right-radius: 8px;
            border-top-right-radius: 8px;
            -moz-border-radius-bottomright: 8px;
            -webkit-border-bottom-right-radius: 8px;
            border-bottom-right-radius: 8px;
            -moz-border-radius-bottomleft: 8px;
            -webkit-border-bottom-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }
        -->
    </style>
</head>
<body bottommargin="0" topmargin="0" leftmargin="0" rightmargin="0">

    <div id="message">
        <div class="x-mask" id="blanck_screen" style="display: block; width: 0px; height: 0px; z-index: 510020; top:0; left:0" ></div>

        <div id="loading_div" class="msext-presentation" style="position:absolute;left:40%;top:45%;padding:2px;z-index:510030;height:auto;">
            <table width="220" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td id="BgImage" align="center" valign="middle">
                        <div id="MessagesImage">
                            <img src="App/Client/Imgs/Small_Logo.png" width="70" height="70" style="margin-right:4px;float:left;vertical-align:top;"/>
                        </div>
                    </td>
                    <td>
                        <div class="x-btn-text" id="loading-indicator" style="font:bold 13px tahoma,arial,helvetica;padding:10px;margin:0;height:auto;text-shadow: 0 1px 0 #b1b1b1;" width="220">
                            MsExt Framework<br>Ver 2.0
                        </div>
                        &nbsp;<span id="loading_div-msg" style="font-size: 11px; text-align: center;">
                            Cargando ...
                        </span>
                    </td>
                </tr>
            </table>
        </div>

        <div id="image_store" style="visibility:hidden">
            <div id="LoadingMap">
                <center><img src="App/Client/Icons/msLoading_map.gif" width="32" height="32"/><center>
            </div>
            <div id="LoadingData">
                <center><img src="App/Client/Icons/msLoading_data.gif" width="32" height="32"/><center>
            </div>
        </div>
    </div>

    <!--   Ext Framework  -->
    <link id="default" rel="stylesheet" type="text/css" href="Framework/Client/ExtJs/resources/css/ext-all-gray.css"/>
    <script type="text/javascript" src="Framework/Client/ExtJs/ext-all-debug-w-comments.js"></script>
    <!--   END Ext Framework  -->


    <!--   MsExt Framework  -->
    <script type="text/javascript" src="Framework/Client/MsExt/MsExt.js"></script>
    
    <script language="javascript" src="Framework/Client/MsExt/MsExt.Utils.js"></script>
    <script language="javascript" src="Framework/Client/MsExt/MsExt.MapTools.js"></script>
    <script language="javascript" src="Framework/Client/MsExt/MsExt.Features.js"></script>
    <script language="javascript" src="Framework/Client/MsExt/MsExt.MapComponent.js"></script>
    <script language="javascript" src="Framework/Client/MsExt/MsExt.Common.Window.js"></script>
    <script language="javascript" src="Framework/Client/MsExt/MsExt.Common.Message.js"></script>
    <script language="javascript" src="Framework/Client/MsExt/MsExt.Common.ColorPalette.js"></script>

    <!--   END MsExt Framework  -->

    <!--   Initial Data -->
    <!--   END Initial Data  -->

    <!--   App Components -->
    <link rel="stylesheet" type="text/css" href="App/Client/css/app_icons.css"/>
    <link rel="stylesheet" type="text/css" href="Components/MapPanel/Client/css/map_panel_icons.css"/>
    <link rel="stylesheet" type="text/css" href="Components/Reference/Client/css/reference.css"/>
    <link rel="stylesheet" type="text/css" href="Components/ScaleBar/Client/css/scalebar.css"/>
    <link rel="stylesheet" type="text/css" href="Components/LayerControl/Client/css/control_icons.css"/>

    <script type="text/javascript" src="App/Client/js/MsExt.Application.js"></script>
    <script type="text/javascript" src="Components/MapPanel/Client/js/MsExt.Components.MapPanel.js"></script>
    <script type="text/javascript" src="Components/Reference/Client/js/MsExt.Components.Reference.js"></script>
    <script type="text/javascript" src="Components/ScaleBar/Client/js/MsExt.Components.ScaleBar.js"></script>
    <script type="text/javascript" src="Components/LayerControl/Client/js/MsExt.Components.LayerControl.js"></script>
    <script type="text/javascript" src="Components/LayerControl/Client/js/MsExt.Components.LayerControl.LayerOrderController.js"></script>
    <!--   END App Components -->

    <!--   PLUGINS  -->

    <!--   Css  -->
    <link rel="stylesheet" type="text/css" href="Plugins/LocateSheetMap/Client/css/locateSheet.css"/>
    <!--   END Css  -->

    <!--   CODE  -->
    <script type="text/javascript" src="Plugins/LocateSheetMap/Client/js/LocateSheetMap.js"></script>
    <script type="text/javascript" src="Plugins/SpecialMaps/Client/js/SpecialMaps.js"></script>
    <script type="text/javascript" src="Plugins/SpecialMaps/Client/js/CategoriesWin.js"></script>
    <script type="text/javascript" src="Plugins/SpecialMaps/Client/js/ManageSpecialMapsPanel.js"></script>
    <script type="text/javascript" src="Plugins/Visibility/Client/js/Visibility.js"></script>
    <!--   END Code  -->

    <!--   END PLUGINS  -->

</body>

</html>