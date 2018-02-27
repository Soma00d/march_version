$(document).ready(function (){

    var ws = new WebSocket("ws://localhost:8100");
    var dictionary = {};
    var jsonLog = [];
    var calibLog = [];
    var calibLogJSON;
    var userInfo = {};

    //------//
    var buttonContainer = $("#content_pretest .button_container");
    var ledContainer = $("#content_pretest .led_container");
    var testPoppin = $("#content_pretest .test_poppin");


    //remplissage des zones toolbox
    var zone0 = $("#content_toolbox .diag_inge .zone_0 .content");
    var zone1 = $("#content_toolbox .diag_inge .zone_1 .content");
    var zone2 = $("#content_toolbox .diag_inge .zone_2 .content");
    var zone3 = $("#content_toolbox .diag_inge .zone_3 .content");

    var intervalSpe;
    var intervalBAD;

    var displayContainer = $("#content_toolbox .diag_inge .display_container .content");
    var buzzerContainer = $("#content_toolbox .diag_inge .buzzer_container .content");
    var safetyContainer = $("#content_toolbox .diag_inge .safety_container .content");
    var enableContainer = $("#content_toolbox .diag_inge .enable_container .content");
    var srtlContainer = $("#content_toolbox .diag_inge .srtl_container");

    var safetyFreqContainer = $("#content_toolbox .diag_inge .safety_container .safety_freq_val");
    var safetyVoltContainer = $("#content_toolbox .diag_inge .safety_container .safety_volt_val");
    var enableFreqContainer = $("#content_toolbox .diag_inge .enable_container .enable_freq_val");
    var enableVoltContainer = $("#content_toolbox .diag_inge .enable_container .enable_volt_val");
    var supplyContainer = $("#content_toolbox .diag_inge .supply_container .content");
    var safetySRTL = $("#content_toolbox .diag_inge .srtl_container .safety_srtl");
    var enableSRTL = $("#content_toolbox .diag_inge .srtl_container .enable_srtl");
    var safetySRTLfinal = "";
    var enableSRTLfinal = "";
    var hasSRTL;
    var counterDisplayFreqTens = 0;
    
    var latSwitchCtn = $("#content_toolbox .latSwitch");
    var autoposDRCtn = $("#content_toolbox .autoposDR");
    var globGantryCtn = $("#content_toolbox .globGantry");
    var sciFRTLCtn = $("#content_toolbox .sciFRTL");
    var sciLATCtn = $("#content_toolbox .sciLAT");
    
    var longEnableCtn = $("#content_toolbox .longEnable");
    var TBLtopPanCtn =$("#content_toolbox .TBLtopPan");
    var sc1LatDRCtn = $("#content_toolbox .sc1LatDR");
    var TBLtopUpDownCtn = $("#content_toolbox .TBLtopUpDown");
    var globGantry2Ctn = $("#content_toolbox .globGantry2");
    var globTableCtn = $("#content_toolbox .globTable");
    var FRTLlatGantryCtn = $("#content_toolbox .FRTLlatGantry");
    var latSwitch2Ctn = $("#content_toolbox .latSwitch2");
    var tsuiSupplyCtn = $("#content_toolbox .tsuiSupply");
    var FRTLgantryCtn = $("#content_toolbox .FRTLgantry");
    var unreg5Ctn = $("#content_toolbox .unreg5");
    var unreg12Ctn = $("#content_toolbox .unreg12");
    
    var latLockCtn = $("#content_toolbox .tt_lat_lock");
    var longLockCtn = $("#content_toolbox .tt_long_lock");
    var rotationLockCtn = $("#content_toolbox .tt_rotation_lock");
    var roomLightCtn = $("#content_toolbox .room_light");
        
    var arm1Ctn = $("#content_toolbox .l_arm_1");
    var handleConfSwitchCtn = $("#content_toolbox .handle_config_switch");
    var arm2Ctn = $("#content_toolbox .l_arm_2");
    var machineSwaCtn = $("#content_toolbox .machine_swa");
    var frontalSwaCtn = $("#content_toolbox .frontal_swa");
    var pivotMotionEnableCtn = $("#content_toolbox .pivot_motion_enable");
    var tblDriveDownCtn = $("#content_toolbox .tbl_drive_down");
    var tblDriveUpCtn = $("#content_toolbox .tbl_drive_up");

                        
                        
    //génération des joysticks
    var joystickContainerNew = $(".joystick_container_new");
    var joystickCalibrationContainer = $(".calibration_zone_container");
    var joystickVerifyContainer = $(".calibration_test_container");
    var joystickContainerNewRepair = $(".joystick_container_new_repair");
    var intervalVerify;
    var currentIdentifier;
    var currentSubindex;
    var currentSubindexX;
    var currentSubindexY;

    var diagInge = $("#content_toolbox .diag_inge");

    //info génériques//    
    var userSSO = "";
    var partNumber = "";
    var serialNumber = "";
    var family_id;
    var familyName = "";
    var globalName = "";
    var familyChoice = "";
    var modelChoice = "";
    var modelName = "";
    var typeChoice = "";
    var tstName = "";
    var sectionRepair = "";
    var switchNb;
    var hasServiceBt;
    var switchPosNumber;
    var nodeID;
    var cobID1;
    var cobID2;
    var FWfctV = "-";
    var FWcalibV = "-";
    var SWv = "-";
    var shouldHaveSRTL;
    var modeEngineering = 0;
    var modeManufacturing = 0;

    var activeSearchHistoryResult = {};

    //generic messages
    var startNodeMsg;
    var stopNodeMsg;
    var resetMasterTSSC;
    var startSlaveTSSC;
    var startSlaveSBSH;
    var startSlaveSBSH2;


    //Definition des variables globales pour le test final    
    var nameFinalContainer = $("#testfinal_container .name_test_container");
    var symbolNameFinal = $("#testfinal_container #symbol_name_t");
    var descriptionFinal = $("#testfinal_container #description_t");
    var userActionFinal = $("#testfinal_container #useraction_t");
    var imgFinal = $("#testfinal_container .img_t img");
    var imgFinalBloc = $("#testfinal_container .img_t");
    var timerBloc = $("#testfinal_container .timer_bloc");
    var stopTestBloc = $("#testfinal_container .stop_test_bloc");
    var recapListFinal = $("#testfinal_container #recap_list_t .content_recap");
    var progressBarFinal = $("#testfinal_container #progress_bar_t .percent");
    var progressBarFinalInside = $("#testfinal_container #progress_bar_t .inside_bar");

    //Test final fonctionnel
    var finalTestEntries = {};
    var finalTestEntriesTest = [];
    var waitingAction;
    var waitingID;
    var waitingXpos;
    var waitingYpos;
    var last_value_joy = 0;
    var waitingPressValue;
    var waitingReleaseValue;
    var pressValueContinue;
    var releaseValueContinue;
    var hardwareValidation;
    var hardwareValidationReleased;
    var validateTest = 0;
    var errorTestFinal = 0;
    var SRTLfinalTest = 0;

    var waitingEnableAndSafety;
    var indexFinal;
    var maxIndexFinal;
    var intervalGlobal;
    var currSymbol_name;
    var currType;
    var currDescription;
    var currPhoto_link;
    var currTimer;
    var currOffSignal;
    var currOnSignal;
    var currSignalStart;
    var currSignalStop;
    var currStandardName;
    var enableF = 0;
    var enableT = 0;
    var safetyT = 0;
    var safetyF = 0;
    var enableFrel = 0;
    var enableTrel = 0;
    var safetyTrel = 0;
    var safetyFrel = 0;
    var isEnable;
    var isSafety;
    var isCdrh;
    var currEnableT = 0;
    var currEnableF = 0;
    var currSafetyT = 0;
    var currSafetyF = 0;
    var currEnableSRTL = "";
    var currSafetySRTL = "";   
    var currEnableSRTLrel = "";
    var currSafetySRTLrel = "";   
    var currGlobalVoltage = 0;
    var currTsuiVoltage = 0;
    var initial_enable_tens = 0;
    var initial_enable_freq = 0;
    var initial_safety_tens = 0;
    var initial_safety_freq = 0;
    var initial_safety_srtl = 0;
    var initial_enable_srtl = 0;
    
    //Spybox
    var spyBox = $("#dialog-spybox .content_line");
    var spyBoxDialog = $("#dialog-spybox");
    var lastSpyMsg;

    //Calibration
    var calibrateContainer = $(".calibration_zone_container");
    var waitCalibResponse = "";
    var waitPingResponse = "";
    var finalResponseData; 
    var indexVerifGlobal = 0;

    //get info version
    var bootRelease;
    var FPGARelease;
    var softwareRelease;
    var unicID;

    //download firmware
    var arrayOfLines;
    var msgCount = 0;
    var waitDownloadResponse = "";
    var waitDownloadResponseOmega = "";
    var continueDownload = 0;
    var isDownloading = 0;
    var lineDownloading = 0;
    var downloadingBar = $(".download_tool .downloading_bar_container .downloading_bar");
    var downloadingBarContent = $(".download_tool .downloading_bar_container .downloading_bar_content");


    //-----------------------------------------------------//
    var _MODE = "START";

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// HOMEPAGE REPAIR  /////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //CONNEXION SECTION DIAGNOSTIQUE REPAIR
    $("#send_info_login_diag").on('click', function () {
        //alert(addHexVal("00000580", nodeID));
        userSSO = ($(".login_diag #user_sso_input_diag").val());
        partNumber = ($(".login_diag #part_number_input_diag").val());
        serialNumber = ($(".login_diag #serial_number_input_diag").val());

        //definition des id
        cobID1 = addHexVal("00000580", nodeID);
        cobID2 = addHexVal("00000600", nodeID);

        if (userSSO !== "" && partNumber !== "" && serialNumber !== "") {
            $.ajax({
                url: 'php/api.php?function=check_user_sso&param1=' + userSSO,
                type: 'GET',
                dataType: 'JSON',
                success: function (data, statut) {
                    userInfo = data;
                    if (userInfo.length == 0) {
                        alert("No result found with this SSO : " + userSSO);
                    } else if (userInfo[0].user_role == "REPAIR_ALL" || userInfo[0].user_role == "REPAIR_DIAG") {
                        $.ajax({
                            url: 'php/api.php?function=get_tsui_repair&param1=' + partNumber,
                            type: 'GET',
                            dataType: 'JSON',
                            success: function (data, statut) {
                                if (data.length == 0) {
                                    alert("No result found with this part number.")
                                } else {
                                    modeEngineering = 0 ;
                                    familyName = data[0].name;
                                    var photo = data[0].photo_link;
                                    family_id = data[0].family;
                                    tstName = data[0].tst_name;
                                    modelName = data[0].model;
                                    typeChoice = data[0].type;
                                    sectionRepair = "diagnostic";
                                    globalName = data[0].family_name;
                                    setInitialDisplayByModel(globalName, modelName, typeChoice);
                                    
                                    $(".photo_tsui").attr('src', 'images/' + photo);
                                    $(".title_bloc.name").html(familyName);
                                    $(".sso_user").html(userSSO);
                                    $(".part_number").html(partNumber);
                                    $(".serial_number").html(serialNumber);
                                    $("#content_home .information").removeClass("hidden");
                                    $("#content_home .information_diag").removeClass("hidden");
                                    $("#content_home .commentary_bloc").removeClass("hidden");

                                    $(".head_userinfo").removeClass("hidden");
                                    $(".head_userinfo .info .role_user").html("Repair");
                                    $(".popup_test_fw .bt_no").addClass(sectionRepair);
                                    $(".popup_test_fw .bt_yes").addClass(sectionRepair);

                                    setGenericMessages(globalName.trim());
                                    setTimeout(function(){
                                        getInfoCard(globalName, cobID2);
                                    },500);
                                    
                                    checkSN(serialNumber);
                                }
                                //Recupération du dictionnaire correspondant + remplissage du tableau diagnostique
                                $.ajax({
                                    url: 'php/api.php?function=get_dictionaries_by_id&param1=' + family_id,
                                    type: 'GET',
                                    dataType: 'JSON',
                                    success: function (data, statut) {
                                        dictionary = data;
                                        var len = dictionary.length;
                                        joystickContainerNewRepair.empty();
                                        buttonContainer.empty();
                                        ledContainer.empty();
                                        for (var iter = 0; iter < len; iter++) {
                                            if (data[iter].type == "button" && (data[iter].pressed_val != "" && data[iter].released_val != "")) {
                                                if (data[iter].is_led == "1" ) {
                                                    ledContainer.append("<div class='line id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='led'><span class='td symbol_name'>" + data[iter].symbol_name + "</span><span class='td'>led</span><span class='td'>" + data[iter].description + "</span><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><span class='td test_bt' data-name='" + data[iter].description + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-canid='" + data[iter].can_id + "'>TEST</span></div>");
                                                } else if (data[iter].is_led == "2") {
                                                    ledContainer.append("<div class='line id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='led_emergency'><span class='td symbol_name'>" + data[iter].symbol_name + "</span><span class='td'>led</span><span class='td'>" + data[iter].description + "</span><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><span class='td test_bt' data-name='" + data[iter].description + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-function='led_emergency' data-canid='" + data[iter].can_id + "'>TEST</span></div>");
                                                }
                                                buttonContainer.append("<div class='line id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td symbol_name'>" + data[iter].symbol_name + "</span><span class='td type'>" + data[iter].type + "</span><span class='td description'>" + data[iter].description + "</span><span class='td press'>" + data[iter].pressed_val + "</span><span class='td rel'>" + data[iter].released_val + "</span><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><span class='td totest'>Not tested</span></div>");


                                            } else {
                                                if (data[iter].type !== "joystick" && data[iter].type !== "mushroom" && data[iter].type !== "button" ) {
                                                    ledContainer.append("<div class='line id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td symbol_name'>" + data[iter].symbol_name + "</span><span class='td'>" + data[iter].type + "</span><span class='td'>" + data[iter].description + "</span><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><span class='td test_bt' data-name='" + data[iter].description + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-canid='" + data[iter].can_id + "'>TEST</span></div>");
                                                }
                                            }
                                            if (data[iter].type == "joystick" || data[iter].type == "mushroom") {
                                                joystickContainerNewRepair.append("<div class='new_joystick' id='id" + data[iter].id + "'><div class='name'>" + data[iter].description + "</div><div class='area_visual'><div class='area_etalon'><img class='cursor' src='images/cross_red.png'></div></div><div class='values'>x : <span class='x_val'></span> y : <span class='y_val'></span></div><div class='diag_test_bt hidden' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='" + data[iter].type + "'><div class='bt_test_ok'>OK</div><div class='bt_test_fail'>FAIL</div></div></div>");
                                            }
                                        }
                                        //gestion des boutons de test des leds et buzzers
                                        $(".test_bt").on('click', function () {
                                            var _this = $(this);
                                            var description = $(this).data('name');
                                            var onSignal = $(this).data('on');
                                            var offSignal = $(this).data('off');
                                            var functionTest = $(this).data('function');
                                            var postSignal = "002400806d68d7551407f09b861e3aad000549a844080000";
                                            var signalStart = postSignal + onSignal;
                                            var signalStop = postSignal + offSignal;

                                            var topPos = $(window).scrollTop();
                                            testPoppin.css('top', topPos + 300 + "px");
                                            $(".result_array").css("opacity", "0.5");

                                            testPoppin.html("<div class='title'>" + description + "</div><div class='bt_test'><div class='bouton_grey start_bt'>Start</div><div class='bouton_grey stop_bt'>Stop</div></div><div class='result_test'>Did something happen as expected ?</div><div class='bt_test_result'><div class='bouton_grey yes_bt'>YES</div><div class='bouton_grey no_bt'>NO</div></div>");

                                            testPoppin.find(".title").html(description);
                                            testPoppin.removeClass("hidden");


                                            testPoppin.find(".start_bt").on('click', function () {
                                                if(functionTest == "led_emergency" && globalName == "ELEGANCE"){
                                                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300153000000");
                                                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300245000000");
                                                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300354000000");
                                                }else{
                                                    sendSignal(signalStart);
                                                }
                                            });
                                            testPoppin.find(".stop_bt").on('click', function () {
                                                if(functionTest == "led_emergency" && globalName == "ELEGANCE"){
                                                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300144000000");
                                                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300257000000");
                                                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F0030034E000000");
                                                }else{
                                                    sendSignal(signalStop);
                                                }
                                            });
                                            testPoppin.find(".yes_bt").on('click', function () {
                                                $(".result_array").css("opacity", "1");
                                                testPoppin.empty();
                                                testPoppin.addClass("hidden");
                                                _this.css('background-color', 'yellowgreen');
                                                _this.html('TEST OK');
                                                _this.parent().addClass("tested");
                                                _this.parent().addClass("testok");
                                            });
                                            testPoppin.find(".no_bt").on('click', function () {
                                                $(".result_array").css("opacity", "1");
                                                testPoppin.empty();
                                                testPoppin.addClass("hidden");
                                                _this.css('background-color', 'red');
                                                _this.html('TEST FAIL');
                                                _this.parent().addClass("tested");
                                                _this.parent().removeClass("testok");
                                            });


                                        });
                                        $(".totest").on('click', function () {
                                            if ($(this).hasClass("tested")) {
                                                $(this).html("Not tested");
                                                $(this).removeClass("tested");
                                                $(this).parent().removeClass("tested");
                                            } else {
                                                $(this).html("Tested");
                                                $(this).addClass("tested");
                                                $(this).parent().addClass("tested");
                                            }
                                        });                                        
                                        $(".bt_test_ok").on('click', function () {
                                            if ($(this).hasClass("on")) {
                                                $(this).removeClass("on");
                                                $(this).parent().removeClass("ok");                                                
                                            } else {
                                                $(this).addClass("on");
                                                $(this).parent().addClass("ok");
                                                $(this).parent().removeClass("fail");
                                                $(this).parent().find(".bt_test_fail").removeClass("on");
                                            }
                                        });
                                        $(".bt_test_fail").on('click', function () {
                                            if ($(this).hasClass("on")) {
                                                $(this).removeClass("on");
                                                $(this).parent().removeClass("fail");
                                            } else {
                                                $(this).addClass("on");
                                                $(this).parent().addClass("fail");
                                                $(this).parent().removeClass("ok");
                                                $(this).parent().find(".bt_test_ok").removeClass("on");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        alert("This user does not have access rights for this section.");
                        $("#content_home .information").addClass("hidden");
                        $(".head_userinfo").addClass("hidden");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while trying to access database.");
                    $("#content_home .information").addClass("hidden");
                    $(".head_userinfo").addClass("hidden");
                }
            });

        } else {
            alert("Some fields are missing");
            $("#content_home .information").addClass("hidden");
            $(".head_userinfo").addClass("hidden");
        }
    });

    //CONNEXION SECTION FINALTEST REPAIR
    $("#send_info_login_finaltest").on('click', function () {
        //alert(addHexVal("00000580", nodeID));
        userSSO = ($(".login_finaltest #user_sso_input_finaltest").val());
        partNumber = ($(".login_finaltest #part_number_input_finaltest").val());
        serialNumber = ($(".login_finaltest #serial_number_input_finaltest").val());

        //definition des id
        cobID1 = addHexVal("00000580", nodeID);
        cobID2 = addHexVal("00000600", nodeID);

        if (userSSO !== "" && partNumber !== "" && serialNumber !== "") {
            $.ajax({
                url: 'php/api.php?function=check_user_sso&param1=' + userSSO,
                type: 'GET',
                dataType: 'JSON',
                success: function (data, statut) {
                    userInfo = data;
                    if (userInfo.length == 0) {
                        alert("No result found with this SSO : " + userSSO);
                    } else if (userInfo[0].user_role == "REPAIR_ALL" || userInfo[0].user_role == "REPAIR_FINAL") {
                        $.ajax({
                            url: 'php/api.php?function=get_tsui_repair&param1=' + partNumber,
                            type: 'GET',
                            dataType: 'JSON',
                            success: function (data, statut) {
                                if (data.length == 0) {
                                    alert("No result found with this part number.")
                                } else {
                                    modeEngineering = 0 ;
                                    modeManufacturing = 0 ;
                                    familyName = data[0].name;
                                    var photo = data[0].photo_link;
                                    family_id = data[0].family;
                                    tstName = data[0].tst_name;
                                    sectionRepair = "finaltest";
                                    globalName = data[0].family_name;
                                    modelName = data[0].model;
                                    typeChoice = data[0].type;
                                    switchNb = data[0].switch_pos_number;
                                    hasServiceBt = data[0].has_service_bt;
                                    shouldHaveSRTL = data[0].has_SRTL;
                                    setInitialDisplayByModel(globalName, modelName, typeChoice);
                                    
                                    $(".photo_tsui").attr('src', 'images/' + photo);
                                    $(".title_bloc.name").html(familyName);
                                    $(".sso_user").html(userSSO);
                                    $(".part_number").html(partNumber);
                                    $(".serial_number").html(serialNumber);
                                    $("#content_home .information").removeClass("hidden");
                                    $("#content_home .information_finaltest").removeClass("hidden");
                                    $("#content_home .commentary_bloc").removeClass("hidden");
                                    $(".head_userinfo").removeClass("hidden");
                                    $(".head_userinfo .info .role_user").html("Repair");
                                    $(".popup_test_fw .bt_no").addClass(sectionRepair);
                                    $(".popup_test_fw .bt_yes").addClass(sectionRepair);

                                    
                                    setGenericMessages(globalName.trim());
                                    setTimeout(function(){
                                        getInfoCard(globalName, cobID2);
                                    },500);
                                    checkSN(serialNumber);
                                    
                                    displayCalibrationTest(switchNb, hasServiceBt);
                                    if(parseInt(switchNb) > 0){
                                        fillSwitchTest(switchNb);
                                    }
                                }
                                //Recupération du dictionnaire correspondant + remplissage du tableau diagnostique
                                $.ajax({
                                    url: 'php/api.php?function=get_dictionaries_by_id&param1=' + family_id,
                                    type: 'GET',
                                    dataType: 'JSON',
                                    success: function (data, statut) {
                                        dictionary = data;
                                        var len = data.length;
                                        joystickCalibrationContainer.empty();
                                        joystickVerifyContainer.empty();
                                        $(".joystick_container_new").empty();

                                        for (var iter = 0; iter < len; iter++) {
                                            switch (data[iter].type) {
                                                case "joystick":
                                                    joystickCalibrationContainer.append("<div class='bloc_calibrate id" + data[iter].id + "' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            +"<div class='bloc_gestion_calib'>"
                                                                + "<div class='title_jauge'>" + data[iter].description + "</div>"
                                                                + "<div class='calibrate_bt'>"
                                                                + "<button data-long='" + data[iter].calib_subindex_x + "' data-lat='" + data[iter].calib_subindex_y + "' data-id='" + data[iter].id + "'>Calibrate</button>"
                                                                + "<div class='calibrate_tool hidden'>"
                                                                + "<div class='status_calib'></div>"
                                                                + "<div class='action_calib'></div>"
                                                                + "<div class='validate_calib'>Validate</div>"
                                                                + "</div>"
                                                                + "</div>"
                                                            +"</div>"
                                                            +"<div class='img_calib'><img src='images/" + data[iter].photo_link + "'></div>"
                                                            + "</div>");
                                                    joystickVerifyContainer.append("<div class='realtime_joysticks_val id" + data[iter].id + "' data-symb='" + data[iter].symbol_name + "' data-standard='" + data[iter].standard_name + "' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            + "<div class='joystick_val_info'>"
                                                            + "<div class='title_verify'>" + data[iter].description + "</div>"
                                                            + "<button class='verify_calibration id" + data[iter].id + "' data-long='" + data[iter].calib_subindex_x + "' data-lat='" + data[iter].calib_subindex_y + "' data-id='" + data[iter].id + "'>Verify</button> "
                                                            + "<button class='stop_calibration_verif id" + data[iter].id + " hidden' data-id='" + data[iter].id + "'>Stop</button><br><br>"
                                                            + "<div class='bloc_pourcentage'>"
                                                                + "<div class='title'>Final Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>X : </span><span class='x_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='minx_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='maxx_value_joy'>0</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Y : </span><span class='y_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='miny_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='maxy_value_joy'>0</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "<div class='bloc_raw_data'>"
                                                                + "<div class='title'>Raw Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                               + "<span class='text_config'>Zero X : </span><span class='raw_zero_x get_val'  data-descri='zero_x'>-</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='raw_min_x get_val'  data-descri='left'>-</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='raw_max_x get_val'  data-descri='right'>-</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Zero Y : </span><span class='raw_zero_y get_val' data-descri='zero_y'>-</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='raw_min_y get_val' data-descri='bottom'>-</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='raw_max_y get_val' data-descri='top'>-</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "</div>"
                                                            + "</div>");
                                                    break;
                                                case "mushroom":
                                                    joystickCalibrationContainer.append("<div class='bloc_calibrate id" + data[iter].id + " mushroom' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            +"<div class='bloc_gestion_calib'>"
                                                                + "<div class='title_jauge'>" + data[iter].description + "</div>"
                                                                + "<div class='calibrate_bt'>"
                                                                + "<button class='mushroom' data-mush='" + data[iter].calib_subindex_x + "' data-id='" + data[iter].id + "'>Calibrate</button>"
                                                                + "<div class='calibrate_tool hidden'>"
                                                                + "<div class='status_calib'></div>"
                                                                + "<div class='action_calib'></div>"
                                                                + "<div class='validate_calib'>Validate</div>"
                                                                + "</div>"
                                                                + "</div>"
                                                            +"</div>"
                                                            +"<div class='img_calib'><img src='images/" + data[iter].photo_link + "'></div>"
                                                            + "</div>");                                                           
                                                            
                                                    joystickVerifyContainer.append("<div class='mushroom_verify realtime_joysticks_val id" + data[iter].id + "' data-symb='" + data[iter].symbol_name + "' data-standard='" + data[iter].standard_name + "' data-minaxis='-' data-maxaxis='-' data-minzero='-' data-maxzero='-'>"
                                                            + "<div class='joystick_val_info'>"
                                                            + "<div class='title_verify'>" + data[iter].description + "</div>"
                                                            + "<button class='mushroom verify_calibration id" + data[iter].id + "' data-mush='" + data[iter].calib_subindex_x + "' data-id='" + data[iter].id + "'>Verify</button> "
                                                            + "<button class='mushroom stop_calibration_verif id" + data[iter].id + " hidden' data-id='" + data[iter].id + "'>Stop</button><br><br>"
                                                            + "<div class='bloc_pourcentage'>"
                                                                + "<div class='title'>Final Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>X : </span><span class='x_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='minx_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='maxx_value_joy'>0</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Y : </span><span class='y_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='miny_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='maxy_value_joy'>0</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "<div class='bloc_raw_data mushroom'>"
                                                                + "<div class='title'>Raw Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>Axis Raw X : </span><span class='axis_raw_x get_val'  data-descri='axis_raw_x'>-</span><br>"
                                                                + "<span class='text_config'>Zero Dead X : </span><span class='zero_dead_x get_val'  data-descri='zero_dead_x'>-</span><br>"
                                                                + "<span class='text_config'>Fix Slope X : </span><span class='fix_slope_x get_val'  data-descri='fix_slope_x'>-</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Axis Raw Y : </span><span class='axis_raw_y get_val' data-descri='axis_raw_y'>-</span><br>"
                                                                + "<span class='text_config'>Zero Dead Y : </span><span class='zero_dead_y get_val' data-descri='zero_dead_y'>-</span><br>"
                                                                + "<span class='text_config'>Fix Slope Y : </span><span class='fix_slope_y get_val' data-descri='fix_slope_y'>-</span><br>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "</div>"
                                                            + "</div>");
                                                    break;
                                            }
                                        }
                                        //gestion des boutons de test des leds et buzzers
                                        $(".test_bt").on('click', function () {
                                            var _this = $(this);
                                            var description = $(this).data('name');
                                            var press = $(this).data('press');
                                            var release = $(this).data('release');
                                            var canId = $(this).data('canid');
                                            var dlc = "0" + (press.toString().length / 2) + "0000";
                                            var signalStart = "002400806d68d7551407f09b861e3aad000549a844" + dlc + canId + press;
                                            var signalStop = "002400806d68d7551407f09b861e3aad000549a844" + dlc + canId + release;

                                            testPoppin.html("<div class='title'>" + description + "</div><div class='bt_test'><div class='bouton_grey start_bt'>Start</div><div class='bouton_grey stop_bt'>Stop</div></div><div class='result_test'>Did something happen as expected ?</div><div class='bt_test_result'><div class='bouton_grey yes_bt'>YES</div><div class='bouton_grey no_bt'>NO</div></div>");

                                            testPoppin.find(".title").html(description);
                                            testPoppin.removeClass("hidden");

                                            testPoppin.find(".start_bt").on('click', function () {
                                                sendSignal(signalStart);
                                            });
                                            testPoppin.find(".stop_bt").on('click', function () {
                                                sendSignal(signalStop);
                                            });
                                            testPoppin.find(".yes_bt").on('click', function () {
                                                testPoppin.empty();
                                                testPoppin.addClass("hidden");
                                                _this.css('background-color', 'yellowgreen');
                                                _this.html('TEST OK');
                                                _this.parent().addClass("tested");
                                                _this.parent().addClass("testok");
                                            });
                                            testPoppin.find(".no_bt").on('click', function () {
                                                testPoppin.empty();
                                                testPoppin.addClass("hidden");
                                                _this.css('background-color', 'red');
                                                _this.html('TEST FAIL');
                                                _this.parent().addClass("tested");
                                            });
                                        });

                                        $(".totest").on('click', function () {
                                            if ($(this).hasClass("tested")) {
                                                $(this).html("Not tested");
                                                $(this).removeClass("tested");
                                                $(this).parent().removeClass("tested");
                                            } else {
                                                $(this).html("Tested");
                                                $(this).addClass("tested");
                                                $(this).parent().addClass("tested");
                                            }
                                        });

                                        calibrateContainer.find(".calibrate_bt button").on('click', function () {
                                            var id = $(this).data('id');
                                            $(this).addClass("hidden");
                                            if ($(this).hasClass('mushroom')) {
                                                var subindex = $(this).data('mush');
                                                startCalibrateMushroom(subindex, id);
                                            } else {
                                                var subindexX = $(this).data('long');
                                                var subindexY = $(this).data('lat');
                                                startCalibrate(subindexX, subindexY, id);
                                            }

                                        });
                                        $(".verify_calibration").on('click', function () {
                                            if($(this).hasClass("mushroom")){
                                                var identifier = $(this).data('id');
                                                var subindex = $(this).data('mush');
                                                startVerifyCalibrationMushroom(subindex,identifier);
                                            }else{
                                                var subindexX = $(this).data('long');
                                                var subindexY = $(this).data('lat');
                                                var identifier = $(this).data('id');
                                                if (subindexX == "") {
                                                    subindexX = "null"
                                                }
                                                if (subindexY == "") {
                                                    subindexY = "null"
                                                }
                                                startVerifyCalibration(subindexX, subindexY, identifier);
                                            }
                                           
                                        });
                                        $(".stop_calibration_verif").on('click', function () {
                                            var identifier = $(this).data('id');
                                            stopVerifyCalibration(identifier);
                                        });

                                    }
                                });
                            }
                        });
                    } else {
                        alert("This user does not have access rights for this section.");
                        $("#content_home .information").addClass("hidden");
                        $(".head_userinfo").addClass("hidden");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while trying to access database.");
                    $("#content_home .information").addClass("hidden");
                    $(".head_userinfo").addClass("hidden");
                }
            });

        } else {
            alert("Some fields are missing");
            $("#content_home .information").addClass("hidden");
            $(".head_userinfo").addClass("hidden");
        }

    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// HOMEPAGE MANUFACTURING  //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //CONNEXION SECTION MANUFACTURING
    $("#send_info_login_manufacturing").on('click', function () {
        //alert(addHexVal("00000580", nodeID));
        userSSO = ($(".login_manufacturing #user_sso_input_manufacturing").val());
        partNumber = ($(".login_manufacturing #part_number_input_manufacturing").val());
        serialNumber = ($(".login_manufacturing #serial_number_input_manufacturing").val());

        //definition des id
        cobID1 = addHexVal("00000580", nodeID);
        cobID2 = addHexVal("00000600", nodeID);

        if (userSSO !== "" && partNumber !== "" && serialNumber !== "") {
            $.ajax({
                url: 'php/api.php?function=check_user_sso&param1=' + userSSO,
                type: 'GET',
                dataType: 'JSON',
                success: function (data, statut) {
                    userInfo = data;
                    if (userInfo.length == 0) {
                        alert("No result found with this SSO : " + userSSO);
                        $("#content_homeM .information").addClass("hidden");
                        $("#content_homeM .commentary_bloc").addClass("hidden");
                        $("#content_homeM .information_manufacturing").addClass("hidden");
                        $(".head_userinfo").addClass("hidden");
                    } else if (userInfo[0].user_role == "MANU" || userInfo[0].user_role == "INGE") {
                        $.ajax({
                            url: 'php/api.php?function=get_tsui_repair&param1=' + partNumber,
                            type: 'GET',
                            dataType: 'JSON',
                            success: function (data, statut) {
                                if (data.length == 0) {
                                    alert("No result found with this part number.")
                                } else {
                                    modeManufacturing = 1 ;
                                    familyName = data[0].name;
                                    var photo = data[0].photo_link;
                                    family_id = data[0].family;
                                    tstName = data[0].tst_name;
                                    sectionRepair = "finaltest";
                                    globalName = data[0].family_name;
                                    modelName = data[0].model;
                                    typeChoice = data[0].type;
                                    switchNb = data[0].switch_pos_number;
                                    hasServiceBt = data[0].has_service_bt;
                                    shouldHaveSRTL = data[0].has_SRTL;
                                    setInitialDisplayByModel(globalName, modelName, typeChoice);
                                    
                                    $(".photo_tsui").attr('src', 'images/' + photo);
                                    $(".title_bloc.name").html(familyName);
                                    $(".sso_user").html(userSSO);
                                    $(".part_number").html(partNumber);
                                    $(".serial_number").html(serialNumber);
                                    $("#content_homeM .information").removeClass("hidden");
                                    $("#content_homeM .information_manufacturing").removeClass("hidden");
                                    $("#content_homeM .commentary_bloc").removeClass("hidden");
                                    $(".head_userinfo").removeClass("hidden");
                                    $(".head_userinfo .info .role_user").html("Manufacturing");
                                    $(".popup_test_fw .bt_no").addClass(sectionRepair);
                                    $(".popup_test_fw .bt_yes").addClass(sectionRepair);

                                    
                                    setGenericMessages(globalName.trim());
                                    setTimeout(function(){
                                        getInfoCard(globalName, cobID2);
                                    },500);
                                    checkSN(serialNumber);
                                    
                                    displayCalibrationTest(switchNb, hasServiceBt);
                                    if(parseInt(switchNb) > 0){
                                        fillSwitchTest(switchNb);
                                    }
                                }
                                //Recupération du dictionnaire correspondant + remplissage du tableau diagnostique
                                $.ajax({
                                    url: 'php/api.php?function=get_dictionaries_by_id&param1=' + family_id,
                                    type: 'GET',
                                    dataType: 'JSON',
                                    success: function (data, statut) {
                                        dictionary = data;
                                        var len = data.length;
                                        joystickCalibrationContainer.empty();
                                        joystickVerifyContainer.empty();
                                        $(".joystick_container_new").empty();
                                        
                                        for (var iter = 0; iter < len; iter++) {
                                            switch (data[iter].type) {
                                                case "joystick":
                                                    joystickCalibrationContainer.append("<div class='bloc_calibrate id" + data[iter].id + "' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            +"<div class='bloc_gestion_calib'>"
                                                                + "<div class='title_jauge'>" + data[iter].description + "</div>"
                                                                + "<div class='calibrate_bt'>"
                                                                + "<button data-long='" + data[iter].calib_subindex_x + "' data-lat='" + data[iter].calib_subindex_y + "' data-id='" + data[iter].id + "'>Calibrate</button>"
                                                                + "<div class='calibrate_tool hidden'>"
                                                                + "<div class='status_calib'></div>"
                                                                + "<div class='action_calib'></div>"
                                                                + "<div class='validate_calib'>Validate</div>"
                                                                + "</div>"
                                                                + "</div>"
                                                            +"</div>"
                                                            +"<div class='img_calib'><img src='images/" + data[iter].photo_link + "'></div>"
                                                            + "</div>");
                                                    joystickVerifyContainer.append("<div class='realtime_joysticks_val id" + data[iter].id + "' data-symb='" + data[iter].symbol_name + "' data-standard='" + data[iter].standard_name + "' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            + "<div class='joystick_val_info'>"
                                                            + "<div class='title_verify'>" + data[iter].description + "</div>"
                                                            + "<button class='verify_calibration id" + data[iter].id + "' data-long='" + data[iter].calib_subindex_x + "' data-lat='" + data[iter].calib_subindex_y + "' data-id='" + data[iter].id + "'>Verify</button> "
                                                            + "<button class='stop_calibration_verif id" + data[iter].id + " hidden' data-id='" + data[iter].id + "'>Stop</button><br><br>"
                                                            + "<div class='bloc_pourcentage'>"
                                                                + "<div class='title'>Final Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>X : </span><span class='x_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='minx_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='maxx_value_joy'>0</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Y : </span><span class='y_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='miny_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='maxy_value_joy'>0</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "<div class='bloc_raw_data'>"
                                                                + "<div class='title'>Raw Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                               + "<span class='text_config'>Zero X : </span><span class='raw_zero_x get_val'  data-descri='zero_x'>-</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='raw_min_x get_val'  data-descri='left'>-</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='raw_max_x get_val'  data-descri='right'>-</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Zero Y : </span><span class='raw_zero_y get_val' data-descri='zero_y'>-</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='raw_min_y get_val' data-descri='bottom'>-</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='raw_max_y get_val' data-descri='top'>-</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "</div>"
                                                            + "</div>");
                                                    break;
                                                case "mushroom":
                                                    joystickCalibrationContainer.append("<div class='bloc_calibrate id" + data[iter].id + " mushroom' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            +"<div class='bloc_gestion_calib'>"
                                                                + "<div class='title_jauge'>" + data[iter].description + "</div>"
                                                                + "<div class='calibrate_bt'>"
                                                                + "<button class='mushroom' data-mush='" + data[iter].calib_subindex_x + "' data-id='" + data[iter].id + "'>Calibrate</button>"
                                                                + "<div class='calibrate_tool hidden'>"
                                                                + "<div class='status_calib'></div>"
                                                                + "<div class='action_calib'></div>"
                                                                + "<div class='validate_calib'>Validate</div>"
                                                                + "</div>"
                                                                + "</div>"
                                                            +"</div>"
                                                            +"<div class='img_calib'><img src='images/" + data[iter].photo_link + "'></div>"
                                                            + "</div>");                                                           
                                                            
                                                    joystickVerifyContainer.append("<div class='mushroom_verify realtime_joysticks_val id" + data[iter].id + "' data-symb='" + data[iter].symbol_name + "' data-standard='" + data[iter].standard_name + "' data-minaxis='-' data-maxaxis='-' data-minzero='-' data-maxzero='-'>"
                                                            + "<div class='joystick_val_info'>"
                                                            + "<div class='title_verify'>" + data[iter].description + "</div>"
                                                            + "<button class='mushroom verify_calibration id" + data[iter].id + "' data-mush='" + data[iter].calib_subindex_x + "' data-id='" + data[iter].id + "'>Verify</button> "
                                                            + "<button class='mushroom stop_calibration_verif id" + data[iter].id + " hidden' data-id='" + data[iter].id + "'>Stop</button><br><br>"
                                                            + "<div class='bloc_pourcentage'>"
                                                                + "<div class='title'>Final Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>X : </span><span class='x_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='minx_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='maxx_value_joy'>0</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Y : </span><span class='y_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='miny_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='maxy_value_joy'>0</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "<div class='bloc_raw_data mushroom'>"
                                                                + "<div class='title'>Raw Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>Axis Raw X : </span><span class='axis_raw_x get_val'  data-descri='axis_raw_x'>-</span><br>"
                                                                + "<span class='text_config'>Zero Dead X : </span><span class='zero_dead_x get_val'  data-descri='zero_dead_x'>-</span><br>"
                                                                + "<span class='text_config'>Fix Slope X : </span><span class='fix_slope_x get_val'  data-descri='fix_slope_x'>-</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Axis Raw Y : </span><span class='axis_raw_y get_val' data-descri='axis_raw_y'>-</span><br>"
                                                                + "<span class='text_config'>Zero Dead Y : </span><span class='zero_dead_y get_val' data-descri='zero_dead_y'>-</span><br>"
                                                                + "<span class='text_config'>Fix Slope Y : </span><span class='fix_slope_y get_val' data-descri='fix_slope_y'>-</span><br>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "</div>"
                                                            + "</div>");
                                                    break;
                                            }
                                        }                                       
                                        
                                        calibrateContainer.find(".calibrate_bt button").on('click', function () {
                                            var id = $(this).data('id');
                                            $(this).addClass("hidden");
                                            if ($(this).hasClass('mushroom')) {
                                                var subindex = $(this).data('mush');
                                                startCalibrateMushroom(subindex, id);
                                            } else {
                                                var subindexX = $(this).data('long');
                                                var subindexY = $(this).data('lat');
                                                startCalibrate(subindexX, subindexY, id);
                                            }

                                        });
                                        $(".verify_calibration").on('click', function () {
                                            if($(this).hasClass("mushroom")){
                                                var identifier = $(this).data('id');
                                                var subindex = $(this).data('mush');
                                                startVerifyCalibrationMushroom(subindex,identifier);
                                            }else{
                                                var subindexX = $(this).data('long');
                                                var subindexY = $(this).data('lat');
                                                var identifier = $(this).data('id');
                                                if (subindexX == "") {
                                                    subindexX = "null"
                                                }
                                                if (subindexY == "") {
                                                    subindexY = "null"
                                                }
                                                startVerifyCalibration(subindexX, subindexY, identifier);
                                            }
                                           
                                        });
                                        $(".stop_calibration_verif").on('click', function () {
                                            var identifier = $(this).data('id');
                                            stopVerifyCalibration(identifier);
                                        });

                                    }
                                });
                            }
                        });
                    } else {
                        alert("This user does not have access rights for this section.");
                        $("#content_homeM .information").addClass("hidden");
                        $("#content_homeM .commentary_bloc").addClass("hidden");
                        $("#content_homeM .information_manufacturing").addClass("hidden");
                        $(".head_userinfo").addClass("hidden");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while trying to access database.");
                    $("#content_homeM .information").addClass("hidden");
                    $("#content_homeM .commentary_bloc").addClass("hidden");
                    $("#content_homeM .information_manufacturing").addClass("hidden");
                    $(".head_userinfo").addClass("hidden");
                }
            });

        } else {
            alert("Some fields are missing");
            $("#content_homeM .information").addClass("hidden");
            $("#content_homeM .commentary_bloc").addClass("hidden");
            $("#content_homeM .information_manufacturing").addClass("hidden");
            $(".head_userinfo").addClass("hidden");
        }

    });




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// HOMEPAGE ENGINEERING  ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //recupération des infos tsui homepage INGE
    $("#send_info_hp_E").on('click', function () {
        //sendSignal("00240080000000000000000000000000000000000008000606220210FFFFFFFFFFFFFFFF");
        //alert(addHexVal("00000580", nodeID));
        userSSO = ($("#user_sso_input_E").val());
        familyChoice = ($("#family_choice").html().trim());
        modelChoice = ($("#model_choice").html().trim());
        typeChoice = ($("#type_choice").html().trim());

        //definition des id
        cobID1 = addHexVal("00000580", nodeID);
        cobID2 = addHexVal("00000600", nodeID);


        if (userSSO !== "" && familyChoice !== "" && modelChoice !== "") {
            $.ajax({
                url: 'php/api.php?function=check_user_sso&param1=' + userSSO,
                type: 'GET',
                dataType: 'JSON',
                success: function (data, statut) {
                    userInfo = data;
                    if (userInfo.length == 0) {
                        alert("No result found with this SSO : " + userSSO);
                    } else if (userInfo[0].user_role == "INGE") {
                        $.ajax({
                            url: 'php/api.php?function=get_tsui&param1=' + familyChoice + '&param2=' + modelChoice + '&param3=' + typeChoice,
                            type: 'GET',
                            dataType: 'JSON',
                            success: function (data, statut) {                                
                                if (data.length == 0) {
                                    alert("No result found with this part number." + familyChoice)
                                } else {
                                    familyName = data[0].name;
                                    var photo = data[0].photo_link;
                                    family_id = data[0].family;
                                    switchPosNumber = data[0].switch_pos_number;
                                    globalName = data[0].family_name;
                                    modelName = data[0].model;
                                    typeChoice = data[0].type;
                                    setInitialDisplayByModel(globalName, modelName, typeChoice);
                                    
                                    $("#content_toolbox .title_main").html("Toolbox - "+globalName+" "+modelName);
                                    $(".actual_node_id").html(nodeID);
                                    $(".photo_tsui").attr('src', 'images/' + photo);
                                    if (typeChoice != "" && typeChoice != " ") {
                                        $(".title_bloc.name").html(familyName + " - " + typeChoice);
                                    } else {
                                        $(".title_bloc.name").html(familyName);
                                    }

                                    $(".sso_user").html(userSSO);
                                    $(".part_number").html(partNumber);
                                    $(".serial_number").html(serialNumber);
                                    $("#content_homeE .information").removeClass("hidden");
                                    $(".head_userinfo").removeClass("hidden");
                                    $(".head_userinfo .info .role_user").html("Engineering");
                                    modeEngineering = 1;
                                    
                                    setGenericMessages(globalName.trim());
                                    setTimeout(function(){
                                        getInfoCard(globalName, cobID2);
                                    },500)
                                }
                                //Recupération du dictionnaire correspondant + remplissage des zones toolbox
                                $.ajax({
                                    url: 'php/api.php?function=get_dictionaries_by_id&param1=' + family_id,
                                    type: 'GET',
                                    dataType: 'JSON',
                                    success: function (data, statut) {
                                        dictionary = data;
                                        var len = data.length;                                                                            
                                        for (var iter = 0; iter < len; iter++) {
                                            switch (data[iter].zone) {
                                                case "0":
                                                    if (data[iter].is_led == "1") {
                                                        zone0.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-dim='" + data[iter].dim_signal + "' data-flash='" + data[iter].flash_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                                    }  else if (data[iter].is_led == "2") {
                                                        zone0.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch special on'>O:<img src='images/switch_off.png'></span></div></div>");
                                                    }  else {
                                                        zone0.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri' style='width: 230px;'>" + data[iter].description + "</span></div></div>");
                                                    }
                                                    zone0.parent().removeClass("hidden");
                                                    break;
                                                case "1":
                                                    if (data[iter].is_led == "1") {
                                                        zone1.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-dim='" + data[iter].dim_signal + "' data-flash='" + data[iter].flash_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                                    } else if (data[iter].is_led == "2") {
                                                        zone1.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch special on'>O:<img src='images/switch_off.png'></span></div></div>");
                                                    } else if (data[iter].is_led == "2") {
                                                        zone1.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch special on'>O:<img src='images/switch_off.png'></span></div></div>");
                                                    }
                                                    else {
                                                        zone1.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri' style='width: 230px;'>" + data[iter].description + "</span></div></div>");
                                                    }
                                                    zone1.parent().removeClass("hidden");
                                                    break;
                                                case "2":
                                                    if (data[iter].is_led == "1") {
                                                        zone2.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-dim='" + data[iter].dim_signal + "' data-flash='" + data[iter].flash_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                                    } else if (data[iter].is_led == "2") {
                                                        zone2.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch special on'>O:<img src='images/switch_off.png'></span></div></div>");
                                                    } else {
                                                        zone2.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri' style='width: 230px;'>" + data[iter].description + "</span></div></div>");
                                                    }
                                                    zone2.parent().removeClass("hidden");
                                                    break;
                                                case "3":
                                                    if (data[iter].is_led == "1") {
                                                        zone3.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-dim='" + data[iter].dim_signal + "' data-flash='" + data[iter].flash_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                                        zone3.parent().removeClass("hidden");
                                                    } else {
                                                        zone3.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri' style='width: 230px;'>" + data[iter].description + "</span></div></div>");
                                                        zone3.parent().removeClass("hidden");
                                                    }
                                                                    
                                                    break;
                                            }
                                            switch (data[iter].type) {
                                                case "buzzer":
                                                    buzzerContainer.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "'><div class='info_component'><span class='descri'>" + data[iter].description + "</span><span class='switch on'>O:<img src='images/switch_off.png'></span></div></div>");
                                                    buzzerContainer.parent().removeClass("hidden");
                                                    break; 
                                                case "display":
                                                    displayContainer.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "' data-on='" + data[iter].on_signal + "' data-off='" + data[iter].off_signal + "' data-dim='" + data[iter].dim_signal + "' data-flash='" + data[iter].flash_signal + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                                    displayContainer.parent().removeClass("hidden");
                                                    break;
                                                case "joystick":
                                                    joystickContainerNew.append("<div class='new_joystick' id='id" + data[iter].id + "'><div class='name'>" + data[iter].description + "</div><div class='area_visual'><div class='area_etalon'><img class='cursor' src='images/cross_red.png'></div></div><div class='values'>x : <span class='x_val'></span> y : <span class='y_val'></span></div></div>");
                                                    joystickCalibrationContainer.append("<div class='bloc_calibrate id" + data[iter].id + "' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            +"<div class='bloc_gestion_calib'>"
                                                                + "<div class='title_jauge'>" + data[iter].description + "</div>"
                                                                + "<div class='calibrate_bt'>"
                                                                + "<button data-long='" + data[iter].calib_subindex_x + "' data-lat='" + data[iter].calib_subindex_y + "' data-id='" + data[iter].id + "'>Calibrate</button>"
                                                                + "<div class='calibrate_tool hidden'>"
                                                                + "<div class='status_calib'></div>"
                                                                + "<div class='action_calib'></div>"
                                                                + "<div class='validate_calib'>Validate</div>"
                                                                + "</div>"
                                                                + "</div>"
                                                            +"</div>"
                                                            +"<div class='img_calib'><img src='images/" + data[iter].photo_link + "'></div>"
                                                            + "</div>");
                                                    joystickVerifyContainer.append("<div class='realtime_joysticks_val id" + data[iter].id + "' data-symb='" + data[iter].symbol_name + "' data-standard='" + data[iter].standard_name + "' data-minaxis='-' data-maxaxis='-' data-minzero='-' data-maxzero='-'>"
                                                            + "<div class='joystick_val_info'>"
                                                            + "<div class='title_verify'>" + data[iter].description + "</div>"
                                                            + "<button class='verify_calibration id" + data[iter].id + "' data-long='" + data[iter].calib_subindex_x + "' data-lat='" + data[iter].calib_subindex_y + "' data-id='" + data[iter].id + "'>Verify</button> "
                                                            + "<button class='stop_calibration_verif id" + data[iter].id + " hidden' data-id='" + data[iter].id + "'>Stop</button><br><br>"
                                                            + "<div class='bloc_pourcentage'>"
                                                                + "<div class='title'>Final Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>X : </span><span class='x_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='minx_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='maxx_value_joy'>0</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Y : </span><span class='y_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='miny_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='maxy_value_joy'>0</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "<div class='bloc_raw_data'>"
                                                                + "<div class='title'>Axis Raw (RAM)</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>Zero X : </span><span class='raw_zero_x get_val'  data-descri='zero_x'>-</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='raw_min_x get_val'  data-descri='left'>-</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='raw_max_x get_val'  data-descri='right'>-</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Zero Y : </span><span class='raw_zero_y get_val' data-descri='zero_y'>-</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='raw_min_y get_val' data-descri='bottom'>-</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='raw_max_y get_val' data-descri='top'>-</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "</div>"
                                                            + "</div>");
                                                    break;
                                                case "mushroom":
                                                    joystickContainerNew.append("<div class='new_joystick' id='id" + data[iter].id + "'><div class='name'>" + data[iter].description + "</div><div class='area_visual'><div class='area_etalon'><img class='cursor' src='images/cross_red.png'></div></div><div class='values'>x : <span class='x_val'></span> y : <span class='y_val'></span></div></div>");
                                                    joystickCalibrationContainer.append("<div class='bloc_calibrate id" + data[iter].id + " mushroom' data-minaxis='" + data[iter].threshold_min_axis + "' data-maxaxis='" + data[iter].threshold_max_axis + "' data-minzero='" + data[iter].threshold_min_zero + "' data-maxzero='" + data[iter].threshold_max_zero + "'>"
                                                            +"<div class='bloc_gestion_calib'>"
                                                                + "<div class='title_jauge'>" + data[iter].description + "</div>"
                                                                + "<div class='calibrate_bt'>"
                                                                + "<button class='mushroom' data-mush='" + data[iter].calib_subindex_x + "' data-id='" + data[iter].id + "'>Calibrate</button>"
                                                                + "<div class='calibrate_tool hidden'>"
                                                                + "<div class='status_calib'></div>"
                                                                + "<div class='action_calib'></div>"
                                                                + "<div class='validate_calib'>Validate</div>"
                                                                + "</div>"
                                                                + "</div>"
                                                            +"</div>"
                                                            +"<div class='img_calib'><img src='images/" + data[iter].photo_link + "'></div>"
                                                            + "</div>");                                                           
                                                            
                                                    joystickVerifyContainer.append("<div class='mushroom_verify realtime_joysticks_val id" + data[iter].id + "' data-symb='" + data[iter].symbol_name + "' data-standard='" + data[iter].standard_name + "'>"
                                                            + "<div class='joystick_val_info'>"
                                                            + "<div class='title_verify'>" + data[iter].description + "</div>"
                                                            + "<button class='mushroom verify_calibration id" + data[iter].id + "' data-mush='" + data[iter].calib_subindex_x + "' data-id='" + data[iter].id + "'>Verify</button> "
                                                            + "<button class='mushroom stop_calibration_verif id" + data[iter].id + " hidden' data-id='" + data[iter].id + "'>Stop</button><br><br>"
                                                            + "<div class='bloc_pourcentage'>"
                                                                + "<div class='title'>Final Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>X : </span><span class='x_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min X : </span><span class='minx_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max X : </span><span class='maxx_value_joy'>0</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Y : </span><span class='y_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Min Y : </span><span class='miny_value_joy'>0</span><br>"
                                                                + "<span class='text_config'>Max Y : </span><span class='maxy_value_joy'>0</span>"
                                                                + "</div>"                                                            
                                                            + "</div>"
                                                            + "<div class='bloc_raw_data mushroom'>"
                                                                + "<div class='title'>Raw Values</div>"
                                                                + "<div class='bloc_left_joy'>"
                                                                + "<span class='text_config'>Axis Raw X : </span><span class='axis_raw_x get_val'  data-descri='axis_raw_x'>-</span><br>"
                                                                + "<span class='text_config'>Zero Dead X : </span><span class='zero_dead_x get_val'  data-descri='zero_dead_x'>-</span><br>"
                                                                + "<span class='text_config'>Fix Slope X : </span><span class='fix_slope_x get_val'  data-descri='fix_slope_x'>-</span><br>"
                                                                + "</div>"
                                                                + "<div class='bloc_right_joy'>"
                                                                + "<span class='text_config'>Axis Raw Y : </span><span class='axis_raw_y get_val' data-descri='axis_raw_y'>-</span><br>"
                                                                + "<span class='text_config'>Zero Dead Y : </span><span class='zero_dead_y get_val' data-descri='zero_dead_y'>-</span><br>"
                                                                + "<span class='text_config'>Fix Slope Y : </span><span class='fix_slope_y get_val' data-descri='fix_slope_y'>-</span><br>"
                                                                + "</div>"                                                                                                       
                                                            + "</div>"
                                                            + "</div>"
                                                            + "</div>");
                                                    break;
                                            }
                                            if (data[iter].is_safety == "1") {
                                                safetyContainer.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span></div></div>");
                                                safetyContainer.removeClass("hidden");
                                            }
                                            if (data[iter].is_enable == "1") {
                                                enableContainer.append("<div class='diag_component id" + data[iter].id + "' data-id='" + data[iter].id + "' data-name='" + data[iter].symbol_name + "' data-function='" + data[iter].type + "'><span class='td photo_piece'><img src='images/" + data[iter].photo_link + "'></span><div class='info_component'><span class='symbol'>" + data[iter].symbol_name + "</span><span class='descri'>" + data[iter].description + "</span></div></div>");
                                                enableContainer.removeClass("hidden");
                                            }

                                        }
                                        if (globalName == "OMEGA") {
                                            diagInge.find(".switch").each(function(){
                                                if($(this).hasClass('dim')){
                                                    $(this).addClass("hidden");
                                                }
                                            })                                            
                                        }
                                        
                                        diagInge.find(".switch").on('click', function () {
                                            var postSignal = "002400806d68d7551407f09b861e3aad000549a844";

                                            var onSignal = $(this).parents(".diag_component").data("on");
                                            var offSignal = $(this).parents(".diag_component").data("off");
                                            var dimSignal = $(this).parents(".diag_component").data("dim");
                                            var flashSignal = $(this).parents(".diag_component").data("flash");

                                            if (globalName == "ELEGANCE") {
                                                var dlcCompletionSignal = "080000";
                                            } else {
                                                var dlcCompletionSignal = "0" + (((onSignal.length) - 8) / 2) + "0006";

                                            }
                                            
                                            if ($(this).hasClass("activated")) {
                                                diagInge.find(".switch img").attr('src', 'images/switch_off.png');
                                                $(this).removeClass("activated");
                                                sendSignal(postSignal + dlcCompletionSignal + offSignal);
                                                stopAllLED(globalName, modelName, typeChoice);
                                                clearInterval(intervalSpe);
                                            } else {
                                                stopAllLED(globalName, modelName, typeChoice);
                                                diagInge.find(".switch img").attr('src', 'images/switch_off.png');
                                                $(this).find("img").attr('src', 'images/switch_on.png');
                                                $(this).addClass("activated");
                                                if ($(this).hasClass('on')) {
                                                    sendSignal(postSignal + dlcCompletionSignal + onSignal);
                                                    if ($(this).hasClass('special')) {
                                                        intervalSpe = setInterval(function () {
                                                            sendSignal(postSignal + dlcCompletionSignal + onSignal);

                                                        }, 500);
                                                    }
                                                } else if ($(this).hasClass('dim')) {
                                                    sendSignal(postSignal + dlcCompletionSignal + dimSignal);
                                                } else if ($(this).hasClass('flash')) {
                                                    sendSignal(postSignal + dlcCompletionSignal + flashSignal);
                                                }
                                            }
                                        });
                                        calibrateContainer.find(".calibrate_bt button").on('click', function () {
                                            var id = $(this).data('id');
                                            $(this).addClass("hidden");
                                            if ($(this).hasClass('mushroom')) {
                                                var subindex = $(this).data('mush');
                                                startCalibrateMushroom(subindex, id);
                                            } else {
                                                var subindexX = $(this).data('long');
                                                var subindexY = $(this).data('lat');
                                                startCalibrate(subindexX, subindexY, id);
                                            }

                                        });

                                        $(".verify_calibration").on('click', function () {
                                            if($(this).hasClass("mushroom")){
                                                var identifier = $(this).data('id');
                                                var subindex = $(this).data('mush');
                                                startVerifyCalibrationMushroom(subindex,identifier);
                                            }else{
                                                var subindexX = $(this).data('long');
                                                var subindexY = $(this).data('lat');
                                                var identifier = $(this).data('id');
                                                if (subindexX == "") {
                                                    subindexX = "null"
                                                }
                                                if (subindexY == "") {
                                                    subindexY = "null"
                                                }
                                                startVerifyCalibration(subindexX, subindexY, identifier);
                                            }
                                        });
                                        
                                        $(".stop_calibration_verif").on('click', function () {
                                            var identifier = $(this).data('id');
                                            stopVerifyCalibration(identifier);
                                        });
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        alert("Error : can't get dictionnary.");
                                    }
                                });
                            }
                        });
                    } else {
                        alert("This user does not have access rights for this section.");
                        $("#content_homeE .information").addClass("hidden");
                        $(".head_userinfo").addClass("hidden");
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while trying to access database.");
                    $("#content_homeE .information").addClass("hidden");
                    $(".head_userinfo").addClass("hidden");
                }
            });

        } else {
            alert("Some fields are missing");
            $("#content_homeE .information").addClass("hidden");
            $(".head_userinfo").addClass("hidden");
        }
    });

    function getInfoCard(model, id) {
        _MODE = "CALIBRATION";
        pingGetInfo(model, id);
        if (model == "ELEGANCE") {
            setTimeout(function () {

                var newBootRelease = bootRelease.substring(6, 8) + "." + bootRelease.substring(4, 6);
                var newFPGARelease = FPGARelease.substring(6, 8) + FPGARelease.substring(4, 6) + "." + FPGARelease.substring(2, 4) + FPGARelease.substring(0, 2);
                var newsoftwareRelease = softwareRelease.substring(6, 8) + "." + softwareRelease.substring(4, 6);
                var newunicID = unicID.substring(14, 16) + "." + unicID.substring(12, 14) + "." + unicID.substring(10, 12) + "." + unicID.substring(8, 10) + " " + unicID.substring(6, 8) + "." + unicID.substring(4, 6) + "." + unicID.substring(2, 4) + "." + unicID.substring(0, 2);

                $(".boot_config").html(newsoftwareRelease);
                $(".fpga_config").html(newFPGARelease);
                $(".sw_config").html(newBootRelease);
                if (newBootRelease.substring(0, 1) == "c") {
                    FWcalibV = newBootRelease;
                } else {
                    FWfctV = newBootRelease;
                }
                SWv = newsoftwareRelease;

                $(".unic_config").html(newunicID);

                _MODE = "PRETEST";
            }, 1200);
        } else if(model == "OMEGA"){
            setTimeout(function () {
                softwareRelease = hex2a(softwareRelease);
                $(".boot_config").html("--");
                $(".fpga_config").html("--");
                $(".sw_config").html(softwareRelease);
                $(".unic_config").html("--");

                _MODE = "PRETEST";
            }, 2000);
        }

    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// ON MESSAGE WEBSOCKET  ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Traitement des données websocket 
    ws.onmessage = function (event) {
        switch (_MODE) {
            case "START":
                var message = JSON.parse(event.data);
                console.log("start_mode"+event.data);
                if (message.type == "from_GW") {
                    var canId = message.canId;
                    var canData = message.canData;
                    if (canData == "7f" || canData == "05" || canData == "00") {
                        nodeID = canId.substring(6, 8);
                        cobID1 = addHexVal("00000580", nodeID);
                        cobID2 = addHexVal("00000600", nodeID);
                        $(".actual_node_id").html(nodeID);
                    }
                }

                break;
            case "PRETEST":
                var message = JSON.parse(event.data);
                console.log(event.data);
                if (message.type == "from_GW") {
                    var canId = message.canId;
                    var canData = message.canData;
                    for (var nb = 0; nb < dictionary.length; nb++) {
                        var trueCanID = addHexVal(dictionary[nb].can_id, nodeID);
                        if (trueCanID === canId) {
                            switch (dictionary[nb].type) {
                                case "button":
                                    if (dictionary[nb].pressed_val === canData) {
                                        buttonContainer.find(".line.id" + dictionary[nb].id).addClass("pressed");
                                        buttonContainer.find(".line.id" + dictionary[nb].id).addClass("tested");
                                        buttonContainer.find(".line.id" + dictionary[nb].id + " .totest").addClass("tested");
                                        buttonContainer.find(".line.id" + dictionary[nb].id + " .totest").html("Tested");
                                    }
                                    if (dictionary[nb].released_val === canData) {
                                        buttonContainer.find(".line.id" + dictionary[nb].id).addClass("released");
                                        buttonContainer.find(".line.id" + dictionary[nb].id).addClass("tested");
                                        buttonContainer.find(".line.id" + dictionary[nb].id + " .totest").addClass("tested");
                                        buttonContainer.find(".line.id" + dictionary[nb].id + " .totest").html("Tested");
                                    }
                                    break;
                                case "joystick":
                                    var part0 = canData.substring(0, 2);
                                    var part1 = canData.substring(2, 4);
                                    var part2 = canData.substring(4, 6);
                                    var part3 = canData.substring(6, 8);
                                    var part4 = canData.substring(8, 10);
                                    var part5 = canData.substring(10, 12);
                                    var part6 = canData.substring(12, 14);
                                    var part7 = canData.substring(14, 16);

                                    if (part0 != "00") {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part0) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part0) + '%');

                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part0) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part0) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part1 != "00") {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part1) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part1) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part1) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part2 != "00") {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part2) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part2) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part2) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part2) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part3 != "00") {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part3) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part3) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part3) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part3) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part4 != "00") {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part4) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part4) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part4) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part4) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part5 != "00") {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part5) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part5) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part5) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part5) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part6 != "00") {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part6) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part6) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part6) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part6) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part7 != "00") {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part7) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part7) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part7) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values y_val').html(convertHexa(part7) + '%');

                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    break;
                                case "mushroom":
                                    var part0 = canData.substring(0, 2);
                                    var part1 = canData.substring(2, 4);
                                    var part2 = canData.substring(4, 6);
                                    var part3 = canData.substring(6, 8);
                                    var part4 = canData.substring(8, 10);
                                    var part5 = canData.substring(10, 12);
                                    var part6 = canData.substring(12, 14);
                                    var part7 = canData.substring(14, 16);

                                    if (part0 != "00") {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part0) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part0) + '%');

                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part0) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part0) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part1 != "00") {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part1) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part1) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part1) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part2 != "00") {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part2) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part2) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part2) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part2) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part3 != "00") {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part3) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part3) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part3) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part3) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part4 != "00") {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part4) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part4) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part4) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part4) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part5 != "00") {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part5) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part5) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part5) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part5) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part6 != "00") {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part6) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part6) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part6) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part6) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part7 != "00") {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part7) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part7) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part7) * -1) + '%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values y_val').html(convertHexa(part7) + '%');

                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNewRepair.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    break;
                                default:
                                //console.log("non indentifié");
                            }
                        }
                    }
                }
                break;
            case "TESTFINAL":
                var message = JSON.parse(event.data);
                console.log(event.data);
                if (message.type == "from_GW") {
                    var canId = message.canId;
                    var canData = message.canData;
                    if (waitingAction != "") {
                        switch (waitingAction) {
                            case "BUTTON":
                                if (waitingPressValue == canData) {                                   
                                    pressValueContinue = 1;
                                }
                                if (waitingReleaseValue == canData) {                                    
                                    releaseValueContinue = 1;
                                }
                                if (pressValueContinue == 1 && releaseValueContinue == 1) {
                                    validateTest = 1;
                                    waitingAction = "";
                                }
                                break;
                            case "ENABLE":
                                if (waitingPressValue == canData) {
                                    if (waitingEnableAndSafety == 1) {                                        
                                        setTimeout(function(){
                                            setEnableAndSafetyValues("enable");
                                        }, 50)                                        
                                    }
                                    pressValueContinue = 1;
                                }
                                if (waitingReleaseValue == canData) { 
                                    releaseValueContinue = 1;
                                    setTimeout(function(){
                                        setEnableAndSafetyValuesRel("enable");                                         
                                    }, 500)    
                                    
                                }
                                if (pressValueContinue == 1 && releaseValueContinue == 1 && hardwareValidation == 1 && hardwareValidationReleased == 1) {
                                    validateTest = 1;
                                    waitingAction = "";
                                }
                                break;
                            case "SAFETY":
                                if (waitingPressValue == canData) {
                                    if (waitingEnableAndSafety == 1) {                                        
                                        setTimeout(function(){
                                            setEnableAndSafetyValues("safety");
                                            console.log("après la fonction PRESS "+pressValueContinue+" "+releaseValueContinue+" "+hardwareValidation+" "+hardwareValidationReleased+"====================================================");
                                        }, 500)                                        
                                    }
                                    pressValueContinue = 1;
                                    //alert("press "+pressValueContinue+" /release "+ releaseValueContinue+" /hwpress "+ hardwareValidation+" /hwrelease "+ hardwareValidationReleased);
                                }
                                if (waitingReleaseValue == canData) { 
                                    console.log("on detecte un safety release ====================================================");
                                    releaseValueContinue = 1;
                                    setTimeout(function(){
                                        console.log("on declenche la fonction de set après 500ms ====================================================");    
                                        setEnableAndSafetyValuesRel("safety");       
                                        console.log("après la fonction REL "+pressValueContinue+" "+releaseValueContinue+" "+hardwareValidation+" "+hardwareValidationReleased+"====================================================");
                                    }, 500)                                  
                                //alert("press "+pressValueContinue+" /release "+ releaseValueContinue+" /hwpress "+ hardwareValidation+" /hwrelease "+ hardwareValidationReleased);
                                }
                                if (pressValueContinue == 1 && releaseValueContinue == 1 && hardwareValidation == 1 && hardwareValidationReleased == 1) {
                                    console.log("on entre dans la verif ===================================================="); 
                                    validateTest = 1;
                                    waitingAction = "";
                                }    else{
                                    console.log("on entre dans le ELSE (FALSE) de la verif ===================================================="); 
                                }
                                
                                break;
                            case "JOYSTICK_X_LEFT":
                                if (waitingID == canId) {
                                    var oct1 = parseInt(waitingXpos);
                                    var instant_value_joy = canData.substring(oct1, oct1 + 2);
                                    instant_value_joy = convertHexa(instant_value_joy);
                                    if (instant_value_joy < 0) {
                                        if (instant_value_joy <= last_value_joy) {
                                            console.log("last : " + last_value_joy, "instant : " + instant_value_joy);
                                            last_value_joy = instant_value_joy;
                                            if (instant_value_joy == -100) {
                                                descriptionFinal.html("Please move " + currDescription + " to RIGHT..");
                                                last_value_joy = 0;
                                                waitingAction = "JOYSTICK_X_RIGHT";
                                            }
                                        } else {
                                            console.log("ERROR last : " + last_value_joy, "instant : " + instant_value_joy)
                                            nextStepFinal("fail");
                                        }
                                    }

                                }
                                break;
                            case "JOYSTICK_X_RIGHT":
                                if (waitingID == canId) {
                                    var oct1 = parseInt(waitingXpos);
                                    var instant_value_joy = canData.substring(oct1, oct1 + 2);
                                    instant_value_joy = convertHexa(instant_value_joy);
                                    if (instant_value_joy > 0) {
                                        if (instant_value_joy >= last_value_joy) {
                                            console.log("last : " + last_value_joy, "instant : " + instant_value_joy);
                                            last_value_joy = instant_value_joy;
                                            if (instant_value_joy == 100) {
                                                if (waitingYpos != "") {
                                                    descriptionFinal.html("Please move " + currDescription + " to BOTTOM..");
                                                    waitingAction = "JOYSTICK_Y_BOTTOM";
                                                    last_value_joy = 0;
                                                } else {
                                                    validateTest = 1;
                                                }
                                            }
                                        } else {
                                            console.log("ERROR last : " + last_value_joy, "instant : " + instant_value_joy)
                                            nextStepFinal("fail");
                                        }
                                    }
                                }
                                break;
                            case "JOYSTICK_Y_BOTTOM":
                                if (waitingID == canId) {
                                    var oct1 = parseInt(waitingYpos);
                                    var instant_value_joy = canData.substring(oct1, oct1 + 2);
                                    instant_value_joy = convertHexa(instant_value_joy);
                                    if (instant_value_joy < 0) {
                                        if (instant_value_joy <= last_value_joy) {
                                            console.log("last : " + last_value_joy, "instant : " + instant_value_joy);
                                            last_value_joy = instant_value_joy;
                                            if (instant_value_joy == -100) {
                                                descriptionFinal.html("Please move " + currDescription + " to TOP..");
                                                last_value_joy = 0;
                                                waitingAction = "JOYSTICK_Y_TOP";
                                            }
                                        } else {
                                            console.log("ERROR last : " + last_value_joy, "instant : " + instant_value_joy)
                                            nextStepFinal("fail");
                                        }
                                    }
                                }
                                break;
                            case "JOYSTICK_Y_TOP":
                                if (waitingID == canId) {
                                    var oct1 = parseInt(waitingYpos);
                                    var instant_value_joy = canData.substring(oct1, oct1 + 2);
                                    instant_value_joy = convertHexa(instant_value_joy);
                                    if (instant_value_joy > 0) {
                                        if (instant_value_joy >= last_value_joy) {
                                            console.log("last : " + last_value_joy, "instant : " + instant_value_joy);
                                            last_value_joy = instant_value_joy;
                                            if (instant_value_joy == 100) {
                                                last_value_joy = 0;
                                                validateTest = 1;
                                                waitingAction = "";
                                            }
                                        } else {
                                            console.log("ERROR last : " + last_value_joy, "instant : " + instant_value_joy)
                                            nextStepFinal("fail");
                                        }
                                    }
                                }
                                break;
                        }
                    }
                } else if (message.type == "from_pic") {

                    var safetyFrequency = message.slf;
                    var safetyVoltage = message.slv;
                    var enableFrequency = message.enf;
                    var enableVoltage = message.env;
                    var srtl = message.srtl;
                    var globalVoltage = message.globv;
                    var tsuiVoltage = message.tsuiv;
                    var has_SRTL = message.has_srtl;
                    
                    safetySRTLfinal = srtl.substring(0, 1);
                    enableSRTLfinal = srtl.substring(1, 2);
                        
                        
                    safetyFrequency = convertHexaPic(safetyFrequency);
                    safetyVoltage = convertHexaPic(safetyVoltage) / 51 / 0.138;
                    enableFrequency = convertHexaPic(enableFrequency);
                    enableVoltage = convertHexaPic(enableVoltage) / 51 / 0.138;
                    globalVoltage = (convertHexaPic(globalVoltage) + 3) / 51 / 0.1375;
                    tsuiVoltage = (convertHexaPic(tsuiVoltage ) +3) / 51 / 0.1375;

                    hasSRTL = has_SRTL;
                    currEnableT = enableVoltage;
                    currEnableF = enableFrequency;
                    currSafetyT = safetyVoltage;
                    currSafetyF = safetyFrequency;
                    
                    currGlobalVoltage = globalVoltage;
                    currTsuiVoltage = tsuiVoltage;

                    console.log("val tens" + currEnableT + " " + currEnableF + " " + currGlobalVoltage + " " + currTsuiVoltage)

                }
                break;
            case "CALIBRATION":
                var message = JSON.parse(event.data);
                console.log(event.data);                
                if (message.type == "from_GW") {
                    var canId = message.canId;
                    var canData = message.canData;
                    if (waitCalibResponse !== "") {
                        var lengthData;
                        if (canId == waitCalibResponse) {
                            console.log("response detected");
                            lengthData = canData.substring(0, 2);
                            if (lengthData == "4f") {
                                finalResponseData = canData.substring(8, 10);
                            } else if (lengthData == "4b") {
                                finalResponseData = canData.substring(8, 12);
                            } else if (lengthData == "43") {
                                finalResponseData = canData.substring(8, 16);
                            } else {
                                finalResponseData = canData.substring(8, 14);
                            }
                            console.log(finalResponseData);
                            waitCalibResponse = "";
                        }
                    }
                    if (waitPingResponse !== "") {
                        if (canId == waitPingResponse) {
                            finalResponseData = canData;
                            waitPingResponse = "";
                        }

                    }
                    if (waitDownloadResponse !== "") {
                        //console.log("on detecte un waitresponse");
                        if (waitDownloadResponse == canId) {
                            console.log("canid = waitresponse" + canId + " " + waitDownloadResponse)
                            if (canData.substring(0, 2) == "20" || canData.substring(0, 2) == "30") {
                                continueDownload = 1;
                                //console.log("on a foutu le continue download a 1")
                            } else if (canData.substring(0, 2) == "80") {
                                continueDownload = 0;
                                waitDownloadResponse = "";
                            }
                        }
                    }
                    if (waitDownloadResponseOmega !== "") {
                        if (waitDownloadResponseOmega == canId) {
                            continueDownload = 1;
                        } else {
                            continueDownload = 0;
                        }
                    }
                }
                break;
            case "CALIBRATION_VERIFY":
                var message = JSON.parse(event.data);
                console.log(event.data);
                if (message.type == "from_GW") {
                    var canId = message.canId;
                    var canData = message.canData;

                    if (canId == cobID1) {
                        console.log("match " + currentIdentifier);
                        var subindex = canData.substring(6, 8);
                        var verifyVal = canData.substring(8, 10);
                        if (subindex == currentSubindexX) {
                            updateVerifyData(verifyVal, "x", currentIdentifier);
                        } else if (subindex == currentSubindexY) {
                            updateVerifyData(verifyVal, "y", currentIdentifier);
                        } else {
                            console.log("no match");
                        }

                    }
                }
                break;
            case "CALIBRATION_VERIFY_MUSHROOM":
                var message = JSON.parse(event.data);
                console.log(event.data);
                if (message.type == "from_GW") {
                    var canId = message.canId;
                    var canData = message.canData;

                    if (canId == cobID1) {
                        console.log("match " + currentIdentifier);
                        var subindex = canData.substring(6, 8);
                        var verifyVal = canData.substring(8, 10);
                        
                        if (subindex == "01") {
                            updateVerifyData(verifyVal, "x", currentIdentifier);
                        } else if (subindex == "02") {
                            updateVerifyData(verifyVal, "y", currentIdentifier);
                        } else {
                            console.log("no match");
                        }

                    }
                }
                break;
            case "BAD_CHECK":
                var message = JSON.parse(event.data);
                console.log(event.data);
                if (message.type == "from_GW") {
                    var canId = message.canId;
                    var canData = message.canData;
                    if (canId == cobID1 && canData.substring(0,8) == "4f006003") {                        
                        var result = canData.substring(8, 10);
                        if(result == "00"){
                            $(".bad_calibration .position_result span").html("RELEASED");
                        }else if(result == "40"){
                            $(".bad_calibration .position_result span").html("PRESSED");
                        }

                    }
                }
                break;
            case "TOOLBOX":
                var message = JSON.parse(event.data);
                console.log(event.data);
                if (message.type == "from_pic") {
                    counterDisplayFreqTens++;
                    
                    if(message.typeMsg == "E"){
                        var safetyFrequency = message.slf;
                        var safetyVoltage = message.slv;
                        var enableFrequency = message.enf;
                        var enableVoltage = message.env;
                        var srtl = message.srtl;
                        var globalVoltage = message.globv;
                        var tsuiVoltage = message.tsuiv;
                        var has_SRTL = message.has_srtl;

                        safetyFrequency = convertHexaPic(safetyFrequency);
                        safetyVoltage = convertHexaPic(safetyVoltage) / 51 / 0.138;
                        enableFrequency = convertHexaPic(enableFrequency);
                        enableVoltage = convertHexaPic(enableVoltage) / 51 / 0.138;
                        globalVoltage = (convertHexaPic(globalVoltage)+3) / 51 / 0.1375;
                        tsuiVoltage = (convertHexaPic(tsuiVoltage)+3) / 51 / 0.1375;
                        hasSRTL = has_SRTL;
                        
                        if(hasSRTL == 1){
                            $(".srtl_container .srtl").attr('src', 'images/switch_on.png')  
                        }else{
                            $(".srtl_container .srtl").attr('src', 'images/switch_off.png')  
                        }
                        
                        if(counterDisplayFreqTens == 20){
                            safetyFreqContainer.html(safetyFrequency);
                            safetyVoltContainer.html(safetyVoltage.toFixed(2));
                            enableFreqContainer.html(enableFrequency);
                            enableVoltContainer.html(enableVoltage.toFixed(2));
                            supplyContainer.html(tsuiVoltage.toFixed(2) + " V");

                            safetySRTL.html(srtl.substring(0, 1));
                            enableSRTL.html(srtl.substring(1, 2));
                            
                            counterDisplayFreqTens = 0;
                        }
                        
                    }else if(message.typeMsg == "T"){
                        var seuil = 22;
                        var latSwitch = message.latSwitch;
                        var autoposDR = message.autoposDR;
                        var globGantry = message.globGantry;
                        var sciFRTL = message.sciFRTL;
                        var sciLAT = message.sciLAT;
                        var tsuiVoltage = message.tsuiv;
                        var outCtStop = message.outCtStop;
                        
                        var globv = message.globv;
                        var tsuiSupply = message.tsuiSupply;
                        var FRTLgantry = message.FRTLgantry;
                        var unreg5 = message.unreg5;
                        var unreg12 = message.unreg12;
                        
                        var latLock = message.latLock;
                        var longLock = message.longLock;
                        var rotationLock = message.rotationLock;
                        var roomLight = message.roomLight;
                        
                        if(latLock > 0){latLockCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{latLockCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(longLock > 0){longLockCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{longLockCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(rotationLock > 0){rotationLockCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{rotationLockCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(roomLight > 0){roomLightCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{roomLightCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        latSwitch = convertHexaPic(latSwitch) / 51 / 0.138;
                        autoposDR = convertHexaPic(autoposDR) / 51 / 0.138;
                        globGantry = convertHexaPic(globGantry) / 51 / 0.138;
                        sciFRTL = convertHexaPic(sciFRTL) / 51 / 0.138;
                        sciLAT = convertHexaPic(sciLAT) / 51 / 0.138;
                        tsuiVoltage = (convertHexaPic(tsuiVoltage)+3) / 51 / 0.1375;
                        
                        globv = convertHexaPic(globv) / 51 / 0.138;
                        tsuiSupply = convertHexaPic(tsuiSupply) / 51 / 0.138;
                        FRTLgantry = convertHexaPic(FRTLgantry) / 51 / 0.138;
                        unreg5 = convertHexaPic(unreg5) / 51 / 0.37;
                        unreg12 = convertHexaPic(unreg12) / 51 / 0.175;
                        
                        supplyContainer.html(tsuiVoltage.toFixed(2) + " V");
                        
                        
                        latSwitchCtn.find(".value").html(latSwitch.toFixed(2)+ " V");
                        if(latSwitch > seuil){latSwitchCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{latSwitchCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        autoposDRCtn.find(".value").html(autoposDR.toFixed(2)+ " V");
                        if(autoposDR > seuil){autoposDRCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{autoposDRCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        globGantryCtn.find(".value").html(globGantry.toFixed(2)+ " V");
                        if(globGantry > seuil){globGantryCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{globGantryCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        sciFRTLCtn.find(".value").html(sciFRTL.toFixed(2)+ " V");
                        if(sciFRTL > seuil){sciFRTLCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{sciFRTLCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        sciLATCtn.find(".value").html(sciLAT.toFixed(2)+ " V");
                        if(sciLAT > seuil){sciLATCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{sciLATCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};  
                        
                        tsuiSupplyCtn.find(".value").html(tsuiSupply.toFixed(2)+ " V");
                        FRTLgantryCtn.find(".value").html(FRTLgantry.toFixed(2)+ " V");
                        unreg5Ctn.find(".value").html(unreg5.toFixed(2)+ " V");
                        unreg12Ctn.find(".value").html(unreg12.toFixed(2)+ " V");

                    
                    }else if(message.typeMsg == "S"){  
                        var seuil = 22;
                        var longEnable = message.longEnable;
                        var TBLtopPan = message.TBLtopPan;
                        var sc1LatDR = message.sc1LatDR;
                        var TBLtopUpDown = message.TBLtopUpDown;
                        var globGantry2 = message.globGantry2;
                        var globTable = message.globTable;
                        var FRTLlatGantry = message.FRTLlatGantry;
                        var latSwitch2 = message.latSwitch2;
                        var tsuiVoltage = message.tsuiv;
                        var globv = message.globv;
                        var tsuiSupply = message.tsuiSupply;
                        var FRTLgantry = message.FRTLgantry;
                        var unreg5 = message.unreg5;
                        var unreg12 = message.unreg12;
                        
                        var arm1 = message.arm1;
                        var handleConfSwitch = message.handleConfSwitch;
                        var arm2 = message.arm2;
                        var machineSwa = message.machineSwa;
                        var frontalSwa = message.frontalSwa;
                        var pivotMotionEnable = message.pivotMotionEnable;
                        var tblDriveDown = message.tblDriveDown;
                        var tblDriveUp = message.tblDriveUp;
                        
                        if(arm1 > 0){arm1Ctn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{arm1Ctn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(handleConfSwitch > 0){handleConfSwitchCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{handleConfSwitchCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(arm2 > 0){arm2Ctn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{arm2Ctn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(machineSwa > 0){machineSwaCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{machineSwaCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(frontalSwa > 0){frontalSwaCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{frontalSwaCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(pivotMotionEnable > 0){pivotMotionEnableCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{pivotMotionEnableCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(tblDriveDown > 0){tblDriveDownCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{tblDriveDownCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        if(tblDriveUp > 0){tblDriveUpCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{tblDriveUpCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        longEnable = convertHexaPic(longEnable) / 51 / 0.138;
                        TBLtopPan = convertHexaPic(TBLtopPan) / 51 / 0.138;
                        sc1LatDR = convertHexaPic(sc1LatDR) / 51 / 0.138;
                        TBLtopUpDown = convertHexaPic(TBLtopUpDown) / 51 / 0.138;
                        globGantry2 = convertHexaPic(globGantry2) / 51 / 0.138;
                        globTable = convertHexaPic(globTable) / 51 / 0.138;
                        FRTLlatGantry = convertHexaPic(FRTLlatGantry) / 51 / 0.138;
                        latSwitch2 = convertHexaPic(latSwitch2) / 51 / 0.138;
                        tsuiVoltage = (convertHexaPic(tsuiVoltage)+3) / 51 / 0.1375;
                        
                        globv = convertHexaPic(globv) / 51 / 0.138;
                        tsuiSupply = convertHexaPic(tsuiSupply) / 51 / 0.138;
                        FRTLgantry = convertHexaPic(FRTLgantry) / 51 / 0.138;
                        unreg5 = convertHexaPic(unreg5) / 51 / 0.37;
                        unreg12 = convertHexaPic(unreg12) / 51 / 0.175;
                        
                        supplyContainer.html(tsuiVoltage.toFixed(2) + " V");
                        
                        longEnableCtn.find(".value").html(longEnable.toFixed(2)+ " V");
                        if(longEnable > seuil){longEnableCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{longEnableCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        TBLtopPanCtn.find(".value").html(TBLtopPan.toFixed(2)+ " V");
                        if(TBLtopPan > seuil){TBLtopPanCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{TBLtopPanCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        sc1LatDRCtn.find(".value").html(sc1LatDR.toFixed(2)+ " V");
                        if(sc1LatDR > seuil){sc1LatDRCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{sc1LatDRCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        TBLtopUpDownCtn.find(".value").html(TBLtopUpDown.toFixed(2)+ " V");
                        if(TBLtopUpDown > seuil){TBLtopUpDownCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{TBLtopUpDownCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        globGantry2Ctn.find(".value").html(globGantry2.toFixed(2)+ " V");
                        if(globGantry2 > seuil){globGantry2Ctn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{globGantry2Ctn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        globTableCtn.find(".value").html(globTable.toFixed(2)+ " V");
                        if(globTable > seuil){globTableCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{globTableCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        FRTLlatGantryCtn.find(".value").html(FRTLlatGantry.toFixed(2)+ " V");
                        if(FRTLlatGantry > seuil){FRTLlatGantryCtn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{FRTLlatGantryCtn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        latSwitch2Ctn.find(".value").html(latSwitch2.toFixed(2)+ " V");
                        if(latSwitch2 > seuil){latSwitch2Ctn.find(".voyant img").attr('src', 'images/voyant_on.png')}else{latSwitch2Ctn.find(".voyant img").attr('src', 'images/voyant_off.png')};
                        
                        tsuiSupplyCtn.find(".value").html(tsuiSupply.toFixed(2)+ " V");
                        FRTLgantryCtn.find(".value").html(FRTLgantry.toFixed(2)+ " V");
                        unreg5Ctn.find(".value").html(unreg5.toFixed(2)+ " V");
                        unreg12Ctn.find(".value").html(unreg12.toFixed(2)+ " V");
                        
                        
                        
                    }
                    


                } else {
                    var canId = message.canId;
                    canId = canId;
                    var canData = message.canData;
                    canData = canData.toLowerCase();

                    //gestion de la spybox et des filtres
                    if (spyBoxDialog.hasClass("open") && !spyBoxDialog.hasClass("stop_mode")) {
                        var n = $(".filters_listing .filter_box").length;
                        if (n > 0) {
                            var conflictNb = 0;
                            $(".filters_listing .filter_box").each(function () {
                                var filterName = $(this).data("name");
                                var filterType = $(this).data("type");
                                var filterValue = $(this).data("value");

                                if (filterName == "ID") {
                                    if (canId == filterValue && filterType == "exclude") {
                                        conflictNb++;
                                    } else if (canId != filterValue && filterType == "include") {
                                        conflictNb++;
                                    }
                                } else {
                                    if (canData == filterValue && filterType == "exclude") {
                                        conflictNb++;
                                    } else if (canData != filterValue && filterType == "include") {
                                        conflictNb++;
                                    }
                                }

                            });
                            if (conflictNb == 0) {
                                sendToSpy(canId, canData);
                            }
                        } else {
                            sendToSpy(canId, canData);
                        }

                    } else {
                        //console.log("not send to spy");
                    }
                    //on parcoure le dictionnaire a chaque message et on affiche l'action correspondate dans l'interface
                    for (var nb = 0; nb < dictionary.length; nb++) {
                        if (globalName === "ELEGANCE") {
                            var trueCanID = addHexVal(dictionary[nb].can_id, nodeID);
                        } else {
                            var trueCanID = dictionary[nb].can_id;
                            //console.log(trueCanID);
                        }

                        if (trueCanID === canId) {
                            switch (dictionary[nb].type) {
                                case "button":
                                    if (dictionary[nb].pressed_val === canData) {
                                        console.log("green");
                                        diagInge.find(".diag_component.id" + dictionary[nb].id).addClass("is_pressed");
                                    }
                                    if (dictionary[nb].released_val === canData) {
                                        console.log("release");
                                        diagInge.find(".diag_component.id" + dictionary[nb].id).removeClass("is_pressed");
                                    }
                                    break;
                                case "joystick":
                                    var part0 = canData.substring(0, 2);
                                    var part1 = canData.substring(2, 4);
                                    var part2 = canData.substring(4, 6);
                                    var part3 = canData.substring(6, 8);
                                    var part4 = canData.substring(8, 10);
                                    var part5 = canData.substring(10, 12);
                                    var part6 = canData.substring(12, 14);
                                    var part7 = canData.substring(14, 16);

                                    if (part0 != "00" && part0 != "") {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part0) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part0) + '%');

                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part0) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part0) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part1 != "00" && part1 != "") {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part1) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part1) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part1) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part2 != "00" && part2 != "") {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part2) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part2) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part2) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part2) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part3 != "00" && part3 != "") {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part3) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part3) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part3) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part3) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part4 != "00" && part4 != "") {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part4) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part4) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part4) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part4) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part5 != "00" && part5 != "") {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part5) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part5) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part5) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part5) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part6 != "00" && part6 != "") {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part6) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part6) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part6) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part6) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part7 != "00" && part7 != "") {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part7) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part7) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part7) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values y_val').html(convertHexa(part7) + '%');

                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    
                                    console.log("0:"+part0+" 1:"+part1+" 2:"+part2+" 3:"+part3+" 4:"+part4+" 5:"+part5+" 6:"+part6+" 7:"+part7);
                                    break;
                                case "mushroom":
                                    var part0 = canData.substring(0, 2);
                                    var part1 = canData.substring(2, 4);
                                    var part2 = canData.substring(4, 6);
                                    var part3 = canData.substring(6, 8);
                                    var part4 = canData.substring(8, 10);
                                    var part5 = canData.substring(10, 12);
                                    var part6 = canData.substring(12, 14);
                                    var part7 = canData.substring(14, 16);

                                    if (part0 != "00" && part0 != "") {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part0) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part0) + '%');

                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part0) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part0) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "0") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part1 != "00" && part1 != "") {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part1) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part1) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part1) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "2") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part2 != "00" && part2 != "") {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part2) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part2) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part2) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part2) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "4") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part3 != "00" && part3 != "") {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part3) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part3) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part3) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part3) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "6") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part4 != "00" && part4 != "") {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part4) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part4) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part4) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part4) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "8") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part5 != "00" && part5 != "") {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part5) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part5) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part5) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part5) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "10") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part6 != "00" && part6 != "") {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part6) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part6) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part6) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html(convertHexa(part6) + '%');
                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "12") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    if (part7 != "00" && part7 != "") {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': convertHexa(part7) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html(convertHexa(part7) + '%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': (convertHexa(part7) * -1) + '%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values y_val').html(convertHexa(part7) + '%');

                                        }
                                    } else {
                                        if (dictionary[nb].x_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'left': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .x_val').html('0%');
                                        }
                                        if (dictionary[nb].y_pos == "14") {
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .cursor').css({'top': '0%'});
                                            joystickContainerNew.find('#id' + dictionary[nb].id + ' .values .y_val').html('0%');
                                        }
                                    }
                                    
                                    console.log("0:"+part0+" 1:"+part1+" 2:"+part2+" 3:"+part3+" 4:"+part4+" 5:"+part5+" 6:"+part6+" 7:"+part7);
                                    break;
                                default:
                                //console.log("non indentifié");
                            }
                        }
                    }
                }

                break;
        }

    };



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// SERIAL NUMBER OPERATIONS (REPAIR) ////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $(".update_commentary_bt").on('click', function () {
        if (confirm('Do you want to update commentary for this SN ?')) {
            updateCommentary(serialNumber);
        } else {
            //
        }
    });

    function checkSN(serialNumber) {
        $.ajax({
            url: 'php/api.php?function=get_sn&param1=' + serialNumber,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                if (data.length == 0) {
                    if (confirm('SN doesnt exist. Do you want to add it in database ?')) {
                        console.log("add " + serialNumber + " in database..")
                        addSN(serialNumber);
                    } else {
                        console.log("do nothing..")
                    }
                    $(".input_commentary").val("");
                } else {
                    $(".input_commentary").val(data[0].commentary);
                    if (confirm('SN already exists. Do you want to check his log history ?')) {
                        searchLogField("", serialNumber, "")
                    } else {
                        // Do nothing!
                    }
                }
            }
        });
    }
    function addSN(serialNumber) {
        $.ajax({
            url: 'php/api.php?function=add_sn&param1=' + serialNumber,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                console.log("SN AJouté");
            }
        });
    }
    function updateCommentary(serialNumber) {
        var commentaryStr = $(".input_commentary").val();
        $.ajax({
            url: 'php/api.php?function=update_sn&param1=' + serialNumber,
            type: 'POST',
            dataType: 'JSON',
            data: {commentary: commentaryStr},
            success: function (data, statut) {
                alert("Your comment on SN " + serialNumber + " has been updated.");
            }
        });
    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// SET GENERIC MESSAGES ///////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function setGenericMessages(family) {
        if (family === "ELEGANCE") {            
            //orientation du can hub A -> prise sub D9 elegance
            sendSignalPic("A");
            setTimeout(function(){
                startNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000001" + nodeID + "000000000000";
                stopNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000002" + nodeID + "000000000000";
                cobID1 = addHexVal("00000580", nodeID);
                cobID2 = addHexVal("00000600", nodeID);
                sendSignal(startNodeMsg);
                if(typeChoice == "AGILA"){
                    setTimeout(function(){
                        var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                        sendSignal(sign);
                    },100)                    
                }
            },400);  
            
        } else if (family === "OMEGA") {
            resetMasterTSSC = "002400806d68d7551407f09b861e3aad000549a8440800001FC20F000E00000000000000";
            startSlaveTSSC = "002400806d68d7551407f09b861e3aad000549a844010000028226404000000000000000";
            startSlaveSBSH = "002400806d68d7551407f09b861e3aad000549a844010000028426401000000000000000";
            startSlaveSBSH2 = "002400806d68d7551407f09b861e3aad000549a844010000028426400c00000000000000";
            console.log(modelName);

            switch (modelName) {
                case "TSSC" :
                    sendSignalPic("B");
                    sendSignal(startSlaveTSSC);
                    break;
                case "SMARTBOX" :
                    sendSignalPic("C");
                    sendSignal(startSlaveSBSH);
                    sendSignal(startSlaveSBSH2);
                    break;
                case "SMARTHANDLE" :
                    sendSignalPic("C");
                    sendSignal(startSlaveSBSH);
                    sendSignal(startSlaveSBSH2);
                    break;
                default:
                    break;
            }
            cobID1 = addHexVal("00000580", nodeID);
            cobID2 = addHexVal("00000600", nodeID);

        }
    }
    
    function setInitialDisplayByModel(globalName, modelName, typeChoice){        
        
        $("#content_home .information").addClass("hidden");
        $("#content_home .information_diag").addClass("hidden");
        $("#content_home .commentary_bloc").addClass("hidden");        
        $("#content_home .information_finaltest").addClass("hidden");
        $(".head_userinfo").addClass("hidden");
        $("#content_homeE .information").addClass("hidden");
        $(".testing_upl .content_upl").html("");
        $(".start_download").addClass("hidden");
        $(".stop_download").addClass("hidden");
        //reset finaltest
        
        $(".instructions_testfinal").removeClass("hidden");
        $("#launch_final_test").removeClass("hidden");
        $(".display_test_content").addClass("hidden");
        $(".stop_test_bloc").addClass("hidden");
        $("#recap_list_t .content_recap").empty();
        $(".continue_to_finaltest").addClass("hidden");
        
        validateTest = 0;
        errorTestFinal = 0;
        SRTLfinalTest = 0;
        last_value_joy = 0;
        initial_enable_tens = 0;
        initial_enable_freq = 0;
        initial_safety_tens = 0;
        initial_safety_freq = 0;
        initial_safety_srtl = 0;
        initial_enable_srtl = 0;
        
        
        zone0.parent().addClass("hidden");
        zone1.parent().addClass("hidden");
        zone2.parent().addClass("hidden");
        zone3.parent().addClass("hidden");
        displayContainer.parent().addClass("hidden");
        
        $(".switch.dim").addClass("hidden");
        $(".srtl_container").addClass("hidden");
        $(".buzzer_container").addClass("hidden");
        $(".display_container").addClass("hidden");
        $(".safety_container").addClass("hidden");
        $(".enable_container").addClass("hidden");        
        $(".supply_container").addClass("hidden");        
        $(".emergency_container").addClass("hidden"); 
        $(".hw_values_container").addClass("hidden");
        $(".hw_signals_container.tssc").addClass("hidden"); 
        $(".hw_signals_container.sbsh").addClass("hidden"); 
        $(".hw_signal_command_container.sbsh").addClass("hidden"); 
        $(".hw_signal_command_container.tssc").addClass("hidden"); 
        $(".nodeid_container").addClass("hidden");
        $(".bt_diag_mode").addClass("hidden");   
        
        $('#fileinput4').val(""); 
        $('#fileinput5').val(""); 
        
        
        $(".safety_container .name_container").html("SAFETY LOOP");
        $(".enable_container .state").removeClass("hidden");
        $(".enable_container .values_freq_volt").removeClass("hidden");
        $(".safety_container .state").removeClass("hidden");
        $(".safety_container .values_freq_volt").removeClass("hidden");
        
        $(".start_node_bt").addClass("hidden");
        $(".stop_node_bt").addClass("hidden");
        $(".display_all_bt").addClass("hidden");
        $(".stop_all_bt").addClass("hidden");
        $(".start_elegance_bt").addClass("hidden");  
        $(".start_agila_bt").addClass("hidden"); 
        $(".tsui_restart_bt").addClass("hidden");         
        $(".master_switch").addClass("hidden");         
        $(".switch_calibration").addClass("hidden");     
        $(".bad_calibration").addClass("hidden");     
        
        zone0.empty();
        zone1.empty();
        zone2.empty();
        zone3.empty();        
        joystickContainerNewRepair.empty();
        buttonContainer.empty();
        ledContainer.empty();
        joystickCalibrationContainer.empty();
        joystickVerifyContainer.empty();
        
        $(".joystick_container_new").empty();
        $(".calibration_zone_container").empty();
        $(".calibration_test_container").empty();
        $(".warning_firmware.inverted .content").empty();
        $(".warning_firmware.inverted").addClass("hidden");
        $(".diag_inge .diag_component").each(function () {
            $(this).remove();
        });    
        $(".switch.dim").each(function(){
            $(this).removeClass("hidden");
        })
        $(".legend_inge .nodeIDleg").removeClass("hidden");
        $(".legend_inge .dimleg").removeClass("hidden");
        
        if (globalName == "OMEGA") {       
            $(".legend_inge .nodeIDleg").addClass("hidden");
            $(".legend_inge .dimleg").addClass("hidden");
            
            $(".bt_diag_mode").removeClass("hidden");
            $(".enable_container .state").addClass("hidden");
            $(".enable_container .values_freq_volt").addClass("hidden");
            $(".safety_container .state").addClass("hidden");
            $(".safety_container .values_freq_volt").addClass("hidden");
            $(".switch.dim").each(function(){
                $(this).addClass("hidden");
            })
            $(".hw_values_container").removeClass("hidden");
            if(modelName == "TSSC" ){
                $(".safety_container .name_container").html("EMERGENCY FUNCTIONS");
                $(".buzzer_container").removeClass("hidden");
                $(".display_container").removeClass("hidden");  
                $(".safety_container").removeClass("hidden");
                $(".enable_container").removeClass("hidden"); 
                $(".hw_signals_container.tssc").removeClass("hidden");
                $(".hw_signal_command_container.tssc").removeClass("hidden"); 
                $(".master_switch").removeClass("hidden");     
                
                $(".display_all_bt").removeClass("hidden");
                $(".stop_all_bt").removeClass("hidden");
                $(".tsui_restart_bt").removeClass("hidden");                 
                
            }else{
                
                $(".switch_calibration").removeClass("hidden");                                
                $(".enable_container").removeClass("hidden"); 
                $(".hw_signals_container.sbsh").removeClass("hidden");
                $(".hw_signal_command_container.sbsh").removeClass("hidden"); 
                
                $(".display_all_bt").removeClass("hidden");
                $(".stop_all_bt").removeClass("hidden");
                $(".tsui_restart_bt").removeClass("hidden");                 
            }
        }else if(globalName == "ELEGANCE"){    
            $(".supply_container").removeClass("hidden");        
            if(modelName == "TSSC" ){
                //left
                $(".buzzer_container").removeClass("hidden");
                $(".srtl_container").removeClass("hidden");
                $(".display_container").removeClass("hidden");  
                $(".safety_container").removeClass("hidden");
                $(".enable_container").removeClass("hidden"); 
                $(".emergency_container").removeClass("hidden"); 
                $(".nodeid_container").removeClass("hidden");
                
                $(".start_node_bt").removeClass("hidden");
                $(".stop_node_bt").removeClass("hidden");
                $(".display_all_bt").removeClass("hidden");
                $(".stop_all_bt").removeClass("hidden");
                $(".start_elegance_bt").removeClass("hidden");
                $(".tsui_restart_bt").removeClass("hidden"); 
                $(".bad_calibration").removeClass("hidden");   
                
            }else if(modelName == "SMARTBOX" && typeChoice == "AGILA"){
                $(".warning_firmware.inverted").removeClass("hidden");
                $(".warning_firmware.inverted .content").append("<b>With default switch position LEFT</b> :<br><br> Table Panning Mushroom : X axis inverted<br>Table Tilt/Lift Joystick : Y axis inverted<br>AGV Move In/Out : X axis inverted")
                
                $(".switch_calibration").removeClass("hidden");
                
                $(".srtl_container").removeClass("hidden");
                $(".display_container").removeClass("hidden");  
                $(".safety_container").removeClass("hidden");
                $(".enable_container").removeClass("hidden"); 
                $(".emergency_container").removeClass("hidden"); 
                $(".nodeid_container").removeClass("hidden");
                
                $(".start_node_bt").removeClass("hidden");
                $(".stop_node_bt").removeClass("hidden");
                $(".display_all_bt").removeClass("hidden");
                $(".stop_all_bt").removeClass("hidden");
                $(".start_elegance_bt").removeClass("hidden");
                $(".start_agila_bt").removeClass("hidden"); 
                $(".tsui_restart_bt").removeClass("hidden"); 
            }else{
                $(".warning_firmware.inverted").removeClass("hidden");
                $(".warning_firmware.inverted .content").append("<b>With default switch position LEFT</b> :<br><br> Table Panning Mushroom : X axis inverted<br>Table Tilt/Lift Joystick : Y axis inverted")
                $(".switch_calibration").removeClass("hidden");
                
                $(".srtl_container").removeClass("hidden");
                $(".safety_container").removeClass("hidden");
                $(".enable_container").removeClass("hidden"); 
                $(".emergency_container").removeClass("hidden"); 
                $(".nodeid_container").removeClass("hidden");
                
                $(".start_node_bt").removeClass("hidden");
                $(".stop_node_bt").removeClass("hidden");
                $(".display_all_bt").removeClass("hidden");
                $(".stop_all_bt").removeClass("hidden");
                $(".start_elegance_bt").removeClass("hidden");
                $(".tsui_restart_bt").removeClass("hidden"); 
            }
        }
        
        
    }
    
    function resetDisplayCalibration(hasServiceBt,switchPosNumber){
        
        $(".commentary_bloc").addClass("hidden");
        $(".information_finaltest").addClass("hidden");
        $(".bloc.information").addClass("hidden");
        $(".information_manufacturing").addClass("hidden");
        $(".information_diag").addClass("hidden");
        $(".serv_line_test").each(function(){
            $(this).removeClass("test_ok");
            $(this).removeClass("test_fail");
        })
        $(".switch_line_test").each(function(){
            $(this).removeClass("test_ok");
            $(this).removeClass("test_fail");
        })
        
        $(".statut_calibration_verif").addClass("hidden");
        $(".statut_calibration_verif .content").empty();
        
        if(hasServiceBt == 0 && switchPosNumber == 0){
            $(".calibration_step_2").removeClass("hidden");
            $(".calibration_step_1").addClass("hidden");
            $(".continue_to_finaltest").addClass("hidden");
            $(".statut_calibration_verif").addClass("hidden");
            $(".statut_calibration_verif").empty();
        }else if(hasServiceBt == 0 && switchPosNumber > 0){
            $(".calibration_step_2").addClass("hidden");
            $(".calibration_step_1").removeClass("hidden");
            $(".repair_calib_section_serv").addClass("hidden");
            $(".repair_calib_section_switch").removeClass("hidden");
            $(".continue_to_finaltest").addClass("hidden");
            $(".statut_calibration_verif").addClass("hidden");
            $(".statut_calibration_verif").empty();
            $(".switch_line_test").each(function(){
                $(this).removeClass("test_ok");
                $(this).removeClass("test_fail");
            })
        }else if(hasServiceBt > 0 && switchPosNumber == 0){
            $(".calibration_step_2").addClass("hidden");
            $(".calibration_step_1").removeClass("hidden");
            $(".repair_calib_section_serv").removeClass("hidden");
            $(".repair_calib_section_switch").addClass("hidden");
            $(".continue_to_finaltest").addClass("hidden");
            $(".statut_calibration_verif").addClass("hidden");
            $(".statut_calibration_verif").empty();
            $(".switch_line_serv").each(function(){
                $(this).removeClass("test_ok");
                $(this).removeClass("test_fail");
            })
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// SPY BOX        ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    function sendToSpy(canId, canData) {
        var d = spyBox.get(0);
        d.scrollTop = d.scrollHeight;
        var canDataStr = chunk(canData, 2).join(' ');;
        if (lastSpyMsg !== canData) {            
            var today = new Date();
            var minutes = today.getMinutes();
            var seconds = today.getSeconds();
            var milliseconds = today.getMilliseconds();if(String(milliseconds).length <3){milliseconds="0"+milliseconds};
            spyBox.append("<div class='line_spy'><span class='can_id_spy' data-id='" + canId + "'>" + canId + "</span> <span class='can_data_spy'>" + canDataStr + "</span> <span class='nb'>1</span><span class='ts'>" + minutes+"m "+seconds+","+milliseconds+"s" + "</span></div>");
        } else {
            if ($('#dialog-spybox .content_line').is(':empty')) {
                var today = new Date();
                var minutes = today.getMinutes();
                var seconds = today.getSeconds();
                var milliseconds = today.getMilliseconds();if(String(milliseconds).length <3){milliseconds="0"+milliseconds};
                spyBox.append("<div class='line_spy'><span class='can_id_spy' data-id='" + canId + "'>" + canId + "</span> <span class='can_data_spy'>" + canDataStr + "</span> <span class='nb'>1</span><span class='ts'>" + minutes+"m "+seconds+","+milliseconds+"s"+ "</span></div>");
            } else {
                var nb = $("#dialog-spybox .content_line .line_spy:last-child .nb").html();
                var today = new Date();
                var minutes = today.getMinutes();
                var seconds = today.getSeconds();
                var milliseconds = today.getMilliseconds();if(String(milliseconds).length <3){milliseconds="0"+milliseconds};
                
                nb = parseInt(nb);
                nb++;
                $(".content_line .line_spy:last-child .nb").html(nb);
                $(".content_line .line_spy:last-child .ts").html(minutes+"m "+seconds+","+milliseconds+"s");
            }

        }
        lastSpyMsg = canData;
    }

    $("#dialog-spybox .spy_stop").on('click', function () {
        spyBoxDialog.addClass("stop_mode");
    });
    $("#dialog-spybox .spy_play").on('click', function () {
        spyBoxDialog.removeClass("stop_mode");

    });
    $("#dialog-spybox .spy_clear").on('click', function () {
        spyBox.empty();
    });
    $("#dialog-spybox .add_zero_spy").on('click', function () {
        var inputCanID_filterVal = $(".filter_canid").val().trim();
        console.log(inputCanID_filterVal);
        inputCanID_filterVal = addZeroBefore(inputCanID_filterVal, 8);
        console.log(inputCanID_filterVal);
        $(".filter_canid").val(inputCanID_filterVal);
        
        var inputCanData_filterVal = $(".filter_candata").val().trim();
        console.log(inputCanID_filterVal);
        inputCanData_filterVal = addZeroAfter(inputCanData_filterVal, 16);
        console.log(inputCanData_filterVal);
        $(".filter_candata").val(inputCanData_filterVal);
        
    });
    
    $("#dialog-spybox .exclude_filter_id").on('click', function () {
        var filterValCanID = $(".filter_canid").val().trim();
        if (filterValCanID !== "") {
            addFilter(filterValCanID, "ID", "exclude");
        }
    });
    $("#dialog-spybox .filter_id").on('click', function () {
        var filterValCanID = $(".filter_canid").val().trim();
        if (filterValCanID !== "") {
            addFilter(filterValCanID, "ID", "include");
        }
    });
    $("#dialog-spybox .exclude_filter_data").on('click', function () {
        var filterValCanDATA = $(".filter_candata").val().trim();
        if (filterValCanDATA !== "") {
            addFilter(filterValCanDATA, "DATA", "exclude");
        }
    });
    $("#dialog-spybox .filter_data").on('click', function () {
        var filterValCanDATA = $(".filter_candata").val().trim();
        if (filterValCanDATA !== "") {
            addFilter(filterValCanDATA, "DATA", "include");
        }
    });
    $(".filters_listing .filter_box").on('click', function () {
        $(this).remove();
    });

    function addFilter(filterValue, name, type) {
        if (type == "exclude") {
            $(".filters_listing .content_filters").append(
                    "<div class='filter_box exclude nb" + filterValue + "' data-name='" + name + "' data-type='" + type + "' data-value='" + filterValue + "'><b>" + name + "</b>: <span class='filter_value'>" + filterValue + "</span></div>"
                    );
        } else {
            $(".filters_listing .content_filters").append(
                    "<div class='filter_box nb" + filterValue + "' data-name='" + name + "' data-type='" + type + "' data-value='" + filterValue + "'><b>" + name + "</b>: <span class='filter_value'>" + filterValue + "</span></div>"
                    );
        }
        $(".filters_listing .filter_box").on('click', function () {
            $(this).remove();
        });
    }
    function chunk(str, n) {
        var ret = [];
        var i;
        var len;
        for(i = 0, len = str.length; i < len; i += n) {
           ret.push(str.substr(i, n))
        }
        return ret
    };



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// SENDER BOX  //////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    $("#dialog-sender .sender_test").on('click', function () {
        getPreviewValues();
    });
    $("#dialog-sender .add_zero").on('click', function () {
        adjustCanMessage();
    });
    $("#dialog-sender .sender_final").on('click', function () {
        var dlcInputSender = $("#dialog-sender .candlc_sender").val().trim().toString(16);
        var idInputSender = $("#dialog-sender .canid_sender").val().trim().toString(16);
        var dataInputSender = $("#dialog-sender .candata_sender").val().trim().toString(16);
        var totalLength = (dlcInputSender.length + idInputSender.length + dataInputSender.length);
        console.log(totalLength);

        if (totalLength == 26 && is_hexadecimal(dlcInputSender) && is_hexadecimal(idInputSender) && is_hexadecimal(dataInputSender)) {

            sendSignal("002400806d68d7551407f09b861e3aad000549a844" + dlcInputSender + "0000" + idInputSender + dataInputSender);
            $(".result_send_confirm").fadeIn(300);
            setTimeout(function(){$(".result_send_confirm").fadeOut(300);},1000)


        } else {
            alert("Message not sent : length error, ot not in hexadecimal.")
        }


    });

    function addZeroBefore(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    function addZeroAfter(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : n + new Array(width - n.length + 1).join(z);
    }
    function is_hexadecimal(str) {
        var regexp = /^[0-9a-fA-F]+$/;

        if (regexp.test(str)) {
            return true;
        } else {
            return false;
        }
    }
    
    function adjustCanMessage() {
        var dlcInputSender = $("#dialog-sender .candlc_sender").val().trim();
        var idInputSender = $("#dialog-sender .canid_sender").val().trim();
        var dataInputSender = $("#dialog-sender .candata_sender").val().trim();

        dlcInputSender = addZeroBefore(dlcInputSender, 2);
        idInputSender = addZeroBefore(idInputSender, 8);
        dataInputSender = addZeroAfter(dataInputSender, 16);

        $("#dialog-sender .candlc_sender").val(dlcInputSender);
        $("#dialog-sender .canid_sender").val(idInputSender);
        $("#dialog-sender .candata_sender").val(dataInputSender);
    }
    function getPreviewValues() {
        var dlcInputSender = $("#dialog-sender .candlc_sender").val().trim();
        var idInputSender = $("#dialog-sender .canid_sender").val().trim();
        var dataInputSender = $("#dialog-sender .candata_sender").val().trim();

        if (dlcInputSender.length == 0 && idInputSender.length == 0 && dataInputSender.length == 0) {
            $("#dialog-sender .error_sender").html("Fields are empty.");
            $("#dialog-sender .error_sender").removeClass("hidden");
            $("#dialog-sender .result_sender").addClass("hidden");
        } else {
            $("#dialog-sender .error_sender").addClass("hidden");
            displayPreviewValues(dlcInputSender, idInputSender, dataInputSender);
        }
    }
    function displayPreviewValues(dlcInputSender, idInputSender, dataInputSender) {
        $("#dialog-sender .result_sender").removeClass("hidden");
        $("#dialog-sender .result_sender .sender_msg").html("<span class='text_ref'>Message : </span><span class='red'>" + dlcInputSender + "</span> <span class='green'>" + idInputSender + "</span> <span class='blue'>" + dataInputSender + "</span>");
        $("#dialog-sender .result_sender .length_msg").html("<span class='text_ref'>Length : </span><span class='red'>" + dlcInputSender.length + "/2</span> <span class='green'>" + idInputSender.length + "/8</span> <span class='blue'>" + dataInputSender.length + "/16</span>");
    }




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// DIAG PRINT LOG ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    //Generation du tableau de log qui sera ensuite save en base de donnée
    function generateJsonLog() {
        jsonLog = [];
        var name;
        var fct;
        var completeName;
        $("#content_pretest .line").each(function () {
            if ($(this).hasClass("tested")) {
                name = $(this).data('name');
                fct = $(this).data('function');
                if (fct == "button") {
                    if ($(this).hasClass("pressed")) {
                        completeName = name + " - press";
                        jsonLog.push({name: completeName, test: 'OK', fct: fct});
                    } else {
                        completeName = name + " - press";
                        jsonLog.push({name: completeName, test: 'FAILED', fct: fct});
                    }
                    if ($(this).hasClass("released")) {
                        completeName = name + " - release";
                        jsonLog.push({name: completeName, test: 'OK', fct: fct});
                    } else {
                        completeName = name + " - release";
                        jsonLog.push({name: completeName, test: 'FAILED', fct: fct});
                    }
                } else {
                    if ($(this).hasClass("testok")) {
                        completeName = name + " - " + fct;
                        jsonLog.push({name: completeName, test: 'OK', fct: fct});
                    } else {
                        completeName = name + " - " + fct;
                        jsonLog.push({name: completeName, test: 'FAILED', fct: fct});
                    }
                }
            } else {
                name = $(this).data('name');
                fct = $(this).data('function');
                if (fct == "button") {
                    completeName = name + " - press";
                    jsonLog.push({name: completeName, test: 'untested', fct: fct});
                    completeName = name + " - release";
                    jsonLog.push({name: completeName, test: 'untested', fct: fct});
                } else {
                    completeName = name + " - " + fct;
                    jsonLog.push({name: completeName, test: 'untested', fct: fct});
                }
            }
        });
        $("#content_pretest .joystick_container_new_repair .new_joystick").each(function () {
            name = $(this).find(".diag_test_bt").data('name');
            fct = $(this).find(".diag_test_bt").data('function');
            if ($(this).find(".diag_test_bt").hasClass("ok")) {
                completeName = name + " - " + fct;
                jsonLog.push({name: completeName, test: 'OK', fct: fct});
            } else if($(this).find(".diag_test_bt").hasClass("fail")) {
                completeName = name + " - " + fct;
                jsonLog.push({name: completeName, test: 'FAILED', fct: fct});
            }else{
                completeName = name + " - " + fct;
                jsonLog.push({name: completeName, test: 'untested', fct: fct});
            }
        });
        console.log(jsonLog);
        console.log("------");
        jsonLog = JSON.stringify(jsonLog);
        console.log(jsonLog);
        
        var currentdate = new Date();
        var day = currentdate.getDate(); if (String(day).length <=1){day = "0"+day};
        var month = currentdate.getMonth() + 1; if (String(month).length <=1){month = "0"+month};
        var hour = currentdate.getHours(); if (String(hour).length <=1){hour = "0"+hour};
        var minutes = currentdate.getMinutes(); if (String(minutes).length <=1){minutes = "0"+minutes};
        var datetime = day + "/" + month + "/" + currentdate.getFullYear() + " " + hour + "h" + minutes;
        
        $.ajax({
            type: "POST",
            url: "php/api.php?function=save_log_pretest",
            data: {jsonlog: jsonLog, sn: serialNumber, pn: partNumber, sso: userSSO, nodeID:nodeID, FWfctV: FWfctV, FWcalibV: FWcalibV, SWv: SWv},
            success: function (msg) {
                alert("Your log has been saved.");
                printJsonLog(jsonLog, serialNumber, partNumber, userSSO, nodeID, datetime, FWfctV, SWv);
                $("#print_log").removeClass("hidden");
            }
        });
    }

    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printJsonLog(jsonLog, serialNumber, partNumber, userSSO, nodeID, datetime, FWfctV, SWv) {
        var msg = JSON.parse(jsonLog);
        var lineButton = "";
        var lineLed = "";
        var lineDisplay = "";
        var lineJoystick = "";
        var lineBuzzer = "";
        for (var i = 0; i < msg.length; i++) {
            if (msg[i].fct == "button") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }

                lineButton += line;
            }
            if (msg[i].fct == "led" || msg[i].fct == "led_emergency") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineLed += line;
            }
            if (msg[i].fct == "buzzer") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineBuzzer += line;
            }
            if (msg[i].fct == "joystick" || msg[i].fct == "mushroom") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineJoystick += line;
            }
            if (msg[i].fct == "display") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineDisplay += line;
            }

        }
        
        
        var myWindow = window.open('', '', 'width=1000,height=800');
        myWindow.document.write("<h2>PRETEST LOG RECORD - " + datetime + "</h2><div style='border:1px solid black;padding:5px;'><b>PN</b>: " + partNumber + " - <b>SN</b>: " + serialNumber + " - <b>Firmware version</b>: "+FWfctV+" - <b>Sofware version</b>: "+SWv+" - <b>User SSO</b>: " + userSSO + " - <b>Node ID:</b> "+nodeID+"</div><h3>BUTTONS</h3><div>" + lineButton + "</div><h3>BUZZERS</h3><div>" + lineBuzzer + "</div><h3>BACKLIGHTS</h3><div>" + lineLed + "</div><h3>DISPLAYS</h3><div>" + lineDisplay + "</div><h3>JOYSTICKS</h3><div>" + lineJoystick + "</div>");
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }





    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// FINAL   TEST /////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    //Click on launch final test button
    $(".launch_final").on('click', function () {
        
        $(".instructions_testfinal").addClass("hidden");
        sendSignal(startNodeMsg);
        if(typeChoice == "AGILA"){
            setTimeout(function(){
                var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                sendSignal(sign);
            },100)                    
        }
        launchFinalTest();
    });

    //valider manuellement l'étape (dev only)
    $("#next_final_test").on('click', function () {
        nextStepFinal("ok");
    });

    //interrompre manuellement le test final
    $("#stop_final_test").on('click', function () {
        stopFinalTest("interrupted");
    });

    //enregistrement et impression des logs
    $(".print_log_final").on('click', function () {
        generateJsonLogFinal();
    });

    //impression du TST
    $(".print_tst").on('click', function () {
        if (errorTestFinal == 0) {
            var url = "files/tst/" + tstName;
            window.open(url);
        } else {
            alert("You can't print TST while you get errors in final test");
        }

    });

    //recuperation des entrées du test final dans le dictionnaire associé
    function getFinalTest() {
        $.ajax({
            url: 'php/api.php?function=get_final_test&param1=' + family_id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                finalTestEntriesTest = [];
                var finalButtonList = [];
                var finalLedList = [];
                var finalDisplayList = [];
                var finalJoystickList = [];
                var finalBuzzerList = [];


                for (var i = 0; i < data.length; i++) {

                    if (data[i].type == "button") {
                        finalButtonList.push({symbol_name: data[i].symbol_name, type: data[i].type, description: data[i].description, photo_link: data[i].photo_link, timer: data[i].timer, off_signal: data[i].off_signal, on_signal: data[i].on_signal, can_id: data[i].can_id, pressed_val: data[i].pressed_val, released_val: data[i].released_val, standard_name: data[i].standard_name, is_cdrh: data[i].is_cdrh, is_enable: data[i].is_enable, is_safety: data[i].is_safety});
                        if (data[i].is_led == "1") {
                            finalLedList.push({symbol_name: data[i].symbol_name, type: "led", description: data[i].description, photo_link: data[i].photo_link, timer: data[i].timer, off_signal: data[i].off_signal, on_signal: data[i].on_signal, can_id: data[i].can_id, pressed_val: data[i].pressed_val, released_val: data[i].released_val, standard_name: data[i].standard_name, is_cdrh: data[i].is_cdrh, is_enable: data[i].is_enable});
                        }
                        else if(data[i].is_led == "2"){
                            finalLedList.push({symbol_name: data[i].symbol_name, type: "led_spe", description: data[i].description, photo_link: data[i].photo_link, timer: data[i].timer, off_signal: data[i].off_signal, on_signal: data[i].on_signal, can_id: data[i].can_id, pressed_val: data[i].pressed_val, released_val: data[i].released_val, standard_name: data[i].standard_name, is_cdrh: data[i].is_cdrh, is_enable: data[i].is_enable});
                        }
                    } else if (data[i].type == "display") {
                        finalDisplayList.push({symbol_name: data[i].symbol_name, type: data[i].type, description: data[i].description, photo_link: data[i].photo_link, timer: data[i].timer, off_signal: data[i].off_signal, on_signal: data[i].on_signal, can_id: data[i].can_id, pressed_val: data[i].pressed_val, released_val: data[i].released_val, standard_name: data[i].standard_name, is_cdrh: data[i].is_cdrh, is_enable: data[i].is_enable});
                    } else if (data[i].type == "joystick") {
                        finalJoystickList.push({symbol_name: data[i].symbol_name, type: data[i].type, description: data[i].description, photo_link: data[i].photo_link, timer: data[i].timer, off_signal: data[i].off_signal, on_signal: data[i].on_signal, can_id: data[i].can_id, pressed_val: data[i].pressed_val, released_val: data[i].released_val, x_pos: data[i].x_pos, y_pos: data[i].y_pos, standard_name: data[i].standard_name, is_cdrh: data[i].is_cdrh, is_enable: data[i].is_enable});
                    } else if (data[i].type == "buzzer") {
                        finalBuzzerList.push({symbol_name: data[i].symbol_name, type: data[i].type, description: data[i].description, photo_link: data[i].photo_link, timer: data[i].timer, off_signal: data[i].off_signal, on_signal: data[i].on_signal, can_id: data[i].can_id, pressed_val: data[i].pressed_val, released_val: data[i].released_val, standard_name: data[i].standard_name, is_cdrh: data[i].is_cdrh, is_enable: data[i].is_enable});
                    }
                }

                for (var i = 0; i < finalButtonList.length; i++) {
                    finalTestEntriesTest.push(finalButtonList[i]);
                }
                for (var i = 0; i < finalLedList.length; i++) {
                    finalTestEntriesTest.push(finalLedList[i]);
                }
                for (var i = 0; i < finalDisplayList.length; i++) {
                    finalTestEntriesTest.push(finalDisplayList[i]);
                }
                for (var i = 0; i < finalBuzzerList.length; i++) {
                    finalTestEntriesTest.push(finalBuzzerList[i]);
                }
                for (var i = 0; i < finalJoystickList.length; i++) {
                    finalTestEntriesTest.push(finalJoystickList[i]);
                }

            }
        }
        );
    }

    //Launch final test
    function launchFinalTest() {
        indexFinal = 0;
        errorTestFinal = 0;
        _MODE = "TESTFINAL";
        getFinalTest();
        $("#testfinal_container").addClass("hidden");
        $("#user_wait span").html("Please wait while TSUI is restarting.");
        $("#user_wait").removeClass("hidden");
        sendSignalPic("1"); 
        if(globalName == "ELEGANCE"){                       
            sendSignalPic("3");            
            if(typeChoice == "AGILA"){
                setTimeout(function(){
                    sendSignal(startNodeMsg);
                    var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                    sendSignal(sign);
                },5000)                    
            }else{
                setTimeout(function(){
                    sendSignal(startNodeMsg);                    
                },10000)    
            }
            setTimeout(function () {
                if(hasSRTL == 1) {
                    initial_enable_srtl = enableSRTLfinal;
                    initial_safety_srtl = safetySRTLfinal;
                    SRTLfinalTest = 1;
                }else{
                    initial_enable_tens = currEnableF;
                    initial_enable_freq = currEnableT;
                    initial_safety_tens = currSafetyT;
                    initial_safety_freq = currSafetyF;
                    //alert(initial_safety_tens+" "+initial_safety_freq)
                    SRTLfinalTest = 0;
                }
            }, 10500);
            
        }else if(globalName == "OMEGA"){
            if(modelName == "TSSC"){
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc22f000e00000000000000");
                setTimeout(function () {           
                    initial_enable_tens = currEnableF;
                    initial_enable_freq = currEnableT;
                    initial_safety_tens = currSafetyT;
                    initial_safety_freq = currSafetyF;
                    console.log("on a start et on enregistre les valeurs initiales :"+initial_enable_tens+" "+initial_enable_freq+" "+initial_safety_tens+" "+initial_safety_freq)            
                    sendSignalPic("2");            
                }, 300);
            }else{
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc42f000e00000000000000");
                setTimeout(function(){
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844010000028426401000000000000000");
                    setTimeout(function () {           
                        initial_enable_tens = currEnableF;
                        initial_enable_freq = currEnableT;
                        initial_safety_tens = currSafetyT;
                        initial_safety_freq = currSafetyF;
                        console.log("on a start et on enregistre les valeurs initiales :"+initial_enable_tens+" "+initial_enable_freq+" "+initial_safety_tens+" "+initial_safety_freq)            
                        sendSignalPic("2");            
                    }, 300);
                },20000)
            }
        }     
        
        setTimeout(function () {
            sendSignalPic("2"); 
            maxIndexFinal = finalTestEntriesTest.length;            
            console.log(maxIndexFinal);
            console.log(finalTestEntriesTest);

            if (maxIndexFinal > 0) {
                $("#testfinal_container .display_test_content").removeClass("hidden");
                $("#testfinal_container #launch_final_test").addClass("hidden");
                nameFinalContainer.removeClass("hidden");
                timerBloc.removeClass("hidden");
                imgFinalBloc.removeClass("hidden");
                stopTestBloc.addClass("hidden");
                $("#stop_final_test").removeClass("hidden");
                $("#next_final_test").removeClass("hidden");
                recapListFinal.empty();
                timerBloc.html("");              
                
                displayFinalTest(indexFinal);
                $("#testfinal_container").removeClass("hidden");
                $("#user_wait").addClass("hidden");
            }
        }, 11000);
    }

    //Affichage du test final en cours
    function displayFinalTest(indexFinal) {
        userActionFinal.empty();
        var pourcentage = Math.round((indexFinal / maxIndexFinal) * 100);

        currSymbol_name = finalTestEntriesTest[indexFinal]["symbol_name"];
        currType = finalTestEntriesTest[indexFinal]["type"];
        currDescription = finalTestEntriesTest[indexFinal]["description"];
        currPhoto_link = finalTestEntriesTest[indexFinal]["photo_link"];
        currTimer = finalTestEntriesTest[indexFinal]["timer"];
        currOffSignal = finalTestEntriesTest[indexFinal]["off_signal"];
        currOnSignal = finalTestEntriesTest[indexFinal]["on_signal"];
        currStandardName = finalTestEntriesTest[indexFinal]["standard_name"];
        enableF = "";
        enableT = "";
        enableFrel = "";
        enableTrel = "";
        
        currEnableSRTL = "0";
        currSafetySRTL = "0";
        currEnableSRTLrel = "0";
        currSafetySRTLrel = "0";
        isCdrh = finalTestEntriesTest[indexFinal]["is_cdrh"];
        isEnable = finalTestEntriesTest[indexFinal]["is_enable"];
        isSafety = finalTestEntriesTest[indexFinal]["is_safety"];
        setTimeout(function () {
            if (isEnable == 1) {
                console.log("is enable");
                sendSignalPic("1");
                waitingEnableAndSafety = 1;                
            }else if(isSafety == 1){
                console.log("is safety");
                sendSignalPic("1");
                waitingEnableAndSafety = 1;   
            }
        }, 100)


        launchTimer(currTimer);

        var can_id = addHexVal(finalTestEntriesTest[indexFinal]["can_id"], nodeID);
        var pressed_val = finalTestEntriesTest[indexFinal]["pressed_val"];
        var released_val = finalTestEntriesTest[indexFinal]["released_val"];
        var postSignal = "002400806d68d7551407f09b861e3aad000549a844080000";
        currSignalStart = postSignal + currOnSignal;
        currSignalStop = postSignal + currOffSignal;
        $("#content_finaltest .warning_firmware.inverted").addClass("hidden");

        switch (currType) {
            case "button":
                symbolNameFinal.html("Press and release " + currSymbol_name);
                descriptionFinal.html(currDescription);
                imgFinal.attr('src', 'images/' + currPhoto_link);
                progressBarFinalInside.css('width', pourcentage + '%');
                progressBarFinal.html(pourcentage + '%');
                if(isEnable == 1){
                    waitingAction = "ENABLE";
                }else if(isSafety == 1){
                    waitingAction = "SAFETY";
                }else{
                    waitingAction = "BUTTON";
                }
                waitingPressValue = pressed_val;
                waitingReleaseValue = released_val;
                console.log("waiting action :" + waitingAction + " // " + pressed_val + " / " + released_val);
                break;
            case "led":
                symbolNameFinal.html("Is " + currSymbol_name + " light on ?");
                descriptionFinal.html(currDescription);
                userActionFinal.html("<button class='UAyes'>YES</button><button class='UAno'>NO</button>");
                imgFinal.attr('src', 'images/' + currPhoto_link);
                progressBarFinalInside.css('width', pourcentage + '%');
                progressBarFinal.html(pourcentage + '%');
                sendSignal(currSignalStart);
                userActionFinal.find(".UAyes").on('click', function () {
                    validateTest = 1;
                    sendSignal(currSignalStop);
                });
                userActionFinal.find(".UAno").on('click', function () {
                    sendSignal(currSignalStop);
                    nextStepFinal("fail");
                });
                break;
            case "led_spe":
                symbolNameFinal.html("Is " + currSymbol_name + " light on ?");
                descriptionFinal.html(currDescription);
                userActionFinal.html("<button class='UAyes'>YES</button><button class='UAno'>NO</button>");
                imgFinal.attr('src', 'images/' + currPhoto_link);
                progressBarFinalInside.css('width', pourcentage + '%');
                progressBarFinal.html(pourcentage + '%');
                sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300153000000");
                sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300245000000");
                sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300354000000");
                
                userActionFinal.find(".UAyes").on('click', function () {
                    validateTest = 1;
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300144000000");
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300257000000");
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F0030034E000000");
                });
                userActionFinal.find(".UAno").on('click', function () {
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300144000000");
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300257000000");
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F0030034E000000");
                    nextStepFinal("fail");
                });
                break;
            case "display":
                symbolNameFinal.html("Is display " + currSymbol_name + " light on ?");
                descriptionFinal.html(currDescription);
                userActionFinal.html("<button class='UAyes'>YES</button><button class='UAno'>NO</button>");
                imgFinal.attr('src', 'images/' + currPhoto_link);
                progressBarFinalInside.css('width', pourcentage + '%');
                progressBarFinal.html(pourcentage + '%');
                sendSignal(currSignalStart);
                userActionFinal.find(".UAyes").on('click', function () {
                    validateTest = 1;
                    sendSignal(currSignalStop);
                });
                userActionFinal.find(".UAno").on('click', function () {
                    sendSignal(currSignalStop);
                    nextStepFinal("fail");
                });
                break;
            case "buzzer":
                symbolNameFinal.html("Do you hear buzzer ?");
                descriptionFinal.html(currDescription);
                userActionFinal.html("<button class='UAyes'>YES</button><button class='UAno'>NO</button>");
                imgFinal.attr('src', 'images/' + currPhoto_link);
                progressBarFinalInside.css('width', pourcentage + '%');
                progressBarFinal.html(pourcentage + '%');
                sendSignal(currSignalStart);
                userActionFinal.find(".UAyes").on('click', function () {
                    validateTest = 1;
                    sendSignal(currSignalStop);
                });
                userActionFinal.find(".UAno").on('click', function () {
                    sendSignal(currSignalStop);
                    nextStepFinal("fail");
                });
                break;
            case "joystick":
                var x_pos = finalTestEntriesTest[indexFinal]["x_pos"].trim();
                var y_pos = finalTestEntriesTest[indexFinal]["y_pos"].trim();
                progressBarFinalInside.css('width', pourcentage + '%');
                progressBarFinal.html(pourcentage + '%');
                if(globalName == "ELEGANCE" && modelName == "SMARTBOX"){
                    $("#content_finaltest .warning_firmware.inverted").removeClass("hidden");
                }
                
                if (x_pos != "" && y_pos != "") {
                    waitingXpos = x_pos;
                    waitingYpos = y_pos;
                    symbolNameFinal.html("Test " + currDescription);
                    imgFinal.attr('src', 'images/' + currPhoto_link);
                    descriptionFinal.html("Please move " + currDescription + " to LEFT..");
                    last_value_joy = 0;
                    waitingAction = "JOYSTICK_X_LEFT";
                    waitingID = can_id;
                }
                if (x_pos != "" && y_pos == "") {
                    waitingXpos = x_pos;
                    waitingYpos = "";
                    symbolNameFinal.html("Test " + currDescription);
                    imgFinal.attr('src', 'images/' + currPhoto_link);
                    descriptionFinal.html("Please move " + currDescription + " to LEFT..");
                    last_value_joy = 0;
                    waitingAction = "JOYSTICK_X_LEFT";
                    waitingID = can_id;
                }
                if (x_pos == "" && y_pos != "") {
                    waitingYpos = y_pos;
                    waitingXpos = "";
                    symbolNameFinal.html("Test " + currDescription);
                    imgFinal.attr('src', 'images/' + currPhoto_link);
                    descriptionFinal.html("Please move " + currDescription + " to BOTTOM..");
                    last_value_joy = 0;
                    waitingAction = "JOYSTICK_Y_BOTTOM";
                    waitingID = can_id;
                }

                break;
        }

    }

    //goto Next step with result in param
    function nextStepFinal(result) {
        indexFinal++;
        timerBloc.html("");
        clearInterval(intervalGlobal);
        var line = "";
        if (result == "ok") {
            if(SRTLfinalTest == 1){
                line = "<div class='line' data-standard='" + currStandardName + "' data-issrtl='1' data-enablesrtl= '"+currEnableSRTL+"' data-safetysrtl= '"+currSafetySRTL+"' data-enablesrtlrel= '"+currEnableSRTLrel+"' data-safetysrtlrel= '"+currSafetySRTL+"' data-enablef='" + enableF + "' data-enablet='" + enableT + "' data-enablefrel='" + enableFrel + "' data-enabletrel='" + enableTrel + "' data-safetyf='"+safetyF+"' data-safetyt='"+safetyT+"' data-safetyfrel='"+safetyFrel+"' data-safetytrel='"+safetyTrel+"' data-iscdrh='" + isCdrh + "' data-isenable='" + isEnable + "' data-issafety='" + isSafety + "'><span class='symbol'>" + currSymbol_name + "</span> - <span class='description'>" + currDescription + "</span><span class='type'>" + currType + "</span><span class='result green'>TEST OK</span></div>";
            }else{
                line = "<div class='line' data-standard='" + currStandardName + "' data-issrtl='0' data-enablesrtl= '' data-safetysrtl= '' data-enablesrtlrel= '' data-safetysrtlrel= '' data-enablef='" + enableF + "' data-enablet='" + enableT + "' data-enablefrel='" + enableFrel + "' data-enabletrel='" + enableTrel + "' data-safetyf='"+safetyF+"' data-safetyt='"+safetyT+"' data-safetyfrel='"+safetyFrel+"' data-safetytrel='"+safetyTrel+"' data-iscdrh='" + isCdrh + "' data-isenable='" + isEnable + "' data-issafety='" + isSafety + "'><span class='symbol'>" + currSymbol_name + "</span> - <span class='description'>" + currDescription + "</span><span class='type'>" + currType + "</span><span class='result green'>TEST OK</span></div>";
            }
            if (isEnable == 1) {
                waitingEnableAndSafety = 0;
                sendSignalPic("2");
            }else if(isSafety == 1){
                waitingEnableAndSafety = 0;
                sendSignalPic("2");
            }
        } else {
            if(SRTLfinalTest == 1){
                line = "<div class='line' data-standard='" + currStandardName + "' data-issrtl='1' data-enablesrtl= '"+currEnableSRTL+"' data-safetysrtl= '"+currSafetySRTL+"' data-enablesrtlrel= '"+currEnableSRTLrel+"' data-safetysrtlrel= '"+currSafetySRTLrel+"' data-enablef='" + enableF + "' data-enablet='" + enableT + "' data-enablefrel='" + enableFrel + "' data-enabletrel='" + enableTrel + "' data-safetyf='"+safetyF+"' data-safetyt='"+safetyT+"' data-safetyfrel='"+safetyFrel+"' data-safetytrel='"+safetyTrel+"' data-iscdrh='" + isCdrh + "' data-isenable='" + isEnable + "' data-issafety='" + isSafety + "'><span class='symbol'>" + currSymbol_name + "</span> - <span class='description'>" + currDescription + "</span><span class='type'>" + currType + "</span><span class='result red'>TEST FAIL</span></div>";
            }else{
                line = "<div class='line' data-standard='" + currStandardName + "' data-issrtl='0' data-enablesrtl= '' data-safetysrtl= '' data-enablesrtlrel= '' data-safetysrtlrel= '' data-enablef='" + enableF + "' data-enablet='" + enableT + "' data-enablefrel='" + enableFrel + "' data-enabletrel='" + enableTrel + "' data-safetyf='"+safetyF+"' data-safetyt='"+safetyT+"' data-safetyfrel='"+safetyFrel+"' data-safetytrel='"+safetyTrel+"' data-iscdrh='" + isCdrh + "' data-isenable='" + isEnable + "' data-issafety='" + isSafety + "'><span class='symbol'>" + currSymbol_name + "</span> - <span class='description'>" + currDescription + "</span><span class='type'>" + currType + "</span><span class='result red'>TEST FAIL</span></div>";
            }
                errorTestFinal++;
            if (isEnable == 1) {
                waitingEnableAndSafety = 0;
                sendSignalPic("2");
            }else if(isSafety == 1){
                waitingEnableAndSafety = 0;
                sendSignalPic("2");
            }
        }
        recapListFinal.append(line);
        var d = recapListFinal.get(0);
        d.scrollTop = d.scrollHeight;
        if (indexFinal < maxIndexFinal) {
            if(isSafety == 1){
                $("#testfinal_container").addClass("hidden");
                $("#user_wait span").html("Please wait for Emergency Stop button resetting...");
                $("#user_wait").removeClass("hidden");
                if(globalName == "ELEGANCE"){
                    sendSignalPic("5");
                    setTimeout(function(){
                        sendSignal(startNodeMsg);
                        if(typeChoice == "AGILA"){
                            setTimeout(function(){
                                var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                                sendSignal(sign);
                            },100)                    
                        }
                        displayFinalTest(indexFinal);
                        $("#user_wait").addClass("hidden");
                        $("#testfinal_container").removeClass("hidden");
                    },11000)
                }
            }else{
                displayFinalTest(indexFinal);
            }            
        } else {
            stopFinalTest("end");
        }
    }

    //Gestion du timer
    function launchTimer(timer) {
        var time = timer * 1000;
        intervalGlobal = setInterval(function () {
            if (timer <= 0) {
                if (currType == "led" || currType == "display") {
                    console.log("send signal " + currType);
                    sendSignal(currSignalStop)
                }else if(currType == "led_spe"){
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300144000000");
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300257000000");
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F0030034E000000");
                }
                nextStepFinal("fail");
            } else {
                if (validateTest == 1) {
                    pressValueContinue = 0;
                    releaseValueContinue = 0;
                    hardwareValidation = 0;
                    hardwareValidationReleased = 0;
                    validateTest = 0;
                    waitingAction = "";
                    nextStepFinal("ok");
                    
                }
                timerBloc.html(Math.round(timer));
                timer -= 0.1;
            }
        }, 100);
    }

    //Interrupt or end Final test
    function stopFinalTest(result) {
        switch (result) {
            case "interrupted":
                $(".stop_test_bloc .result_title").html("Final test has been interrupted");
                clearInterval(intervalGlobal);
                break;
            case "end":
                var pourcentage = 100;
                progressBarFinalInside.css('width', pourcentage + '%');
                progressBarFinal.html(pourcentage + '%');
                if (errorTestFinal > 0) {
                    $(".stop_test_bloc .result_title").html("Final test is completed with " + errorTestFinal + " error(s)");
                } else {
                    $(".stop_test_bloc .result_title").html("Final test is completed succesfully");
                    $(".print_tst").removeClass("hidden");
                }
                break;
        }
        nameFinalContainer.addClass("hidden");
        timerBloc.addClass("hidden");
        imgFinalBloc.addClass("hidden");
        stopTestBloc.removeClass("hidden");
        $("#stop_final_test").addClass("hidden");
        $("#next_final_test").addClass("hidden");

        _MODE = "PRETEST";
    }

    function generateJsonLogFinal() {
        var jsonLogFinal = [];
        var name;
        var description;
        var result;
        var type;
        var standardName;
        var enableF;
        var enableT;
        var safetyF;
        var safetyT;
        var enableFrel;
        var enableTrel;
        var safetyFrel;
        var safetyTrel;
        var isCdrh;
        var isEnable = 0;
        var isSafety = 0;
        var isSRTL = 0;
        var enableSRTL = 0;
        var safetySRTL = 0;
        var enableSRTLrel;
        var safetySRTLrel;
        
        var currentdate = new Date();
        var day = currentdate.getDate(); if (String(day).length <=1){day = "0"+day};
        var month = currentdate.getMonth() + 1; if (String(month).length <=1){month = "0"+month};
        var hour = currentdate.getHours(); if (String(hour).length <=1){hour = "0"+hour};
        var minutes = currentdate.getMinutes(); if (String(minutes).length <=1){minutes = "0"+minutes};
        var datetime = day + "/" + month + "/" + currentdate.getFullYear() + " " + hour + "h" + minutes;
        
        $("#recap_list_t .content_recap .line").each(function () {
            name = $(this).find('.symbol').html();
            description = $(this).find('.description').html();
            type = $(this).find('.type').html();
            result = $(this).find('.result').html();
            standardName = $(this).data('standard');
            enableF = $(this).data('enablef');
            enableT = $(this).data('enablet');
            safetyF = $(this).data('safetyf');
            safetyT = $(this).data('safetyt');
            enableSRTL = $(this).data('enablesrtl');
            safetySRTL = $(this).data('safetysrtl');
            enableFrel = $(this).data('enablefrel');
            enableTrel = $(this).data('enabletrel');
            safetyFrel = $(this).data('safetyfrel');
            safetyTrel = $(this).data('safetytrel');
            enableSRTLrel = $(this).data('enablesrtlrel');
            safetySRTLrel = $(this).data('safetysrtlrel');
            isCdrh = $(this).data('iscdrh');
            isEnable = $(this).data('isenable');
            isSafety = $(this).data('issafety');
            isSRTL = $(this).data('issrtl');

            jsonLogFinal.push({name: name, standard_name: standardName, description: description, type: type, result: result, enable_freq: enableF, enable_freq_rel:enableFrel, enable_tens: enableT, enable_tens_rel:enableTrel, safety_freq: enableF, safety_freq_rel:safetyFrel, safety_tens: enableT,safety_tens_rel:safetyTrel, is_cdrh: isCdrh, is_enable: isEnable, is_safety: isSafety, is_srtl:isSRTL, safety_srtl:safetySRTL, safety_srtl_rel:safetySRTLrel, enable_srtl:enableSRTL, enable_srtl_rel:enableSRTLrel});
        });
        jsonLogFinal = JSON.stringify(jsonLogFinal);
        console.log(jsonLogFinal);
        

        $.ajax({
            type: "POST",
            url: "php/api.php?function=save_log_final",
            data: {jsonlog: jsonLogFinal, sn: serialNumber, pn: partNumber, sso: userSSO, nodeId:nodeID, FWfctV: FWfctV, FWcalibV: FWcalibV, SWv: SWv, enableTens: initial_enable_tens, enableFreq: initial_enable_freq, safetyTens:initial_safety_tens, safetyFreq:initial_safety_freq, alimTestbench: currGlobalVoltage, alimTsui: currTsuiVoltage, jsonCalibLog : calibLogJSON, isSRTL:SRTLfinalTest, shouldHaveSRTL:shouldHaveSRTL, initialSafetySRTL:initial_safety_srtl, initialEnableSRTL:initial_enable_srtl, is_manufacturing:modeManufacturing},
            success: function (msg) {
                alert("Your log has been saved.");
                printJsonLogFinal(jsonLogFinal, serialNumber, partNumber, userSSO, nodeID, FWfctV, FWcalibV, SWv, currGlobalVoltage, currTsuiVoltage, initial_enable_freq, initial_enable_tens, initial_safety_freq, initial_safety_tens, calibLogJSON, datetime, SRTLfinalTest, shouldHaveSRTL, initial_safety_srtl, initial_enable_srtl);
            }
        });
    }

    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printJsonLogFinal(jsonLogFinal, serialNumber, partNumber, userSSO, nodeID, FWfctV, FWcalibV, SWv, currGlobalVoltage, currTsuiVoltage, initial_enable_freq, initial_enable_tens, initial_safety_freq, initial_safety_tens, calibLogJSON, datetime, SRTLfinalTest, shouldHaveSRTL, initial_safety_srtl, initial_enable_srtl) {
        var msg = JSON.parse(jsonLogFinal);
        var msgCalib = JSON.parse(calibLogJSON);
        var lineButton = "";
        var lineSafety = "";
        var lineLed = "";
        var lineDisplay = "";
        var lineJoystick = "";
        var lineBuzzer = "";
        var lineCalib = "";
        var counterCalibServ = 0;
        var counterCalibSwitch = 0;
        var lineCalibJoystick = "<h4>Joysticks calibration</h4><h5>Test is PASS when axis raw value is in the range of acceptance from database. </h5><div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Action</b></span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Raw Data</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Zero Range</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Axis Range</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Result</b></span></div>";
        var lineCalibService = "<h4>Service button</h4><h5>Test is PASS when user correctly checks press/release actions on the button. </h5><div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Action</b></span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Result</b></span></div>";
        var lineCalibSwitch = "<h4>Switch position</h4><h5>Test is PASS when user correctly checks switch positions. </h5><div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Action</b></span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Result</b></span></div>";
        var lsl = 21.6;
        var usl = 26.4;
        var testAlimGlobal;
        var testAlimTSUI;
        
        if(shouldHaveSRTL == 0 || shouldHaveSRTL == "0"){
            var shouldHaveSRTLtxt = "No";
        }else{
            var shouldHaveSRTLtxt = "Yes";
        }
        if(SRTLfinalTest == 0 || SRTLfinalTest == "0"){
            var SRTLfinalTesttxt = "FAIL";
        }else{
            var SRTLfinalTesttxt = "PASS";
        }
        
        if (currGlobalVoltage != "undefined" && currTsuiVoltage) {
            currGlobalVoltage = parseFloat(currGlobalVoltage).toFixed(2);
        }
        if (currTsuiVoltage != "undefined" && currTsuiVoltage) {
            currTsuiVoltage = parseFloat(currTsuiVoltage).toFixed(2);
        }        
        if (initial_enable_tens != "undefined" && initial_enable_tens) {
            initial_enable_tens = parseFloat(initial_enable_tens).toFixed(2);
        }        
        if (initial_safety_tens != "undefined" && initial_safety_tens) {
            initial_safety_tens = parseFloat(initial_safety_tens).toFixed(2);
        }

        if (lsl < currGlobalVoltage && usl > currGlobalVoltage) {
            testAlimGlobal = "Pass"
        } else {
            testAlimGlobal = "Fail"
        }
        if (lsl < currTsuiVoltage && usl > currTsuiVoltage) {
            testAlimTSUI = "Pass"
        } else {
            testAlimTSUI = "Fail"
        }
        
        for (var i = 0; i < msg.length; i++) {
            if(msg[i].result == "TEST OK"){
                msg[i].result = "PASS";
            }else{
                msg[i].result = "FAIL";
            }            
            if (msg[i].type == "button" && msg[i].is_safety == "0") {
                if(msg[i].is_srtl =="1"){                    
                        var enabletens = msg[i].enable_srtl;                    
                        var enablefreq = ""; 
                        var enabletensrel = msg[i].enable_srtl_rel;                    
                        var enablefreqrel = ""; 
                }else{
                    if (msg[i].enable_tens !== "") {
                        var enabletens = msg[i].enable_tens.toFixed(2) + "V"
                    } else {
                        var enabletens = ""
                    }
                    if (msg[i].enable_tens_rel !== "") {
                        var enabletensrel = msg[i].enable_tens_rel.toFixed(2) + "V"
                    } else {
                        var enabletensrel = ""
                    }
                    if (msg[i].enable_freq !== "") {
                        var enablefreq = msg[i].enable_freq + "Hz / "
                    } else {
                        var enablefreq = ""
                    }
                    if (msg[i].enable_freq_rel !== "") {
                        var enablefreqrel = msg[i].enable_freq_rel + "Hz / "
                    } else {
                        var enablefreqrel = ""
                    }
                }               
                
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-"
                } else {
                    msg[i].is_enable = "Y"
                }                
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>PRESS</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + enablefreq + enabletens + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_enable + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                line += "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>RELEASE</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + enablefreqrel + enabletensrel + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_enable + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                lineButton += line;
            }
            if (msg[i].type == "button" && msg[i].is_safety == "1") {
                 if(msg[i].is_srtl == "1"){                    
                    var safetytens = msg[i].safety_srtl;                    
                    var safetyfreq = ""; 
                    var safetytensrel = msg[i].safety_srtl_rel;                    
                    var safetyfreqrel = ""; 
                }else{
                    //alert(msg[i].safety_tens_rel + " "+msg[i].safety_freq_rel);
                    if (msg[i].safety_tens !== "") {
                        var safetytens = msg[i].safety_tens.toFixed(2) + "V"
                    } else {
                        var safetytens = ""
                    }
                    if (msg[i].safety_tens_rel !== "" ) {
                        var safetytensrel = msg[i].safety_tens_rel + "V"
                    } else {
                        var safetytensrel = ""
                    }
                    if (msg[i].safety_freq !== "") {
                        var safetyfreq = msg[i].safety_freq + "Hz / "
                    } else {
                        var safetyfreq = ""
                    }
                    if (msg[i].safety_freq_rel !== "" ) {
                        var safetyfreqrel = msg[i].safety_freq_rel + "Hz / "
                    } else {
                        var safetyfreqrel = ""
                    }
                }
                if (msg[i].is_safety == 0) {
                    msg[i].is_safety = "-"
                } else {
                    msg[i].is_safety = "Y"
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>PRESS</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + safetyfreq + safetytens + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_safety + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                line += "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>RELEASE</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + safetyfreqrel + safetytensrel + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_safety + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                lineSafety += line;
            }
            if (msg[i].type == "led") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-";
                } else {
                    msg[i].is_enable = "Y";
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-";
                } else {
                    msg[i].is_cdrh = "Y";
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                lineLed += line;
            }
            if (msg[i].type == "display") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-";
                } else {
                    msg[i].is_enable = "Y";
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-";
                } else {
                    msg[i].is_cdrh = "Y"
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                lineDisplay += line;
            }
            if (msg[i].type == "buzzer") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-"
                } else {
                    msg[i].is_enable = "Y"
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                lineBuzzer += line;
            }
            if (msg[i].type == "joystick") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-"
                } else {
                    msg[i].is_enable = "Y"
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                if (msg[i].result == "TEST OK" || msg[i].result == "PASS") {
                    var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>LEFT</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                    line += "<div style='margin-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>RIGHT</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                    line += "<div style='margin-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>TOP</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                    line += "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>BOTTOM</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                }else{
                    var line = "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>--</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>FAIL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>FAIL</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                }
                lineJoystick += line;
            }

        }
        for (var i = 0; i < msgCalib.length; i++){            
            if(msgCalib[i].type == "joystick"){
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgCalib[i].description+"</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>"+msgCalib[i].result+"</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'> "+msgCalib[i].minZero+"  - | "+msgCalib[i].maxZero+" |</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>| "+msgCalib[i].minAxis+" | - | "+msgCalib[i].maxAxis+" |</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>PASS</span></div>";
                lineCalibJoystick += line;
            }else if(msgCalib[i].type == "service"){
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgCalib[i].description+"</span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>"+msgCalib[i].result+"</span></div>";
                lineCalibService += line;
                counterCalibServ++;
            }else if(msgCalib[i].type == "switch"){
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgCalib[i].description+"</span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>"+msgCalib[i].result+"</span></div>";
                lineCalibSwitch += line;
                counterCalibSwitch++;
            }            
        }
        if(counterCalibServ > 0){
            lineCalib += lineCalibService;
        }
        if(counterCalibSwitch > 0){
            lineCalib += lineCalibSwitch;
        }
        lineCalib += lineCalibJoystick;
        
        var lineInitial ="";
        if(shouldHaveSRTL == 0 || shouldHaveSRTL == "0"){
            if(initial_enable_freq == 0){var testResultInitialEnableFreq = "Pass"}else{var testResultInitialEnableFreq = "Fail"}
            if(initial_enable_tens == 0){var testResultInitialEnableTens = "Pass"}else{var testResultInitialEnableTens = "Fail"}
            if(initial_safety_freq >= 1800 && initial_safety_freq <= 2200){var testResultInitialSafetyFreq = "Pass"}else{var testResultInitialSafetyFreq = "Fail"}
            if(initial_safety_tens >= 21.6 && initial_safety_tens <= 26.4){var testResultInitialSafetyTens = "Pass"}else{var testResultInitialSafetyTens = "Fail"}
            if(initial_enable_srtl == 0 ){var testInitialSRTLenable = "Pass"}else{var testInitialSRTLenable = "Fail"}
            if(initial_safety_srtl == 0 ){var testInitialSRTLsafety = "Pass"}else{var testInitialSRTLsafety = "Fail"}
            
            lineInitial = "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measured Value</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>LSL</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>USL</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Pass/Fail</b></span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Enable Frequency</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_enable_freq+"Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialEnableFreq+"</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Enable Voltage</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_enable_tens+"V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialEnableTens+"</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Safety Frequency</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_safety_freq+"Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>1800Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>2200Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialSafetyFreq+"</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Safety Voltage</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_safety_tens+"V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>21.6V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>26.4V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialSafetyTens+"</span></div>";
        }else{
            lineInitial = "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Value</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Required Value</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Pass/Fail</b></span></div>"
            + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Test SRTL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+SRTLfinalTesttxt+"</span></div>"
            + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Enable SRTL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_enable_srtl+"</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testInitialSRTLenable+"</span></div>"
            + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Safety SRTL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_safety_srtl+"</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testInitialSRTLsafety+"</span></div>"
        }
        
        var myWindow = window.open('', '', 'width=1000,height=800');
        myWindow.document.write(
                "<h2>FINAL TEST LOG RECORD - " + datetime + "</h2>"
                + "<div style='border:1px solid black;padding:5px;'>"
                + "<b>PN</b> : " + partNumber + " - <b>SN</b> : " + serialNumber + " - <b>SSO</b> : " + userSSO + " - <b>FW Fonct. V.</b> : " + FWfctV + " - <b>FW Calib. V.</b> : " + FWcalibV + " - <b>Software Version</b> : " + SWv + " - <b>SRTL</b> : "+shouldHaveSRTLtxt+" - <b>Node ID</b> : "+nodeID+"</div>"
                + "<h3>POWER TEST</h3><div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measured Value</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>LSL</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>USL</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Pass/Fail</b></span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>V alimentation</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + currTsuiVoltage + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + lsl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + usl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testAlimGlobal + "</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>V TSUI</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + currGlobalVoltage + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + lsl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + usl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testAlimTSUI + "</span></div>"
                + "</div>"                
                + "<h3>INITIAL STATES</h3><div>"
                + "<div>"+lineInitial+"</div>"
                + "<h3>BUTTONS</h3>"
                + "<h5>Test is PASS when CAN signal press is present and CAN signal release is present.<br>When tested entry is Enable, test is PASS if measured values are between 1800Hz-2200Hz and 21.6V-26.4V.<b>If SRTL is active and tested entry is Enable, test is PASS if measured bit is 1 for press and 0 for release.</h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measure</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Enable</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" +lineButton+"</div>"
                + "<h3>EMERGENCY STOP (SAFETY LOOP)</h3>"
                + "<h5>Test is PASS when CAN signal press is present and CAN signal release is present.<br>When tested entry is Safety, test is PASS if measured values are 0Hz and 0V.<br>If SRTL is active and tested entry is Safety, test is PASS if measured bit is 1 for press and 1 for release.</h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measure</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Safety</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" +lineSafety+"</div>"
                + "<h3>BACKLIGHTS</h3>"
                + "<h5>Test is PASS when user has confirmed light is lit. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineLed + "</div>"
                + "<h3>7 SEGMENTS DISPLAYS</h3>"
                + "<h5>Test is PASS when user has confirmed 8 is lit. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineDisplay + "</div>"
                + "<h3>CALIBRATION (calibration FW)</h3>"                
                + "<div>" + lineCalib + "</div>"
                + "<h3>JOYSTICKS (functionnal FW)</h3>"
                + "<h5>Test is PASS when axis value reaches +/-100%. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Linearity Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Range Result</b></span><span style='display:inline-block;vertical-align:top;width:80px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineJoystick + "</div>"
                + "<h3>BUZZER</h3>"
                + "<h5>Test is PASS when user has confirmed he heard TSUI buzzer. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineBuzzer + "</div>"
                );
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }

    function setEnableAndSafetyValues(type) {
        if(type== "enable"){
            enableF = currEnableF;
            enableT = currEnableT;
            safetyT = currSafetyT;
            safetyF = currSafetyF;
            if((enableF >= 1800 && enableT <= 21.6) || ((enableF <= 1800 && enableT >= 21.6)) || ((enableF <= 1800 && enableT <= 21.6)) ){
                if(SRTLfinalTest == 1 && enableSRTLfinal == "1"){
                    currEnableSRTL = "1";
                    hardwareValidation = 1;
                }else{
                    currEnableSRTL = "0";
                    hardwareValidation = 0;
                }
            }
            else{
                hardwareValidation = 1;
            }
        }else if(type== "safety"){
            enableF = currEnableF;
            enableT = currEnableT;
            safetyT = currSafetyT;
            safetyF = currSafetyF;
            if((safetyF >= 200 && safetyT <= 2.4) || ((safetyF <= 200 && safetyT >= 2.4)) || ((safetyF >= 200 && safetyT >= 2.4)) ){                   
                hardwareValidation = 0;
            }else{
                if(SRTLfinalTest == 1 && safetySRTLfinal == "1"){
                    currSafetySRTL = "1";
                    hardwareValidation = 1;
                }else if(SRTLfinalTest == 1 && safetySRTLfinal == "0"){
                    currSafetySRTL = "0";
                    hardwareValidation = 0;
                }else{
                    hardwareValidation = 1;
                }
            }
        }        
    }
    
    function setEnableAndSafetyValuesRel(type) {
        if(type== "enable"){
            enableFrel = currEnableF;
            enableTrel = currEnableT;
            safetyTrel = currSafetyT;
            safetyFrel = currSafetyF;
            
            if(enableFrel == 0 && enableTrel == 0){
                if(SRTLfinalTest == 1 && enableSRTLfinal == "0"){
                    currEnableSRTLrel = "0";
                    hardwareValidationReleased = 1;
                }else if(SRTLfinalTest == 1 && enableSRTLfinal == "1"){
                    currEnableSRTLrel = "1";
                    hardwareValidationReleased = 0;
                }else{
                    hardwareValidationReleased = 1;
                }
            }
            else{
                hardwareValidationReleased = 0;
            }
        }else if(type== "safety"){
            enableFrel = currEnableF;
            enableTrel = currEnableT;
            
            safetyTrel = currSafetyT;
            safetyFrel = currSafetyF;
            console.log("on entre dans la fct avec les valeurs sTens: "+safetyTrel+" et sFreq: "+safetyFrel+"  ===================================================="); 
            if((safetyTrel == 0 && safetyFrel == 0) || (safetyTrel == "0" && safetyFrel == "0")){
                if(SRTLfinalTest == 1 && safetySRTLfinal == "1"){
                    currSafetySRTLrel = "1";
                    hardwareValidationReleased = 1;
                }else if(SRTLfinalTest == 1 && safetySRTLfinal == "0"){
                    currSafetySRTLrel = "0";
                    hardwareValidationReleased = 0;
                }else{
                    console.log("on entre dans la fct et on valide le hw rel  ===================================================="); 
                    hardwareValidationReleased = 1;
                }
            }
            else{
                console.log("on entre dans la fct et on ne valide PAS le hw rel  ===================================================="); 
                hardwareValidationReleased = 0;
            }
        }        
    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// CALIBRATION //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var Cal_post = "002400806d68d7551407f09b861e3aad000549a844";
    var Cal_dlc = "080000";
    var Cal_data_pre = "401f54";
    var Cal_completion = "00000000";
    var axisRawZeroLong;
    var axisRawZeroLat;
    var axisRawMaxLong;
    var axisRawMinLong;
    var axisRawMaxLat;
    var axisRawMinLat;

    $(".eprom_protect .bt_eprom").on('click', function () {
        if ($(".eprom_protect").hasClass("protected")) {
            $(".img_eprom").attr('src', "images/unprotected.png");
            $(this).html("LOCK EEPROM");
            $(this).css({"background": "#3b73b9", "color": "white"});
            $(".txt_eprom").html("EEPROM is writable");
            sendSignal(Cal_post + Cal_dlc + cobID2 + "2f00550100000000");
            $(".eprom_protect").removeClass("protected");
        } else {
            $(".img_eprom").attr('src', "images/protected.png");
            $(this).html("UNLOCK EEPROM");
            $(this).css({"background": "#c4c4c4", "color": "black"});
            $(".txt_eprom").html("EEPROM is protected");
            sendSignal(Cal_post + Cal_dlc + cobID2 + "2f00550101000000");
            $(".eprom_protect").addClass("protected");
        }
    });
    
    $(".get_switch").on('click', function () {
        _MODE = "CALIBRATION";
        var pingSignal = Cal_post+"040000"+cobID2+"40006001";
        sendSignal(pingSignal);
        waitPingResponse = cobID1;
        var switch_position;
        setTimeout(function () {
             var response = finalResponseData.substring(8,10);
             switch(response){
                 case "00":
                     if(switchPosNumber == 4){
                         switch_position = "left";
                     }                     
                     break;
                 case "08":
                     if(switchPosNumber == 4){
                        switch_position = "front";
                    }else{
                        switch_position = "right";
                    }
                     break;
                 case "10":
                    if(switchPosNumber == 4){
                        switch_position = "right";
                    }else{
                        switch_position = "left";
                    }
                    break;
                 case "18":
                     if(switchPosNumber == 4){
                        switch_position = "back";
                    }else{
                        switch_position = "middle";
                    }
                     break;
             }
             $(".position_result span").html(switch_position);
        }, 200);
        
    });
    
    $(".serv_bt_check").on('click', function(){
        var _this = $(this);
        testServiceButton(_this);
    });
    $(".validate_step1_calib").on('click', function(){
        var errorNB = testStep1Calibration();
        if(errorNB == 0){
            getStep1CalibrationLog();
            $(".calibration_step_1").addClass("hidden");
            $(".calibration_step_2").removeClass("hidden");
        }else{
            alert("Switch position test or Service button test is not complete/valid.")
        }
    })

    function startCalibrate(subindexX, subindexY, id) {
        _MODE = "CALIBRATION";
        calibrateContainer.find(".id" + id + " .calibrate_tool").removeClass("hidden");
        if (subindexX !== "null" && subindexX !== "undefined" && subindexX) {
            
            calibrateZeroLong(subindexX, subindexY, id);
        } else {
            calibrateMinLat(subindexX, subindexY, id);
        }
    }
    function startCalibrateMushroom(subindex, id) {
        _MODE = "CALIBRATION";
        calibrateContainer.find(".id" + id + " .calibrate_tool").removeClass("hidden");
        mushroomCalculation(subindex, id)
    }
    function mushroomCalculation(subindex, identifier) {
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("FixSlope & ZeroDead");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/zero_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var zeroDeadXaxisSignal = Cal_post + Cal_dlc + cobID2 + "40" + subindex + "05" + Cal_completion;
            sendSignal(zeroDeadXaxisSignal);
            waitCalibResponse = cobID1;
            setTimeout(function () {
                var zeroDeadX = finalResponseData;
                $(".mushroom_verify.id"+identifier).find(".zero_dead_x").html(convertHexa2(zeroDeadX));
                
                var zeroDeadYaxisSignal = Cal_post + Cal_dlc + cobID2 + "40" + subindex + "06" + Cal_completion;
                sendSignal(zeroDeadYaxisSignal);
                waitCalibResponse = cobID1;
                setTimeout(function () {
                    var zeroDeadY = finalResponseData;
                    $(".mushroom_verify.id"+identifier).find(".zero_dead_y").html(convertHexa2(zeroDeadY));
                    
                    var fixSlopeX = Cal_post + Cal_dlc + cobID2 + "40" + subindex + "09" + Cal_completion;
                    sendSignal(fixSlopeX);
                    waitCalibResponse = cobID1;
                    setTimeout(function () {
                        var fixSlopeXresp = finalResponseData;
                        $(".mushroom_verify.id"+identifier).find(".fix_slope_x").html(convertHexa2(fixSlopeXresp));
                        
                        var fixSlopeY = Cal_post + Cal_dlc + cobID2 + "40" + subindex + "0a" + Cal_completion;
                        sendSignal(fixSlopeY);
                        waitCalibResponse = cobID1;
                        setTimeout(function () {
                            var fixSlopeYresp = finalResponseData;
                            $(".mushroom_verify.id"+identifier).find(".fix_slope_y").html(convertHexa2(fixSlopeYresp));
                            
                        }, 200);
                    }, 200);
                }, 200);
             }, 200);
             
            

           

            
            console.log("on a envoyé les 4 messages de debut");
            setTimeout(function(){
                mushroomZeroPosAcquisition(subindex, identifier);
            },500)
            

        });
    }
    function mushroomZeroPosAcquisition(subindex, identifier) {
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Set Zero Position");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/zero_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var axisRawSignalX = Cal_post + Cal_dlc + cobID2 + "400154" + "01";
            console.log("ping 01 axisrawX");
            sendSignal(axisRawSignalX);
            waitCalibResponse = cobID1;

            setTimeout(function () {
                axisRawZeroLong = finalResponseData;
                var newSignal = signalComposer(axisRawZeroLong, subindex, "03"); //param = response + header for zero long 
                console.log("lecture ping 01 axisrawX + envoi sur 03");
                sendSignal(newSignal);
                $(".mushroom_verify.id"+identifier).find(".axis_raw_x").html(convertHexa2(axisRawZeroLong));
                
                setTimeout(function () {
                    var axisRawSignalY = Cal_post + Cal_dlc + cobID2 + "400154" + "02";
                    console.log("ping 02 axisrawY");
                    sendSignal(axisRawSignalY);

                    waitCalibResponse = cobID1;

                    setTimeout(function () {
                        axisRawZeroLat = finalResponseData;
                        console.log("lecture ping 02 axisrawX + envoi sur 04");
                        var newSignal = signalComposer(axisRawZeroLat, subindex, "04"); //param = response + header for zero long   
                        sendSignal(newSignal);
                        $(".mushroom_verify.id"+identifier).find(".axis_raw_y").html(convertHexa2(axisRawZeroLat));
                        
                        resetCalibration(identifier);

                    }, 200);
                }, 300)


            }, 200);


        });
    }


    function signalComposer(response, header, subIndex) {
        var newSignal;
        if (response.length == 2) {
            newSignal = Cal_post + Cal_dlc + cobID2 + "2f" + header + subIndex + response + "000000";
            console.log("nouveau signal envoyé : " + newSignal);
        } else if (response.length == 4) {
            newSignal = Cal_post + Cal_dlc + cobID2 + "2b" + header + subIndex + response + "0000";
            console.log("nouveau signal envoyé : " + newSignal);
        } else if (response.length == 8) {
            newSignal = Cal_post + Cal_dlc + cobID2 + "23" + header + subIndex + response;
            console.log("nouveau signal envoyé : " + newSignal);
        } else {
            console.log("nouveau signal envoyé : " + newSignal);
        }
        return newSignal;
    }

    //Recuperation de la position Longitudinale et stockage dans l'EPROM
    function calibrateZeroLong(subindexX, subindexY, identifier) {
        var seuilMinZero = $(".bloc_calibrate.id" + identifier).data("minzero");
        var seuilMaxZero = $(".bloc_calibrate.id" + identifier).data("maxzero");
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Set ZERO position");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/zero_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var axisRawSignalX = Cal_post + Cal_dlc + cobID2 + Cal_data_pre + subindexX + Cal_completion;

            sendSignal(axisRawSignalX);
            waitCalibResponse = cobID1;

            setTimeout(function () {
                axisRawZeroLong = finalResponseData;
                var a1 = axisRawZeroLong.substring(0, 2);
                var a2 = axisRawZeroLong.substring(2, 4);
                var afinal = a2 + a1;
                var afinalSigned = convertHexa2(afinal);
                afinal = convertHexa2(afinal);                
                afinal = Math.abs(afinal);
                console.log(afinal, seuilMinZero, seuilMaxZero);

                if (seuilMinZero <= afinal && afinal < seuilMaxZero && modeEngineering == 0) {
                    $(".realtime_joysticks_val.id" + identifier).find(".raw_zero_x").html(afinalSigned);
                    var newSignal = signalComposer(axisRawZeroLong, "2054", subindexX); //param = response + header for zero long                
                    sendSignal(newSignal);
                    calibrateMaxLong(subindexX, subindexY, identifier);
                }else if(modeEngineering == 1){
                    $(".realtime_joysticks_val.id" + identifier).find(".raw_zero_x").html(afinalSigned);
                    var newSignal = signalComposer(axisRawZeroLong, "2054", subindexX); //param = response + header for zero long                
                    sendSignal(newSignal);
                    calibrateMaxLong(subindexX, subindexY, identifier);
                }

            }, 200);
        });
    }
    function calibrateMaxLong(subindexX, subindexY, identifier) {
        var seuilMinAxis = $(".bloc_calibrate.id" + identifier).data("minaxis");
        var seuilMaxAxis = $(".bloc_calibrate.id" + identifier).data("maxaxis");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Set RIGHT position max");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/right_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var axisRawSignalX = Cal_post + Cal_dlc + cobID2 + Cal_data_pre + subindexX + Cal_completion;

            sendSignal(axisRawSignalX);
            waitCalibResponse = cobID1;
            setTimeout(function () {
                axisRawMaxLong = finalResponseData;
                var a1 = axisRawMaxLong.substring(0, 2);
                var a2 = axisRawMaxLong.substring(2, 4);
                var afinal = a2 + a1;
                var afinalSigned = convertHexa2(afinal);
                afinal = convertHexa2(afinal);
                if(afinal > 0){
                    afinal = Math.abs(afinal);
                    console.log(afinal, seuilMinAxis, seuilMaxAxis);

                    if (seuilMinAxis <= afinal && afinal < seuilMaxAxis && modeEngineering == 0) {
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_max_x").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMaxLong, "2254", subindexX); //param = response + header for max long
                        sendSignal(newSignal);
                        calibrateMinLong(subindexX, subindexY, identifier);
                    }else if(modeEngineering == 1){
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_max_x").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMaxLong, "2254", subindexX); //param = response + header for max long
                        sendSignal(newSignal);
                        calibrateMinLong(subindexX, subindexY, identifier);
                    }
                }               

            }, 200);
        });
    }
    function calibrateMinLong(subindexX, subindexY, identifier) {
        var seuilMinAxis = $(".bloc_calibrate.id" + identifier).data("minaxis");
        var seuilMaxAxis = $(".bloc_calibrate.id" + identifier).data("maxaxis");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Set LEFT position max");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/left_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var axisRawSignalX = Cal_post + Cal_dlc + cobID2 + Cal_data_pre + subindexX + Cal_completion;
            sendSignal(axisRawSignalX);

            waitCalibResponse = cobID1;
            setTimeout(function () {
                axisRawMinLong = finalResponseData;
                var a1 = axisRawMinLong.substring(0, 2);
                var a2 = axisRawMinLong.substring(2, 4);
                var afinal = a2 + a1;
                var afinalSigned = convertHexa2(afinal);
                afinal = convertHexa2(afinal);
                if(afinal < 0){
                    afinal = Math.abs(afinal);
                    console.log(afinal, seuilMinAxis, seuilMaxAxis);

                    if (seuilMinAxis <= afinal && afinal <= seuilMaxAxis && modeEngineering == 0) {
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_min_x").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMinLong, "2154", subindexX); //param = response + header for min long
                        sendSignal(newSignal);
                        if (subindexY !== "null" && subindexY !== "undefined" && subindexY) {
                            calibrateMinLat(subindexX, subindexY, identifier);
                        } else {
                            resetCalibration(identifier);
                        }
                    }else if(modeEngineering == 1){
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_min_x").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMinLong, "2154", subindexX); //param = response + header for min long
                        sendSignal(newSignal);
                        if (subindexY !== "null" && subindexY !== "undefined" && subindexY) {
                            calibrateMinLat(subindexX, subindexY, identifier);
                        } else {
                            resetCalibration(identifier);
                        }
                    }
                }
            }, 200);
        });
    }

    //Recuperation de la position Verticale et stockage dans l'EPROM
    function calibrateMinLat(subindexX, subindexY, identifier) {
        var seuilMinAxis = $(".bloc_calibrate.id" + identifier).data("minaxis");
        var seuilMaxAxis = $(".bloc_calibrate.id" + identifier).data("maxaxis");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Set BOTTOM position max");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/down_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var axisRawSignalY = Cal_post + Cal_dlc + cobID2 + Cal_data_pre + subindexY + Cal_completion;
            sendSignal(axisRawSignalY);

            waitCalibResponse = cobID1;
            setTimeout(function () {
                axisRawMinLat = finalResponseData;
                var a1 = axisRawMinLat.substring(0, 2);
                var a2 = axisRawMinLat.substring(2, 4);
                var afinal = a2 + a1;
                var afinalSigned = convertHexa2(afinal);
                afinal = convertHexa2(afinal);
                if(afinal < 0){
                    afinal = Math.abs(afinal);
                    console.log(afinal, seuilMinAxis, seuilMaxAxis);

                    if (seuilMinAxis <= afinal && afinal < seuilMaxAxis && modeEngineering == 0) {
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_min_y").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMinLat, "2154", subindexY); //param = response + header for zero long
                        sendSignal(newSignal);
                        calibrateMaxLat(subindexX, subindexY, identifier);
                    }else if(modeEngineering == 1){
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_min_y").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMinLat, "2154", subindexY); //param = response + header for zero long
                        sendSignal(newSignal);
                        calibrateMaxLat(subindexX, subindexY, identifier);
                    }
                }
            }, 200);
        });
    }
    function calibrateMaxLat(subindexX, subindexY, identifier) {
        var seuilMinAxis = $(".bloc_calibrate.id" + identifier).data("minaxis");
        var seuilMaxAxis = $(".bloc_calibrate.id" + identifier).data("maxaxis");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Set TOP position max");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/top_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var axisRawSignalY = Cal_post + Cal_dlc + cobID2 + Cal_data_pre + subindexY + Cal_completion;
            sendSignal(axisRawSignalY);

            waitCalibResponse = cobID1;
            setTimeout(function () {
                axisRawMaxLat = finalResponseData;
                var a1 = axisRawMaxLat.substring(0, 2);
                var a2 = axisRawMaxLat.substring(2, 4);
                var afinal = a2 + a1;
                var afinalSigned = convertHexa2(afinal);
                afinal = convertHexa2(afinal);
                if(afinal > 0){
                    afinal = Math.abs(afinal);
                    console.log(afinal, seuilMinAxis, seuilMaxAxis);

                    if (seuilMinAxis <= afinal && afinal < seuilMaxAxis && modeEngineering == 0) {
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_max_y").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMaxLat, "2254", subindexY); //param = response + header for zero long
                        sendSignal(newSignal);
                        calibrateZeroLat(subindexX, subindexY, identifier);
                    }else if(modeEngineering == 1){
                        $(".realtime_joysticks_val.id" + identifier).find(".raw_max_y").html(afinalSigned);
                        var newSignal = signalComposer(axisRawMaxLat, "2254", subindexY); //param = response + header for zero long
                        sendSignal(newSignal);
                        calibrateZeroLat(subindexX, subindexY, identifier);
                    }
                }
            }, 200);
        });
    }
    function calibrateZeroLat(subindexX, subindexY, identifier) {
        var seuilMinZero = $(".bloc_calibrate.id" + identifier).data("minzero");
        var seuilMaxZero = $(".bloc_calibrate.id" + identifier).data("maxzero");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Set ZERO position");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("<img src='images/zero_arrow.png'>");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            var axisRawSignalY = Cal_post + Cal_dlc + cobID2 + Cal_data_pre + subindexY + Cal_completion;
            sendSignal(axisRawSignalY);

            waitCalibResponse = cobID1;
            setTimeout(function () {
                axisRawZeroLat = finalResponseData;
                var a1 = axisRawZeroLat.substring(0, 2);
                var a2 = axisRawZeroLat.substring(2, 4);
                var afinal = a2 + a1;
                var afinalSigned = convertHexa2(afinal);
                afinal = convertHexa2(afinal);
                afinal = Math.abs(afinal);
                console.log(afinal, seuilMinZero, seuilMaxZero);

                if (seuilMinZero <= afinal && afinal < seuilMaxZero && modeEngineering == 0) {
                    $(".realtime_joysticks_val.id" + identifier).find(".raw_zero_y").html(afinalSigned);
                    var newSignal = signalComposer(axisRawZeroLat, "2054", subindexY); //param = response + header for zero long
                    sendSignal(newSignal);
                    resetCalibration(identifier);
                }else if(modeEngineering == 1){
                    $(".realtime_joysticks_val.id" + identifier).find(".raw_zero_y").html(afinalSigned);
                    var newSignal = signalComposer(axisRawZeroLat, "2054", subindexY); //param = response + header for zero long
                    sendSignal(newSignal);
                    resetCalibration(identifier);
                }
            }, 200);
        });
    }
    
    function resetCalibration(identifier) {

        $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
        var nameJo = $(".bloc_calibrate.id" + identifier).find(".title_jauge").html();
        $(".bloc_calibrate.id" + identifier).find(".status_calib").html("Joystick "+nameJo+" is now calibrated");
        $(".bloc_calibrate.id" + identifier).find(".action_calib").html("");
        $(".bloc_calibrate.id" + identifier).find(".validate_calib").on('click', function () {
            $(".bloc_calibrate.id" + identifier).find(".calibrate_tool").addClass("hidden");
            $(".bloc_calibrate.id" + identifier).find("button").removeClass("hidden");
            $(".bloc_calibrate.id" + identifier).find(".validate_calib").off();
            $(".statut_calibration_verif").removeClass("hidden");
            $(".statut_calibration_verif").find(".id" + identifier + "").remove();
            
            $(".statut_calibration_verif .content").append("<div class='line_validate_calib id" + identifier + "'><img class='check_calib' src='images/check.png'>Joystick "+nameJo+" is now calibrated</div>");

            setTimeout(function () {
                var count = $("#content_calibration .calibration_zone_container .bloc_calibrate").length;
                var count2 = $(".statut_calibration_verif .line_validate_calib").length;
                if (count == count2) {
                    $(".continue_to_finaltest").removeClass("hidden");
                }
            }, 200);
        });
    }

    //fonctions de test des boutons services ainsi que des switchs position
    function displayCalibrationTest(switchNb, hasServiceBt){
        console.log(switchNb+" "+hasServiceBt);
        if(parseInt(switchNb)> 0 || hasServiceBt == 1){
            $(".calibration_step_1").removeClass("hidden");
            $(".calibration_step_2").addClass("hidden");
            
        }else{
            $(".calibration_step_1").addClass("hidden");
            $(".calibration_step_2").removeClass("hidden");
        }
        
        if(parseInt(switchNb)> 0){            
            $(".repair_calib_section_switch").removeClass("hidden");
            $(".repair_calib_section_switch").addClass("need_test");
        }else{            
            $(".repair_calib_section_switch").addClass("hidden");
            $(".repair_calib_section_switch").removeClass("need_test");
        }
        
        if(hasServiceBt == 1){
            $(".repair_calib_section_serv").removeClass("hidden");
            $(".repair_calib_section_serv").addClass("need_test");
        }else{
            $(".repair_calib_section_serv").addClass("hidden");
            $(".repair_calib_section_serv").removeClass("need_test");
        }
    }    
    function fillSwitchTest(switchNb){
        var containerSwitch = $(".repair_calib_section_switch .switch_pos_box");
        containerSwitch.empty();
        switch(switchNb){
            case "2":
                containerSwitch.append(
                    "<div class='switch_line_test' data-position='left'>"+
                        "<div class='switch_name'>Position LEFT</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"+
                    "<div class='switch_line_test' data-position='right'>"+
                        "<div class='switch_name'>Position RIGHT</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"
                );
            break;
            case "3":
                containerSwitch.append(
                    "<div class='switch_line_test' data-position='left'>"+
                        "<div class='switch_name'>Position LEFT</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"+
                    "<div class='switch_line_test' data-position='middle'>"+
                        "<div class='switch_name'>Position MIDDLE</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"+
                    "<div class='switch_line_test' data-position='right'>"+
                        "<div class='switch_name'>Position RIGHT</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"
                );
            break;
            case "4":
                containerSwitch.append(
                    "<div class='switch_line_test' data-position='left'>"+
                        "<div class='switch_name'>Position LEFT</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"+
                    "<div class='switch_line_test' data-position='front'>"+
                        "<div class='switch_name'>Position FRONT</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"+
                    "<div class='switch_line_test' data-position='right'>"+
                        "<div class='switch_name'>Position RIGHT</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"+
                    "<div class='switch_line_test' data-position='back'>"+
                        "<div class='switch_name'>Position BACK</div>"+
                        "<button class='switch_bt_check'>Check Position</button>"+
                        "<div class='switch_test'></div>"+
                        "<div class='switch_result'></div>"+
                    "</div>"
                );
            break;                
        }
        $(".switch_bt_check").on('click', function(){
            var _this = $(this);
           _MODE = "CALIBRATION";
           var resultWaited = $(this).parent().data('position');
           var resultDone = "";
           
            var pingSignal = Cal_post+"040000"+cobID2+"40006001";
            sendSignal(pingSignal);
            waitPingResponse = cobID1;
            
            setTimeout(function () {
                 var response = finalResponseData.substring(8,10);
                 switch(response){
                     case "00":
                         if(switchNb == "3"){
                             resultDone = "";
                         }else if(switchNb == "4"){
                             resultDone = "left";
                         }    
                         break;
                     case "08":
                         if(switchNb == "3"){
                             resultDone = "right";
                         }else if(switchNb == "4"){
                             resultDone = "front";
                         }                         
                         break;
                     case "10":
                         if(switchNb == "3"){
                             resultDone = "left";
                         }else if(switchNb == "4"){
                             resultDone = "right";
                         }    
                         break;
                     case "18":
                         if(switchNb == "3"){
                             resultDone = "middle";
                         }else if(switchNb == "4"){
                             resultDone = "back";
                         }    
                         break;
                 }
                 console.log(resultDone+" waited : "+resultWaited);
                 
                 if(resultWaited == resultDone){
                     _this.parent().addClass("test_ok");
                     _this.parent().removeClass("test_fail");
                     _this.parent().find(".switch_test").html("Test Pass");
                 }else{
                     _this.parent().addClass("test_fail");
                     _this.parent().removeClass("test_ok");
                     _this.parent().find(".switch_test").html("Test Fail");
                 }
                 
            }, 200);
        });
                
    }
    function testServiceButton(_this){               
        _MODE = "CALIBRATION";
        var resultWaited = _this.parent().data('position');
        var resultDone = "";

        var pingSignal = Cal_post+"080000"+cobID2+"40006003";
        sendSignal(pingSignal);
        waitPingResponse = cobID1;

        setTimeout(function () {
             var response = finalResponseData.substring(8,10);
             switch(response){
                 case "00":
                    resultDone = "released";
                    break;
                 case "40":                         
                    resultDone = "pressed";
                    break;
             }
             console.log(resultDone+" waited : "+resultWaited);

             if(resultWaited == resultDone){
                 _this.parent().addClass("test_ok");
                 _this.parent().removeClass("test_fail");
                 _this.parent().find(".switch_test").html("Test Pass");
             }else{
                 _this.parent().addClass("test_fail");
                 _this.parent().removeClass("test_ok");
                 _this.parent().find(".switch_test").html("Test Fail");
             }

        }, 200);
    }
    function testStep1Calibration(){
        var error = 0;
        $(".sectiontest").each(function(){
            if($(this).hasClass("need_test") && $(this).hasClass("repair_calib_section_switch") ){
                $(this).find(".switch_line_test").each(function(){
                    if(!$(this).hasClass("test_ok")){
                        error++;
                    }
                });            
            }else if($(this).hasClass("need_test") && $(this).hasClass("repair_calib_section_serv")){
                $(this).find(".serv_line_test").each(function(){
                    if(!$(this).hasClass("test_ok")){
                        error++;
                    }
                });
            }
        });
        return error;
    }
    
    function getStep1CalibrationLog(){
        $("#content_calibration .calibration_step_1 .need_test").each(function(){
            $(this).find(".switch_line_test").each(function(){
                var type = "switch";
                var symbol_name = "Switch";
                var description = $(this).data('position');
                var standard_name = "I9";
                var min_axis = "";
                var max_axis = "";
                var min_zero = "";
                var max_zero = "";     
                if($(this).hasClass("test_ok")){
                    var result = "PASS";
                }else{
                    var result = "FAIL";
                }
                calibLog.push({type: type, name: symbol_name, standard_name: standard_name, description: description, result: result, minAxis : min_axis, maxAxis : max_axis, minZero : min_zero, maxZero : max_zero});
                 
            })
            
            $(this).find(".serv_line_test").each(function(){
                var type = "service";
                var symbol_name = "BAD";
                var description = $(this).data('position');
                var standard_name = "2IIa";
                var min_axis = "";
                var max_axis = "";
                var min_zero = "";
                var max_zero = "";     
                if($(this).hasClass("test_ok")){
                    var result = "PASS";
                }else{
                    var result = "FAIL";
                }
                calibLog.push({type: type, name: symbol_name, standard_name: standard_name, description: description, result: result, minAxis : min_axis, maxAxis : max_axis, minZero : min_zero, maxZero : max_zero});
                 
            })
            
        });
        calibLogJSON = JSON.stringify(calibLog);
        console.log(calibLogJSON);
    }    

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////VERIFY CALIBRATION////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    
    function startVerifyCalibration(subindexX, subindexY, identifier) {
        $(".id" + identifier).addClass("blink_me");
        $(".verify_calibration.id" + identifier).addClass("hidden");
        $(".stop_calibration_verif.id" + identifier).removeClass("hidden");
        currentIdentifier = identifier;
        //alert("start with "+currentIdentifier);
        currentSubindexX = subindexX;
        currentSubindexY = subindexY;

        _MODE = "CALIBRATION_VERIFY";
        clearInterval(intervalVerify);
        intervalVerify = setInterval(function () {
            pingGetAxisValue(subindexX, subindexY, identifier);
        }, 200);
    }
    function startVerifyCalibrationMushroom(subindex, identifier) {
        $(".id" + identifier).addClass("blink_me");
        $(".verify_calibration.id" + identifier).addClass("hidden");
        $(".stop_calibration_verif.id" + identifier).removeClass("hidden");
        currentIdentifier = identifier;
        currentSubindex = subindex;

        _MODE = "CALIBRATION_VERIFY_MUSHROOM";
        clearInterval(intervalVerify);
        intervalVerify = setInterval(function () {
            pingGetAxisValueMushroom(subindex, identifier);
        }, 200);
    }
    function stopVerifyCalibration(identifier) {
        $(".verify_calibration.id" + identifier).removeClass("hidden");
        $(".stop_calibration_verif.id" + identifier).addClass("hidden");
        clearInterval(intervalVerify);
        _MODE = "CALIBRATION";
        $(".id" + identifier).removeClass("blink_me");
    }
    
    function updateVerifyData(verifyVal, axis, currentIdentifier) {
        var xValMin = joystickVerifyContainer.find(".id" + currentIdentifier + " .minx_value_joy").html();
        var xValMax = joystickVerifyContainer.find(".id" + currentIdentifier + " .maxx_value_joy").html();
        var yValMin = joystickVerifyContainer.find(".id" + currentIdentifier + " .miny_value_joy").html();
        var yValMax = joystickVerifyContainer.find(".id" + currentIdentifier + " .maxy_value_joy").html();

        if (axis == "x") {
//            var part1 = convertHexa(verifyVal.substring(0,2));
//            var part2 = convertHexa(verifyVal.substring(2,4));
//            var valueFinal = part2+part1;
            var valueFinal = convertHexa(verifyVal);

            joystickVerifyContainer.find(".id" + currentIdentifier + " .x_value_joy").html(valueFinal);
            if (parseInt(xValMin) > parseInt(valueFinal)) {
                joystickVerifyContainer.find(".id" + currentIdentifier + " .minx_value_joy").html(valueFinal);
            }
            if (parseInt(xValMax) < parseInt(valueFinal)) {
                joystickVerifyContainer.find(".id" + currentIdentifier + " .maxx_value_joy").html(valueFinal);
            }




        }
        if (axis == "y") {
//            var part1 = convertHexa(verifyVal.substring(0,2));
//            var part2 = convertHexa(verifyVal.substring(2,4));
//            var valueFinal = part2+part1;
            var valueFinal = convertHexa(verifyVal);

            joystickVerifyContainer.find(".id" + currentIdentifier + " .y_value_joy").html(valueFinal);
            if (parseInt(yValMin) > parseInt(valueFinal)) {
                joystickVerifyContainer.find(".id" + currentIdentifier + " .miny_value_joy").html(valueFinal);
            }
            if (parseInt(yValMax) < parseInt(valueFinal)) {
                joystickVerifyContainer.find(".id" + currentIdentifier + " .maxy_value_joy").html(valueFinal);
            }
        }
    }
    function resetCalibrationVerif(joystick) {
        console.log("index verif global" + indexVerifGlobal);
        switch (joystick) {
            case "joystick1":
                joystick1Val.find(".x_value_joy").html(0);
                joystick1Val.find(".y_value_joy").html(0);
                joystick1Val.find(".maxx_value_joy").html(0);
                joystick1Val.find(".minx_value_joy").html(0);
                joystick1Val.find(".maxy_value_joy").html(0);
                joystick1Val.find(".miny_value_joy").html(0);
                break;
        }
    }
    function pingGetAxisValue(subindexX, subindexY, identifier) {
        if (subindexX !== "null") {
            var axisRawVerifSignalX = Cal_post + Cal_dlc + cobID2 + "400165" + subindexX + "00000000";
            sendSignal(axisRawVerifSignalX);
        }
        if (subindexY !== "null") {
            var axisRawVerifSignalY = Cal_post + Cal_dlc + cobID2 + "400165" + subindexY + "00000000";
            sendSignal(axisRawVerifSignalY);
        }
    }
    function pingGetAxisValueMushroom(subindex, identifier) {        
            var axisRawVerifSignalX = Cal_post + Cal_dlc + cobID2 + "40" + subindex + "01";
            sendSignal(axisRawVerifSignalX);               
            var axisRawVerifSignalY = Cal_post + Cal_dlc + cobID2 + "40" + subindex + "02";
            sendSignal(axisRawVerifSignalY);       
    }
    
    $(".reset_calibration_verif").on('click', function () {
        _MODE = "CALIBRATION";
        if ($(this).hasClass("joystick1")) {
            resetCalibrationVerif("joystick1");
        }
        if ($(this).hasClass("joystick2")) {
            resetCalibrationVerif("joystick2");
        }
        if ($(this).hasClass("joystick3")) {
            resetCalibrationVerif("joystick3");
        }
    });
    $(".popup_test_fw_final .bt_no").on('click', function () {
        sendSignal(Cal_post + Cal_dlc + cobID2 + "2f00550100000000");
    });
    $(".download_test_fw_content_final .bt_continue_finaltest").on('click', function () {
        sendSignal(Cal_post + Cal_dlc + cobID2 + "2f00550100000000");
    });
    $(".continue_to_finaltest").on('click', function () {
        sendSignal(Cal_post + Cal_dlc + cobID2 + "2f00550101000000");
        FWcalibV = $(".sw_config").html();
        $(".verify_calibration").removeClass("hidden");
        $(".stop_calibration_verif").addClass("hidden");
        clearInterval(intervalVerify);
        getCalibrationLog();
    });
    
    function getCalibrationLog(){
        $("#content_calibration .calibration_test_container .realtime_joysticks_val").each(function(){
            var symbol_name = $(this).data('symb');
            var standard_name = $(this).data('standard');
            var min_axis = $(this).data('minaxis');
            var max_axis = $(this).data('maxaxis');
            var min_zero = $(this).data('minzero');
            var max_zero = $(this).data('maxzero');
            
            $(this).find(".get_val").each(function(){
                var description = $(this).data('descri').toUpperCase();
                var result = $(this).html();            
                calibLog.push({type: "joystick", name: symbol_name, standard_name: standard_name, description: description, result: result, minAxis : min_axis, maxAxis : max_axis, minZero : min_zero, maxZero : max_zero});
            });                        
            
        });
        calibLogJSON = JSON.stringify(calibLog);
    }    

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// PING GET INFO VERSION ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $(".bt_get_config").on('click', function () {
        getInfoCard(globalName, cobID2);
    });

    function pingGetInfo(model, id) {
        switch (model) {
            case "ELEGANCE":
                pingTSSC(Cal_post + Cal_dlc + id + "4018100300000000", id);
                setTimeout(function () {
                    if(finalResponseData.substring(6, 8)== "03") {
                        bootRelease = finalResponseData.substring(8, 16);
                    }else{
                        bootRelease = "-";
                    }
                    pingTSSC(Cal_post + Cal_dlc + id + "4018100400000000", id);
                    setTimeout(function () {
                        if(finalResponseData.substring(6, 8)== "04") {
                            FPGARelease = finalResponseData.substring(8, 16);
                        }else{
                            FPGARelease = "-";
                        }
                        pingTSSC(Cal_post + Cal_dlc + id + "4018100700000000", id);
                        setTimeout(function () {
                            if(finalResponseData.substring(6, 8)== "07") {
                                softwareRelease = finalResponseData.substring(8, 16);
                            }else{
                                softwareRelease = "-";
                            }
                            pingTSSC(Cal_post + Cal_dlc + id + "4018100500000000", id);
                            setTimeout(function () {
                                if(finalResponseData.substring(6, 8)== "05"){
                                    var unicIDmsb = finalResponseData.substring(8, 16);
                                }else{
                                    var unicIDmsb = "-";
                                }                                
                                pingTSSC(Cal_post + Cal_dlc + id + "4018100600000000", id);
                                setTimeout(function () {
                                    if(finalResponseData.substring(6, 8)== "06"){
                                        var unicIDlsb = finalResponseData.substring(8, 16);
                                    }else {
                                        var unicIDlsb = "-";
                                    }
                                    if(unicIDmsb == "-" || unicIDlsb == "-"){
                                        unicID = "-";
                                    }else{
                                        unicID = unicIDmsb + unicIDlsb;
                                    }                                    
                                }, 200);
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);
                break;
            case "OMEGA":
                if(modelName == "TSSC"){
                    pingTSSComega(Cal_post + "030006" + "1FC22F00" + "020700", "1fc00f41");
                    setTimeout(function () {
                        var softwareRelease1 = finalResponseData.substring(6, 14);
                        console.log(softwareRelease1);
                        pingTSSComega(Cal_post + "030006" + "1FC22F00" + "020704", "1fc00f41");
                        setTimeout(function () {
                            var softwareRelease2 = finalResponseData.substring(6, 14);
                            console.log(softwareRelease2);
                            pingTSSComega(Cal_post + "030006" + "1FC22F00" + "020708", "1fc00f41");
                            setTimeout(function () {
                                var softwareRelease3 = finalResponseData.substring(6, 14);
                                console.log(softwareRelease3);
                                pingTSSComega(Cal_post + "030006" + "1FC22F00" + "02070C", "1fc00f41");
                                setTimeout(function () {
                                    var softwareRelease4 = finalResponseData.substring(6, 14);
                                    console.log(softwareRelease4);
                                    softwareRelease = softwareRelease1 + softwareRelease2 + softwareRelease3 + softwareRelease4;
                                    console.log(softwareRelease);
                                }, 200);
                            }, 200);
                        }, 200);
                    }, 200);
                }else if(modelName == "SMARTBOX"){
                    pingTSSComega(Cal_post + "030006" + "1FC42F00" + "020600", "1fc00f51");
                    setTimeout(function () {
                        var softwareRelease1 = finalResponseData.substring(6, 14);
                        console.log(softwareRelease1);
                        pingTSSComega(Cal_post + "030006" + "1FC42F00" + "020604", "1fc00f51");
                        setTimeout(function () {
                            var softwareRelease2 = finalResponseData.substring(6, 14);
                            console.log(softwareRelease2);
                            pingTSSComega(Cal_post + "030006" + "1FC42F00" + "020608", "1fc00f51");
                            setTimeout(function () {
                                var softwareRelease3 = finalResponseData.substring(6, 14);
                                console.log(softwareRelease3);
                                pingTSSComega(Cal_post + "030006" + "1FC42F00" + "02060C", "1fc00f51");
                                setTimeout(function () {
                                    var softwareRelease4 = finalResponseData.substring(6, 14);
                                    console.log(softwareRelease4);
                                    softwareRelease = softwareRelease1 + softwareRelease2 + softwareRelease3 + softwareRelease4;
                                    console.log(softwareRelease);
                                }, 200);
                            }, 200);
                        }, 200);
                    }, 200);                
                }else if(modelName == "SMARTHANDLE"){
                    pingTSSComega(Cal_post + "030006" + "1FC42F00" + "020600", "1fc00f51");
                    setTimeout(function () {
                        var softwareRelease1 = finalResponseData.substring(6, 14);
                        console.log(softwareRelease1);
                        pingTSSComega(Cal_post + "030006" + "1FC42F00" + "020604", "1fc00f51");
                        setTimeout(function () {
                            var softwareRelease2 = finalResponseData.substring(6, 14);
                            console.log(softwareRelease2);
                            pingTSSComega(Cal_post + "030006" + "1FC42F00" + "020608", "1fc00f51");
                            setTimeout(function () {
                                var softwareRelease3 = finalResponseData.substring(6, 14);
                                console.log(softwareRelease3);
                                pingTSSComega(Cal_post + "030006" + "1FC42F00" + "02060C", "1fc00f51");
                                setTimeout(function () {
                                    var softwareRelease4 = finalResponseData.substring(6, 14);
                                    console.log(softwareRelease4);
                                    softwareRelease = softwareRelease1 + softwareRelease2 + softwareRelease3 + softwareRelease4;
                                    console.log(softwareRelease);
                                }, 200);
                            }, 200);
                        }, 200);
                    }, 200);
                }
                
                break;
        }
    }
    function pingTSSC(signal, id) {
        sendSignal(signal);
        waitPingResponse = cobID1;
    }
    function pingTSSComega(signal, id) {
        sendSignal(signal);
        waitPingResponse = id;
    }
    


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// DOWNLOAD FIRMWARE ////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //lecture et stockae en mémoire du fichier choisi par l'utilisateur
    function readSingleFile(evt) {
        //Retrieve the first (and only!) File from the FileList object
        var f = evt.target.files[0];

        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var contents = e.target.result;
                arrayOfLines = contents.split("\n");
                showReadResult(f.name, f.type, f.size);
            }
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    }

    //affichage des information du fichier choisi  
    function showReadResult(name, type, size) {
        $(".testing_upl .content_upl").html("<span>File is read ! </span> | "
                + "<b>Name</b> : " + name + "<br>"
                + "<b>Nb of lines </b>: " + arrayOfLines.length
                + " | <b>Size </b>: " + size + " bytes<br/>"
                );
        if (arrayOfLines.length > 0) {
            $(".testing_upl .start_download").removeClass("hidden");
            $(".testing_upl .stop_download").removeClass("hidden");
        }
    }

    document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
    document.getElementById('fileinput2').addEventListener('change', readSingleFile, false);
    document.getElementById('fileinput3').addEventListener('change', readSingleFile, false);
    document.getElementById('fileinput4').addEventListener('change', readSingleFile, false);
    document.getElementById('fileinput5').addEventListener('change', readSingleFile, false);

    $(".testing_upl .start_download").on('click', function () {

        if (globalName == "ELEGANCE") {
            startDownload(cobID2);
        } else {
            startDownloadOmega();
        }
        //sendSignal(Cal_post+Cal_dlc+Cal_canid+"2f511f0100000000");
    });
    $(".testing_upl .stop_download").on('click', function () {
        stopDownload(cobID2);
    });

    //début du download
    function startDownload(canId) {
        _MODE = "CALIBRATION";
        isDownloading = 1;
        downloadingBarProgress(arrayOfLines.length);
        $(".downloading_bar_container").removeClass("hidden");
        //stop application mode
        console.log("stop application mode");
        sendSignal(Cal_post + Cal_dlc + canId + "2f511f0100000000");

        setTimeout(function () {
            console.log("start download mode");
            if (arrayOfLines[0].substring(0, 1) == "+") {
                var lengthFirstLine = arrayOfLines[0].length - 1;
                console.log(lengthFirstLine);
                var newval = lengthFirstLine.toString(16);
                console.log(newval);
                var customCAN = Cal_post + Cal_dlc + canId + "21501f01" + newval + "000000";
                sendSignal(customCAN);
                setTimeout(function () {
                    var asciiToHex = "";
                    for (var index = 0; index < lengthFirstLine; index++) {
                        asciiToHex += arrayOfLines[0].charCodeAt(index).toString(16);
                    }
                    sendMultipleSignalStart(asciiToHex, canId, 0);
                    console.log("------------------------------------------");
                }, 200);
            } else {
                alert("invalide file format");
                stopDownload(canId);
            }
        }, 200);
    }
    //début du download OMEGA
    function startDownloadOmega() {
        _MODE = "CALIBRATION";
        isDownloading = 1;
        downloadingBarProgress(arrayOfLines.length);
        $(".downloading_bar_container").removeClass("hidden");
        //stop application mode
        console.log("send start download omega");
        
        //reset TSUI omega
        if(modelName == "TSSC"){
            sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc22f000e00000000000000");
            setTimeout(function(){
                sendSignalDownloadOmega("00240080601cc1906188f91d5a73fd35000562946f080000000006012F511F0100000000");
            },10000);
        }else{
            sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc42f000e00000000000000");
            sendSignalDownloadOmega("00240080601cc1906188f91d5a73fd35000562946f080000000006012F511F0100000000");
            var startInterval = setInterval(function(){
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc42f000e00000000000000");
                sendSignalDownloadOmega("00240080601cc1906188f91d5a73fd35000562946f080000000006012F511F0100000000");
            },1000);
        }
        setTimeout(function(){
            clearInterval(startInterval);
        },5000);
        setTimeout(function () {
            coreDownloadOmega(0);
        }, 12000);
    }

    //fonction récursive d'envoi de l'intégralité des lignes du fichier
    function coreDownload(canId, startIndex) {
        if ((startIndex < arrayOfLines.length - 1) && isDownloading == 1) {
            lineDownloading = startIndex;
            if (arrayOfLines[startIndex].substring(0, 1) == "+") {
                var lengthFirstLine = arrayOfLines[0].length - 1;
                console.log(lengthFirstLine);
                var newval = lengthFirstLine.toString(16);
                console.log(newval);
                var customCAN = Cal_post + Cal_dlc + canId + "21501f01" + newval + "000000";
                sendSignal(customCAN);
                setTimeout(function () {
                    var asciiToHex = "";
                    for (var index = 0; index < lengthFirstLine; index++) {
                        asciiToHex += arrayOfLines[startIndex].charCodeAt(index).toString(16);
                    }
                    sendMultipleSignalStart(asciiToHex, canId, startIndex);
                    console.log("------------------------------------------");
                }, 200);
            } else {
                console.log("LINE " + startIndex);
                var totalLine = arrayOfLines.length;
                var tempo = 2;
                if(totalLine < 6000){tempo = 100}
                var lengthFirstLine = arrayOfLines[startIndex].length - 1;
                var newval = lengthFirstLine.toString(16);
                var customCAN = Cal_post + Cal_dlc + canId + "21501f01" + newval + "000000";
                if (lengthFirstLine <= 15) {
                    newval = "0" + newval;                    
                }else if(lengthFirstLine > 255){
                    newval = "0" + newval; 
                    customCAN = Cal_post + Cal_dlc + canId + "21501f01" + newval + "0000";
                }
                
                sendSignal(customCAN);
                console.log("tempo line" +tempo);
                setTimeout(function () {
                    var asciiToHex = "";
                    for (var index = 0; index < lengthFirstLine; index++) {
                        asciiToHex += arrayOfLines[startIndex].charCodeAt(index).toString(16);
                    }
                    sendMultipleSignal(asciiToHex, canId, startIndex);
                    
                }, tempo);
            }
        } else {
            setTimeout(function () {
                stopDownload(canId);
                 setTimeout(function(){
                    getInfoCard(globalName, cobID2);
                },1000)
            }, 500);

        }
    }
    function coreDownloadOmega(startIndex) {
        console.log("------------ core download index " + startIndex + " count: " + msgCount + " ----------------");
        if ((startIndex < arrayOfLines.length) && isDownloading == 1) {
            lineDownloading = startIndex;
            if (arrayOfLines[startIndex].substring(7, 9) == "00") {
                var lineDataLengthHex = arrayOfLines[startIndex].substring(1, 3);
                var lineDataLength = convertHexaPic(lineDataLengthHex);
                var coreDataHex = arrayOfLines[startIndex].substring(9, ((lineDataLength * 2) + 9));
                var addressLineHex = arrayOfLines[startIndex].substring(3, 7);
                var indice = "02";

                sendMultipleSignalOmega(startIndex, addressLineHex, coreDataHex, lineDataLength, indice);

            } else if (arrayOfLines[startIndex].substring(7, 9) == "02") {
                var _indice = "06";
                var _postSignalOmega = "00240080601cc1906188f91d5a73fd35000562946f0800000000060122501f01" + _indice;
                var _lineDataLengthHex = arrayOfLines[startIndex].substring(1, 3);
                var _lineDataLength = convertHexaPic(_lineDataLengthHex);
                var _coreDataHex = arrayOfLines[startIndex].substring(9, ((_lineDataLength * 2) + 9));
                var _coreDataHex1 = _coreDataHex.substring(0, 2);
                var _coreDataHex2 = _coreDataHex.substring(2, 4);
                var _newAddress = _coreDataHex2 + _coreDataHex1;
                var _signalSpe = _postSignalOmega + _newAddress;

                sendSignalDownloadOmega(_signalSpe);
                coreDownloadOmega(startIndex + 1);
            } else if (arrayOfLines[startIndex].substring(7, 9) == "01") {
                stopDownloadOmega();
            }
        } else {
            setTimeout(function () {
                console.log("stopDownload End of file");
                 setTimeout(function(){
                    getInfoCard(globalName, cobID2);
                },1000)
            }, 500);
        }
    }

    //fin du download
    function stopDownload(canId) {

        console.log("stop download mode");

        waitDownloadResponse = "";
        isDownloading = 0;
        $(".downloading_bar_container").addClass("hidden");
        sendSignal(Cal_post + Cal_dlc + canId + "2f511f0101000000");
         setTimeout(function(){
            getInfoCard(globalName, cobID2);
        },5000)
        //sendSignal("002400806d68d7551407f09b861e3aad000549a8440800000000072d2f511f0101000000");
    }
    //fin du download Omega
    function stopDownloadOmega() {

        console.log("stop download omega mode");
        isDownloading = 0;
        $(".downloading_bar_container").addClass("hidden");

        var postSignalOmega = "00240080601cc1906188f91d5a73fd35000562946f08000000000";

        var loader_read_version = "60122501f0108000000";
        console.log("send loader read version");
        sendSignalDownloadOmega(postSignalOmega + loader_read_version);

        var loader_read_checksum = "60122501f0107000000";
        console.log("send loader_read_checksum");
        sendSignalDownloadOmega(postSignalOmega + loader_read_checksum);

        var appli_read_version = "60122501f0105000000";
        console.log("send appli_read_version");
        sendSignalDownloadOmega(postSignalOmega + appli_read_version);

        var appli_read_checksum = "60122501f0104000000";
        console.log("send appli_read_checksum");
        sendSignalDownloadOmega(postSignalOmega + appli_read_checksum);

        var app_run = "6012f511f0101fb1200";
        console.log("send app_run");
        sendSignalDownloadOmega(postSignalOmega + app_run);

        setTimeout(function(){
            getInfoCard(globalName, cobID2);
        },5000)

    }

    //gestion de la barre de progression
    function downloadingBarProgress(totalLine) {
        var interval = setInterval(function () {
            if (isDownloading > 0) {
                var percentLine = Math.round((lineDownloading / totalLine) * 100);
                downloadingBar.css("width", percentLine + "%");
                downloadingBarContent.html(percentLine + " %");
            } else {
                clearInterval(interval);
            }
        }, 2000);
    }

    //décompose, formate puis envoi la 1ere ligne du fichier .cro
    function sendMultipleSignalStart(signal, canId, startIndex) {
        var nbMessage = parseInt((signal.length / 2) / 7);
        if (nbMessage == 0) {
            nbMessage = 1;
        }
        if (((signal.length / 2) % 7 > 0)) {
            nbMessage += 1;
        }
        var dataZero;
        sendSingle(0);
        function sendSingle(index) {
            var t;
            var c = 0;
            var n = 0;
            if (index % 2 == 0) {
                t = 0;
            } else {
                t = 16;
            }
            if (index == (nbMessage - 1)) {
                c = 1;
                n = 0 + (7 - (signal.length / 2) % 7) * 2;
                if (n == 14) {
                    n = 0
                }
            }
            dataZero = 0 + parseInt(t) + parseInt(n) + parseInt(c);
            var hexDataZero = dataZero.toString(16);
            if (hexDataZero.length < 2) {
                hexDataZero = "0" + hexDataZero;
            }
            var startInd = (14 * index);
            var endInd = (14 * index) + 14;
            var data = signal.substring(startInd, endInd);
            data = addZeroAfter(data, 14);
            //console.log('t+n+c :'+t+" "+n+" "+c)
            sendSignal(Cal_post + Cal_dlc + canId + hexDataZero + data);

            waitDownloadResponse = cobID1;
            var checkResponse = setInterval(function () {
//                console.log("check response");
//                console.log("continueDownload : "+ continueDownload + "wait dl :"+waitDownloadResponse)
                if (waitDownloadResponse !== "") {
                    if (continueDownload > 0) {
                        continueDownload = 0;
//                        console.log("on rentre dans continue download");
                        if (index == (nbMessage - 1) && index != 0) {
                            coreDownload(canId, startIndex + 1)
                        } else {
                            setTimeout(function () {
                                sendSingle(index + 1);
                            }, 50);
                        }
                        clearInterval(checkResponse);
//                        console.log("launch core download");
                        waitDownloadResponse = "";
                    }
                } else {
                    clearInterval(checkResponse);
//                    console.log("stop check interval");
                }
            }, 50);

        }

    }

    //décompose, formate puis envoi une ligne du fichier .cro
    function sendMultipleSignal(signal, canId, startIndex) {
        var nbMessage = parseInt((signal.length / 2) / 7);
        var tempo = 1;
        if (nbMessage == 0) {
            nbMessage = 1;
        }
        if (((signal.length / 2) % 7 > 0)) {
            nbMessage += 1;
        }
        if(nbMessage > 15 ){
            tempo = 12;
        }
        var dataZero;
        sendSingle(0);
        console.log(nbMessage, "tempo segment " +tempo);
        function sendSingle(index) {
            var t;
            var c = 0;
            var n = 0;
            if (index % 2 == 0) {
                t = 0;
            } else {
                t = 16;
            }
            if (index == (nbMessage - 1)) {
                c = 1;
                n = 0 + (7 - (signal.length / 2) % 7) * 2;
                if (n == 14) {
                    n = 0
                }
            }
            dataZero = 0 + parseInt(t) + parseInt(n) + parseInt(c);
            var hexDataZero = dataZero.toString(16);
            if (hexDataZero.length < 2) {
                hexDataZero = "0" + hexDataZero;
            }
            var startInd = (14 * index);
            var endInd = (14 * index) + 14;
            var data = signal.substring(startInd, endInd);
            data = addZeroAfter(data, 14);
            //console.log('t+n+c :'+t+" "+n+" "+c)
            sendSignal(Cal_post + Cal_dlc + canId + hexDataZero + data);
            if (index == (nbMessage - 1) && index != 0) {
                coreDownload(canId, startIndex + 1)
            } else {
                setTimeout(function () {
                    sendSingle(index + 1);
                }, tempo);
            }

        }

    }
    function sendMultipleSignalOmega(startIndex, addressLineHex, coreDataHex, lineDataLength, indice) {
        var postSignalOmega = "00240080601cc1906188f91d5a73fd35000562946f0800000000060122501f01" + indice;
        sendSingle(0, addressLineHex);
        function sendSingle(index, lastAdress) {
            var mult = index * 2;
            if (index == 0) {
                var newlastAdress = lastAdress;
            } else {
                var newlastAdress = addHexValOmegaDownload(lastAdress, 1);
            }

            var addressLineHigh = newlastAdress.substring(0, 2);
            var addressLineLow = newlastAdress.substring(2, 4);
            var data = coreDataHex.substring(0 + mult, 2 + mult);

            var dynamicAddress = addressLineLow + addressLineHigh;
            sendSignalDownloadOmega(postSignalOmega + dynamicAddress + data);
            msgCount++;
            if (index == (lineDataLength - 1) && index != 0) {
                coreDownloadOmega(startIndex + 1)
            } else {
                if (index == 0) {
                    waitDownloadResponseOmega = "00000581";
                    var checkResponse = setInterval(function () {
                        if (waitDownloadResponseOmega !== "") {
                            if (continueDownload > 0) {
                                continueDownload = 0;
                                sendSingle(index + 1, newlastAdress);
                                clearInterval(checkResponse);
                                waitDownloadResponse = "";
                            }
                        } else {
                            clearInterval(checkResponse);
                        }
                    }, 5);
                } else {
                    setTimeout(function () {
                        sendSingle(index + 1, newlastAdress);
                    }, 15);
                }
            }
        }
    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// HISTORY REPAIR SEARCH ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $(".history_bt_search").on('click', function () {
        searchLog();
    });
    $(".history_bt_search_page").on('click', function () {
        searchLogPage();
    });
    $(".header_history_table span").on('click', function () {
        if ($(this).hasClass("selected")) {
            $(".header_history_table span").removeClass('selected');
            $(this).addClass("selected")
        } else {
            $(".header_history_table span").removeClass('selected');
            $(this).addClass("selected")
        }
    });

    $(".id_history").on('click', function () {
        if ($(this).hasClass("asc")) {
            sortCategory('id', true, 'int')
            $(this).removeClass('asc');
        } else {
            sortCategory('id', false, 'int')
            $(this).addClass('asc');
        }
    });
    $(".pn_history").on('click', function () {
        if ($(this).hasClass("asc")) {
            sortCategory('part_number', true, 'string')
            $(this).removeClass('asc');
        } else {
            sortCategory('part_number', false, 'string')
            $(this).addClass('asc');
        }
    });
    $(".sn_history").on('click', function () {
        if ($(this).hasClass("asc")) {
            sortCategory('serial_number', true, 'string')
            $(this).removeClass('asc');
        } else {
            sortCategory('serial_number', false, 'string')
            $(this).addClass('asc');
        }
    });
    $(".date_history").on('click', function () {
        if ($(this).hasClass("asc")) {
            sortCategory('date', true, 'string')
            $(this).removeClass('asc');
        } else {
            sortCategory('date', false, 'string')
            $(this).addClass('asc');
        }
    });
    $(".sso_history").on('click', function () {
        if ($(this).hasClass("asc")) {
            sortCategory('user_sso', true, 'int')
            $(this).removeClass('asc');
        } else {
            sortCategory('user_sso', false, 'int')
            $(this).addClass('asc');
        }
    });

    function searchLog() {
        var historyPNVal = $(".history_pn_input").val().trim();
        var historySNVal = $(".history_sn_input").val().trim();
        var historySSOVal = $(".history_sso_input").val().trim();

//         if(historyPNVal == "" && historySNVal == "" && historySSOVal == ""){
//            alert("Fields are empties or not correct.");
//         }else{             
        $.ajax({
            //get global log with param1 = PN, param2 = SN, param3 = userSSO, param4= date
            url: 'php/api.php?function=get_global_log&param1=' + historyPNVal + '&param2=' + historySNVal + '&param3=' + historySSOVal + '&param4',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("No result found with this part number.")
                } else {

                    $(".history_pn_input_page").val(historyPNVal);
                    $(".history_sn_input_page").val(historySNVal);
                    $(".history_sso_input_page").val(historySSOVal);

                    activeSearchHistoryResult = data;
                    console.log(activeSearchHistoryResult);
                    $(".page_content.active").removeClass("active");
                    setTimeout(function () {
                        $(document).find("#content_history").addClass("active");
                    }, 100);
                    generateHistoryResult();


                }
            }
        });
//         }
    }
    function searchLogPage() {
        var historyPNVal = $(".history_pn_input_page").val().trim();
        var historySNVal = $(".history_sn_input_page").val().trim();
        var historySSOVal = $(".history_sso_input_page").val().trim();

//         if(historyPNVal == "" && historySNVal == "" && historySSOVal == ""){
//            alert("Fields are empties or not correct.");
//         }else{             
        $.ajax({
            //get global log with param1 = PN, param2 = SN, param3 = userSSO, param4= date
            url: 'php/api.php?function=get_global_log&param1=' + historyPNVal + '&param2=' + historySNVal + '&param3=' + historySSOVal + '&param4',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("No result found with this part number.")
                } else {
                    activeSearchHistoryResult = data;
                    generateHistoryResult();
                }
            }
        });
//         }
    }
    function searchLogField(pn, sn, sso) {
        var historyPNVal = pn.trim();
        var historySNVal = sn.trim();
        var historySSOVal = sso.trim();

        if (pn != "") {
            $(".history_pn_input_page").val(historyPNVal);
        }
        if (sn != "") {
            $(".history_sn_input_page").val(historySNVal);
        }
        if (sso != "") {
            $(".history_sso_input_page").val(historySSOVal);
        }

        if (historyPNVal == "" && historySNVal == "" && historySSOVal == "") {
            alert("Fields are empties or not correct.");
        } else {
            $.ajax({
                //get global log with param1 = PN, param2 = SN, param3 = userSSO, param4= date
                url: 'php/api.php?function=get_global_log&param1=' + historyPNVal + '&param2=' + historySNVal + '&param3=' + historySSOVal + '&param4',
                type: 'GET',
                dataType: 'JSON',
                success: function (data, statut) {
                    if (data.length == 0) {
                        alert("No result found.")
                    } else {
                        $(".page_content.active").removeClass("active");
                        setTimeout(function () {
                            $(document).find("#content_history").addClass("active");
                        }, 100);
                        activeSearchHistoryResult = data;
                        generateHistoryResult();
                    }
                }
            });
        }
    }
    function generateHistoryResult() {
        if (activeSearchHistoryResult.length !== 0) {
            $(".history_table .content_history_table").empty();
            for (var index = 0; index < activeSearchHistoryResult.length; index++) {
                console.log(modeManufacturing+" "+activeSearchHistoryResult[index].role )
                if(modeManufacturing == 1){
                    if(activeSearchHistoryResult[index].role == "manufacturing"){
                        var lineHistory = "<div class='line_history_table' data-index='" + index + "' data-type='" + activeSearchHistoryResult[index].type + "' data-id='" + activeSearchHistoryResult[index].id + "'>"
                        + "<span class='id_history'>" + activeSearchHistoryResult[index].id + "</span>"
                        + "<span class='pn_history'>" + activeSearchHistoryResult[index].part_number + "</span>"
                        + "<span class='sn_history'>" + activeSearchHistoryResult[index].serial_number + "</span>"
                        + "<span class='sso_history'>" + activeSearchHistoryResult[index].user_sso + "</span>"
                        + "<span class='type_history'>" + activeSearchHistoryResult[index].type + "</span>"
                        + "<span class='data_history'><img src='images/open_file.png'></span>"
                        + "<span class='date_history'>" + activeSearchHistoryResult[index].date + "</span>"
                        + "<span class='json_history hidden'>" + activeSearchHistoryResult[index].json_log + "</span>"
                        + "<span class='jsoncalib_history hidden'>" + activeSearchHistoryResult[index].json_calib_log + "</span>"
                        + "</div>";
                        $(".history_table .content_history_table").append(lineHistory);
                    }                    
                }else{                    
                    if(activeSearchHistoryResult[index].role != "manufacturing"){
                        var lineHistory = "<div class='line_history_table' data-index='" + index + "' data-type='" + activeSearchHistoryResult[index].type + "' data-id='" + activeSearchHistoryResult[index].id + "'>"
                            + "<span class='id_history'>" + activeSearchHistoryResult[index].id + "</span>"
                            + "<span class='pn_history'>" + activeSearchHistoryResult[index].part_number + "</span>"
                            + "<span class='sn_history'>" + activeSearchHistoryResult[index].serial_number + "</span>"
                            + "<span class='sso_history'>" + activeSearchHistoryResult[index].user_sso + "</span>"
                            + "<span class='type_history'>" + activeSearchHistoryResult[index].type + "</span>"
                            + "<span class='data_history'><img src='images/open_file.png'></span>"
                            + "<span class='date_history'>" + activeSearchHistoryResult[index].date + "</span>"
                            + "<span class='json_history hidden'>" + activeSearchHistoryResult[index].json_log + "</span>"
                            + "<span class='jsoncalib_history hidden'>" + activeSearchHistoryResult[index].json_calib_log + "</span>"
                            + "</div>";
                            $(".history_table .content_history_table").append(lineHistory);
                    }
                }
                
                
            }
            generateNewHistoryJson();
            $(".line_history_table .data_history").on('click', function () {
                if ($(this).parent(".line_history_table").data("type") == "pretest") {
                    var id = $(this).parent(".line_history_table").data("id");
                    printHistoryLog(id);
                } else if ($(this).parent(".line_history_table").data("type") == "finaltest") {
                    var id = $(this).parent(".line_history_table").data("id");
                    printHistoryLogFinal(id);
                } else {
                    alert("no type found");
                }
            });
        } else {
            alert("Error while generating history result.");
        }
    }
    
    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printHistoryLog(id) {
       $.ajax({
            //get global log with param1 = PN, param2 = SN, param3 = userSSO, param4= date
            url: 'php/api.php?function=get_global_log_by_id&param1=' + id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                console.log(data);
                var date = data[0].date;
                var fw_fct_version = data[0].fw_fct_version;
                var json_log = data[0].json_log;
                var part_number = data[0].part_number;
                var serial_number = data[0].serial_number;
                var sw_version = data[0].sw_version;
                var user_sso = data[0].user_sso;   
                var nodeID_history = data[0].node_id;
                printJsonLog(json_log, serial_number, part_number, user_sso, nodeID_history, date, fw_fct_version, sw_version);
            }
        });
    }

    //Generation du rapport de test FINAL et affichage de la fenetre d'impression 
    function printHistoryLogFinal(id) {
        $.ajax({
            //get global log with param1 = PN, param2 = SN, param3 = userSSO, param4= date
            url: 'php/api.php?function=get_global_log_by_id&param1=' + id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                console.log(data);
                var alim_testbench = data[0].alim_testbench;
                var alim_tsui = data[0].alim_tsui;
                var date = data[0].date;
                var enable_freq = data[0].enable_freq;
                var enable_tens = data[0].enable_tens;
                var fw_calib_version = data[0].fw_calib_version;
                var fw_fct_version = data[0].fw_fct_version;
                var id = data[0].id;
                var json_calib_log = data[0].json_calib_log;
                var json_log = data[0].json_log;
                var part_number = data[0].part_number;
                var role = data[0].role;
                var safety_freq = data[0].safety_freq;
                var safety_tens = data[0].safety_tens;
                var serial_number = data[0].serial_number;
                var sw_version = data[0].sw_version;
                var type = data[0].type;
                var user_sso = data[0].user_sso;
                var SRTLfinalTest = data[0].is_SRTL;
                var shouldHaveSRTL = data[0].should_have_SRTL;
                var initial_safety_srtl = data[0].initial_safety_SRTL;
                var initial_enable_srtl = data[0].initial_enable_SRTL;
                var nodeID_history = data[0].node_id;
                
                printJsonLogFinal(json_log, serial_number, part_number, user_sso, nodeID_history, fw_fct_version, fw_calib_version, sw_version, alim_testbench, alim_tsui, enable_freq, enable_tens, safety_freq, safety_tens, json_calib_log, date, SRTLfinalTest, shouldHaveSRTL, initial_safety_srtl, initial_enable_srtl);
            }
        });
    }

    function sortBy(field, reverse, primer) {
        var key = primer ?
                function (x) {
                    return primer(x[field])
                } :
                function (x) {
                    return x[field]
                };
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
    function sortCategory(category, boolean, type) {
        if (type == "int") {
            activeSearchHistoryResult.sort(sortBy(category, boolean, parseInt));
        } else if (type == "string") {
            activeSearchHistoryResult.sort(sortBy(category, boolean, function (a) {
                return a.toUpperCase()
            }));
        }
        generateHistoryResult();
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// GENERATE EXCEL FILE FROM JSON OBJECT    //////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function generateNewHistoryJson() {
        var jsonExcel = [];
        $(".content_history_table .line_history_table").each(function () {
            var lineID = $(this).find(".id_history").html();
            var linePN = $(this).find(".pn_history").html();
            var lineSN = $(this).find(".sn_history").html();
            var lineSSO = $(this).find(".sso_history").html();
            var lineType = $(this).find(".type_history").html();
            var lineDate = $(this).find(".date_history").html();
            var lineJson = $(this).find(".json_history").html();
            var lineJsonCalib = $(this).find(".jsoncalib_history").html();
            jsonExcel.push({id: lineID, part_number: linePN, serial_number: lineSN, user_sso: lineSSO, type: lineType, date: lineDate, json:lineJson, jsonCalib:lineJsonCalib});
        });
        jsonExcel = JSON.stringify(jsonExcel);
        console.log(jsonExcel);

        generateExcelFile(jsonExcel);

    }
    function generateExcelFile(jsonObj) {
        testTypes = {
            "id": "Number",
            "part_number": "String",
            "serial_number": "String",
            "user_sso": "String",
            "type": "String",
            "date": "String",
            "json": "String",
            "jsonCalib": "String"
        };

        emitXmlHeader = function () {
            var headerRow = '<ss:Row>\n';
            for (var colName in testTypes) {
                headerRow += '  <ss:Cell>\n';
                headerRow += '    <ss:Data ss:Type="String">';
                headerRow += colName + '</ss:Data>\n';
                headerRow += '  </ss:Cell>\n';
            }
            headerRow += '</ss:Row>\n';
            return '<?xml version="1.0"?>\n' +
                    '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
                    '<ss:Worksheet ss:Name="Sheet1">\n' +
                    '<ss:Table>\n\n' + headerRow;
        };

        emitXmlFooter = function () {
            return '\n</ss:Table>\n' +
                    '</ss:Worksheet>\n' +
                    '</ss:Workbook>\n';
        };

        jsonToSsXml = function (jsonObject) {
            var row;
            var col;
            var xml;
            var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;

            xml = emitXmlHeader();

            for (row = 0; row < data.length; row++) {
                xml += '<ss:Row>\n';

                for (col in data[row]) {
                    xml += '  <ss:Cell>\n';
                    xml += '    <ss:Data ss:Type="' + testTypes[col] + '">';
                    xml += data[row][col] + '</ss:Data>\n';
                    xml += '  </ss:Cell>\n';
                }

                xml += '</ss:Row>\n';
            }

            xml += emitXmlFooter();
            return xml;
        };

        console.log(jsonToSsXml(jsonObj));

        download = function (content, filename, contentType) {
            if (!contentType)
                contentType = 'application/octet-stream';
            var a = document.getElementById('test_excel_download');
            var blob = new Blob([content], {
                'type': contentType
            });
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
        };

        download(jsonToSsXml(jsonObj), 'history.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// EMERGENCY STOP PROCESS ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $(".emergency_container .emergency").on('click', function () {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            clearInterval(intervalSpe);
            $(this).find("img").attr('src', 'images/switch_off.png');
        } else {
            $(this).addClass('on');
            intervalSpe = setInterval(function () {
                sendSignal("002400806d68d7551407f09b861e3aad000549a844010000000007180500000000000000");
            }, 100);
            $(this).find("img").attr('src', 'images/switch_on.png');
        }
    });
    $(".emergency_container .emergency_bt_clr").on('click', function () {
        sendSignal("002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2F00300143000000");
        sendSignal("002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2F0030024C000000");
        sendSignal("002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2F00300352000000");
    });
    $(".emergency_container .emergency_bt_set").on('click', function () {
        sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300153000000");
        sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300245000000");
        sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300354000000");
    });
    $(".emergency_container .emergency_bt_down").on('click', function () {
        sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300144000000");
        sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F00300257000000");
        sendSignal("002400806d68d7551407f09b861e3aad000549a844050000" + cobID2 + "2F0030034E000000");
    });
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// PING SERVICE BTN           ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $(".get_bad").on('click', function(){
        if($(this).hasClass("on")){
            $(this).removeClass('on');
            $(".get_bad").removeClass("blinker_me");
            $(this).find("span").html("Check");
            clearInterval(intervalBAD);
            _MODE = "CALIBRATION";
            
        }else{
            _MODE = "BAD_CHECK";
            $(this).addClass('on');
            $(this).find("span").html("Stop");
            $(".get_bad").addClass("blinker_me");
            intervalBAD = setInterval(function(){
                var pingSignal = Cal_post+"080000"+cobID2+"40006003";
                sendSignal(pingSignal);
            },250);
        }
        
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// ON CLICK FUNCTION ////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //différentes fonctions d'envoi de signaux au tsui
    $("#start_node").on('click', function () {
        sendSignal(startNodeMsg);
    });
    $("#stop_node").on('click', function () {
        sendSignal(stopNodeMsg);
    });
    $("#start_led").on('click', function () {
        sendSignal("002400806d68d7551407f09b861e3aad000549a84408000000000328FFFFFFFFFFFFFFFF");
    });
    $("#stop_led").on('click', function () {
        sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000003280000000000000000");
    });

    $("#record_log").on('click', function () {
        generateJsonLog();
    });
    

    $(".start_node_bt").on('click', function () {
        sendSignal(startNodeMsg);
        if(typeChoice == "AGILA"){
            setTimeout(function(){
                var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                sendSignal(sign);
            },100)                    
        }
    });
    $(".stop_node_bt").on('click', function () {
        sendSignal(stopNodeMsg);
    });
    $(".display_all_bt").on('click', function () {
        if (familyChoice === "ELEGANCE" && modelChoice === "TSSC") {
            // pour TSSC ELEGANCE
            sendSignal("002400806d68d7551407f09b861e3aad000549a84408000000000328AAAAAAAAAAAAAA88");
            sendSignal("002400806d68d7551407f09b861e3aad000549a84408000000000428AAAAAAA8AAAAAAAA");
            sendSignal("002400806d68d7551407f09b861e3aad000549a84404000000000228AAAA000000000000");
        } else if (familyChoice === "ELEGANCE" && modelChoice === "SMARTBOX" && typeChoice === "AGILA") {
            // pour SB TYPE AGILA
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200302000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200202000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200102000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200502000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000004202A00000000000000"); //AGILA CONF ONLY
        } else if (familyChoice === "ELEGANCE" && modelChoice === "SMARTBOX" && typeChoice === "OTHER") {
            // pour SB TYPE OTHER
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200302000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200202000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200102000000000000");
        }else if(globalName == "OMEGA"){
            if(modelName == "TSSC"){
                
            }else{
                sendSignal("002400806d68d7551407f09b861e3aad000549a84401000006c422500800000000000000");
                sendSignal("002400806d68d7551407f09b861e3aad000549a84401000006e422500a00000000000000");
            }
        }
    });
    $(".stop_all_bt").on('click', function () {        
        stopAllLED(globalName, modelName, typeChoice);
        
    });
    $(".start_agila_bt").on('click', function () {
        sendSignal("002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2F01300101000000");
    });
    $(".start_elegance_bt").on('click', function () {
        sendSignal("002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2F01300102000000");
    });
    
    $(".change_nodeid").on('click', function () {
        var value = $("#value_nodeid").html().trim();
        if (value !== " ") {
            //alert("send D" + value);
            sendSignalPic("D" + value);
            sendSignalPic("2");
            setTimeout(function () {
                sendSignalPic("5");
                setTimeout(function () {
                    _MODE = "START";
                    setTimeout(function () {
                        setGenericMessages(globalName);
                        _MODE = "TOOLBOX";
                        sendSignalPic("1");
                    }, 3000);
                }, 1000);
            }, 200);
        }
    });

    $("#send_pic").on('click', function () {
        var signal = $("#msg_pic").val();
        sendSignalPic(signal);
    });
    $(".toolbox").on('click', function () {
        _MODE = "TOOLBOX";
    });
    $(".test_bt_home").on('click', function () {
        _MODE = "PRETEST";
        sendSignal("002400806d68d7551407f09b861e3aad000549a84402000000000000012D000000000000");
    });

    //switch de panel sur la toolbox ingé
    $("#content_toolbox .show_joystick").on('click', function () {
        $("#content_toolbox .diag_inge .button_show").fadeOut(300);
        $("#content_toolbox .diag_inge .led_show").fadeOut(300);
        setTimeout(function () {
            $("#content_toolbox .diag_inge .joystick_show").fadeIn(300);
        }, 300);
        if(globalName == "OMEGA" && modelName =="TSSC"){
            sendSignalPic("7");
        }else if(globalName == "OMEGA" && modelName =="SMARTBOX"){
            sendSignalPic("9");        
        }else if(globalName == "OMEGA" && modelName =="SMARTHANDLE"){
            sendSignalPic("9");
        }
        else{
            sendSignalPic("2");
        }
    });
    $("#content_toolbox .show_button").on('click', function () {
        stopAllLED(globalName, modelName, typeChoice);
        $(".switch").each(function(){
            $(this).removeClass('activated');
            $(this).find('img').attr('src','images/switch_off.png');
        })
        $(".switch_hw").each(function(){
            $(this).removeClass('activated');
            $(this).find('img').attr('src','images/switch_off.png');
        })
        $("#content_toolbox .diag_inge .joystick_show").fadeOut(300);
        $("#content_toolbox .diag_inge .led_show").fadeOut(300);
        setTimeout(function () {
            $("#content_toolbox .diag_inge .button_show").fadeIn(300);
        }, 300);
        if(globalName == "OMEGA" && modelName =="TSSC"){
            sendSignalPic("7");            
            sendSignalPic("DP");
            if($(".bt_diag_mode .switch_diag_mod").hasClass("activated")){
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2226100000000000000000");
                setTimeout(function(){
                    sendSignal(startSlaveTSSC);
                },9000); 
                $(".bt_diag_mode .switch_diag_mod").removeClass("activated");
                $(".bt_diag_mode .switch_diag_mod").find("img").attr("src", "images/switch_off.png");
            }               
        }else if(globalName == "OMEGA" && modelName =="SMARTBOX"){
            sendSignalPic("9");        
            sendSignalPic("D`");
            sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2426100000000000000000");
            setTimeout(function(){
                sendSignal(startSlaveSBSH);
                sendSignal(startSlaveSBSH2);
            },9000); 
            $(".bt_diag_mode .switch_diag_mod").removeClass("activated");
           $(".bt_diag_mode .switch_diag_mod").find("img").attr("src", "images/switch_off.png");
        }else if(globalName == "OMEGA" && modelName =="SMARTHANDLE"){
            sendSignalPic("9");
            sendSignalPic("DP");
            if($(".bt_diag_mode .switch_diag_mod").hasClass("activated")){
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2426100000000000000000");
                setTimeout(function(){
                    sendSignal(startSlaveSBSH);
                    sendSignal(startSlaveSBSH2);
                },9000);                
                $(".bt_diag_mode .switch_diag_mod").find("img").attr("src", "images/switch_off.png");
                $(".bt_diag_mode .switch_diag_mod").removeClass("activated");
            }
            
        }
        else{
            sendSignalPic("2");
        }
        
    });
    $("#content_toolbox .show_led").on('click', function () {
        $("#content_toolbox .diag_inge .joystick_show").fadeOut(300);
        $("#content_toolbox .diag_inge .button_show").fadeOut(300);
        setTimeout(function () {
            $("#content_toolbox .diag_inge .led_show").fadeIn(300);
        }, 300);
        
        if(globalName == "OMEGA" && modelName =="TSSC"){
            sendSignalPic("6");
            
        }else if(globalName == "OMEGA" && modelName =="SMARTBOX"){
            sendSignalPic("8");        
        }else if(globalName == "OMEGA" && modelName =="SMARTHANDLE"){
            sendSignalPic("8");
        }
        else{
            sendSignalPic("1");
        }
    });

    $("#content_toolbox .get_conf_inge").on('click', function () {
        setTimeout(function () {
            _MODE = "TOOLBOX";
        }, 1500);
    });

    $("#dialog-link-download").on('click', function () {
        $("#content_toolbox .panels").fadeOut(300);
        _MODE = "TOOLBOX";
        setTimeout(function () {
            $("#content_toolbox .download_inge").fadeIn(300);
            $("#dialog-link-diagnostic").removeClass("selected");
            $("#dialog-link-calibration").removeClass("selected");
            $("#dialog-link-download").addClass("selected");
        }, 300);
    });
    $("#dialog-link-diagnostic").on('click', function () {
        _MODE = "TOOLBOX";
        $("#content_toolbox .panels").fadeOut(300);
        setTimeout(function () {
            $("#content_toolbox .diag_inge").fadeIn(300);
            $("#dialog-link-download").removeClass("selected");
            $("#dialog-link-calibration").removeClass("selected");
            $("#dialog-link-diagnostic").addClass("selected");
        }, 300);
    });
    $("#dialog-link-calibration").on('click', function () {
        $("#content_toolbox .panels").fadeOut(300);
        setTimeout(function () {
            $("#content_toolbox .calibration_inge").fadeIn(300);
            $("#dialog-link-download").removeClass("selected");
            $("#dialog-link-diagnostic").removeClass("selected");
            $("#dialog-link-calibration").addClass("selected");
        }, 300);
    });

    srtlContainer.find(".srtl").on('click', function () {
        var _this = $(this)
        if ($(this).hasClass("on")) {
            $(this).removeClass("on");
            $(this).find("img").attr('src', 'images/switch_off.png');
            sendSignalPic("4");            
            if(typeChoice == "AGILA"){
                setTimeout(function(){
                    sendSignal(startNodeMsg);
                    var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                    sendSignal(sign);
                },4000)                    
            }else{
                setTimeout(function(){
                    sendSignal(startNodeMsg);                    
                },4000)     
            }
        } else {
            $(this).addClass("on");
            $(this).find("img").attr('src', 'images/switch_on.png');
            sendSignalPic("3");            
            if(typeChoice == "AGILA"){
                setTimeout(function(){
                    sendSignal(startNodeMsg);
                    var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                    sendSignal(sign);
                },4000)                    
            }else{
                setTimeout(function(){
                    sendSignal(startNodeMsg);                    
                },4000)    
            }
            setTimeout(function () {
                if (hasSRTL == 0) {
                    _this.removeClass("on");
                    _this.find("img").attr('src', 'images/switch_off.png');
                    sendSignalPic("4");
                } else {
                    //alert('has strl= '+hasSRTL);
                }
            }, 1500);
        }
    });

    $(".start_node").on('click', function () {
        sendSignal(startNodeMsg);
    });
    $(".agila_conf").on('click', function () {
        var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
        sendSignal(sign);
    });
    $(".front_panel_led1").on('click', function () {
        var sign = "002400806d68d7551407f09b861e3aad000549a844020000000004200200000000000000";
        console.log(sign);
        sendSignal(sign);

    });
    $(".front_panel_led2").on('click', function () {
        var sign = "002400806d68d7551407f09b861e3aad000549a844020000000004202000000000000000";
        console.log(sign);
        sendSignal(sign);

    });
    $(".front_panel_led3").on('click', function () {
        var sign = "002400806d68d7551407f09b861e3aad000549a844020000000004200800000000000000";
        console.log(sign);
        sendSignal(sign);

    });
    $(".bouton.newjoy").on('click', function () {
        _MODE = "PRETEST";
        //alert("mode pretest");
    });
    $(".tsui_restart_bt").on('click', function () {
        if(globalName == "ELEGANCE"){
            sendSignalPic("5");
            setTimeout(function(){
                sendSignal(startNodeMsg)
                if(typeChoice == "AGILA"){
                    setTimeout(function(){
                        var sign = "002400806d68d7551407f09b861e3aad000549a844080000" + cobID2 + "2f01300101000000";
                        sendSignal(sign);
                    },100)                    
                }
            },20000)
        }else if(globalName == "OMEGA"){
            if(modelName == "TSSC"){
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc22f000e00000000000000");
            }else{
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc42f000e00000000000000");
                setTimeout(function(){
                    sendSignal("002400806d68d7551407f09b861e3aad000549a844010000028426401000000000000000");
                },20000)
            }
        }        
    });
    $(".head_logo").on('click', function(){
        _MODE = "START";
        if($(this).hasClass("repair_mode") || $(this).hasClass("manufacturing_mode")){
            resetDisplayCalibration(hasServiceBt, switchPosNumber);
        }else if($(this).hasClass("inge_mode")){            
            stopAllLED(globalName, modelName, typeChoice);
            $(".switch").each(function(){
                $(this).removeClass('activated');
                $(this).find('img').attr('src','images/switch_off.png');
            })
            $(".switch_hw").each(function(){
                $(this).removeClass('activated');
                $(this).find('img').attr('src','images/switch_off.png');
            })
            $("#content_toolbox .diag_inge .joystick_show").fadeOut(300);
            $("#content_toolbox .diag_inge .led_show").fadeOut(300);
            setTimeout(function () {
                $("#content_toolbox .diag_inge .button_show").fadeIn(300);
            }, 300);
            if(globalName == "OMEGA" && modelName =="TSSC"){
                sendSignalPic("7");            
                sendSignalPic("DP");
                if($(".bt_diag_mode .switch_diag_mod").hasClass("activated")){
                    sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2226100000000000000000");
                    setTimeout(function(){
                        sendSignal(startSlaveTSSC);
                    },9000); 
                    $(".bt_diag_mode .switch_diag_mod").removeClass("activated");
                    $(".bt_diag_mode .switch_diag_mod").find("img").attr("src", "images/switch_off.png");
                }               
            }else if(globalName == "OMEGA" && modelName =="SMARTBOX"){
                sendSignalPic("9");        
                sendSignalPic("D`");
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2426100000000000000000");
                setTimeout(function(){
                    sendSignal(startSlaveSBSH);
                    sendSignal(startSlaveSBSH2);
                },9000); 
                $(".bt_diag_mode .switch_diag_mod").removeClass("activated");
               $(".bt_diag_mode .switch_diag_mod").find("img").attr("src", "images/switch_off.png");
            }else if(globalName == "OMEGA" && modelName =="SMARTHANDLE"){
                sendSignalPic("9");
                sendSignalPic("DP");
                if($(".bt_diag_mode .switch_diag_mod").hasClass("activated")){
                    sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2426100000000000000000");
                    setTimeout(function(){
                        sendSignal(startSlaveSBSH);
                        sendSignal(startSlaveSBSH2);
                    },9000);                
                    $(".bt_diag_mode .switch_diag_mod").find("img").attr("src", "images/switch_off.png");
                    $(".bt_diag_mode .switch_diag_mod").removeClass("activated");
                }

            }
            else{
                sendSignalPic("2");
            }
        }
    });
    $(".exit_role").on('click', function(){
        _MODE = "START";        
        resetDisplayCalibration(hasServiceBt, switchPosNumber);        
    });
    
    $(".manufacturing_history_bt").on('click', function(){
        modeManufacturing = 1;
        $(".content_history_table").empty();
    });
    $(".bt_section.history").on('click', function(){
        $(".content_history_table").empty();
        modeManufacturing = 0;
    });
    
    $(".hw_signal_command_container .switch_hw").on('click', function(){
        var on_signal = $(this).data('on');
        var off_signal = $(this).data('off');
        
        if($(this).hasClass('activated')){
            $(this).removeClass("activated");
            $(this).find("img").attr('src', 'images/switch_off.png');
            sendSignalPic(off_signal);
        }else{
            $(".switch_hw").each(function(){
                $(this).removeClass('activated');
                $(this).find('img').attr('src','images/switch_off.png');
            })
            $(this).addClass("activated");
            $(this).find("img").attr('src', 'images/switch_on.png');
            sendSignalPic(on_signal);
        }
    });
    $(".master_switch .switch_mast").on('click', function(){
        var on_signal = "DA";        
        var off_signal = "D@";
        
        if($(this).hasClass('activated')){
            $(this).removeClass("activated");
            $(this).find("img").attr('src', 'images/switch_off.png');
            sendSignalPic(off_signal);
            sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc20f000e00000000000000");
        }else{           
            $(this).addClass("activated");
            $(this).find("img").attr('src', 'images/switch_on.png');
            sendSignalPic(on_signal);
            sendSignal("002400806d68d7551407f09b861e3aad000549a8440800001fc22f000e00000000000000");
        }
    });
    $(".bt_diag_mode .switch_diag_mod").on('click', function(){        
        if($(this).hasClass('activated')){
            $(this).removeClass("activated");
            $(this).find("img").attr('src', 'images/switch_off.png');            
            if(modelName == "TSSC"){
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2226100000000000000000");
                setTimeout(function(){sendSignal(startSlaveTSSC);},9000);            
            }else{
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c2426100000000000000000");
                setTimeout(function(){sendSignal(startSlaveSBSH);sendSignal(startSlaveSBSH2);},9000); 
            }
        }else{            
            $(this).addClass("activated");
            $(this).find("img").attr('src', 'images/switch_on.png');
            if(modelName == "TSSC"){
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c0226100000000000000000");
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c6226100000000000000000");

            }else{
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c0426100000000000000000");
                sendSignal("002400806d68d7551407f09b861e3aad000549a8440000000c6426100000000000000000");
            }
        }
    });
    
    function stopAllLED(globalName, modelName, typeChoice){
        if (globalName === "ELEGANCE" && modelName === "TSSC") {
            // pour TSSC ELEGANCE
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002280000000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000003280000000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000004280000000000000000");
        } else if (globalName === "ELEGANCE" && modelName === "SMARTBOX" && typeChoice === "AGILA") {
            // pour SB TYPE AGIlA
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200300000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200200000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200100000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200500000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000004200000000000000000"); //AGILA CONF ONLY
        } else if (globalName === "ELEGANCE" && modelName === "SMARTBOX" && typeChoice === "OTHER") {
            // pour SB TYPE OTHER
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200300000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200200000000000000");
            sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000002200100000000000000");
        }else if(globalName == "OMEGA"){
            if(modelName == "TSSC"){
                
            }else{
                sendSignal("002400806d68d7551407f09b861e3aad000549a84401000006c422500000000000000000");
                sendSignal("002400806d68d7551407f09b861e3aad000549a84401000006e422500000000000000000");
            }
        }
    }
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// SEND SIGNAL TO DRIVER ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    function sendSignal(signal) {
        signal = addZeroAfter(signal, 72);
        if (globalName == "OMEGA") {
            signal = adaptSignalOmega(signal);
        }
        
        if(is_hexadecimal(signal) && signal.length <= 72){
            var jsonData = '{"type":"signal", "msg":"' + signal + '"}';
            console.log(jsonData);        
            ws.send(jsonData);
        }else{
            var jsonData = '{"type":"signal", "msg":"' + signal + '"}';
            console.log(jsonData);    
            alert("Error : invalid format message, sending aborted to prevent Gateway corruption. "+signal.substring(42, signal.length));
        }
    }
    function sendSignalDownloadOmega(signal) {
        signal = addZeroAfter(signal, 72);
        var jsonData = '{"type":"signal", "msg":"' + signal + '"}';
        console.log(jsonData);
        ws.send(jsonData);
    }
    function sendSignalPic(signal) {
        var jsonData = '{"type":"signal_pic", "msg":"' + signal + '"}';
        console.log(jsonData);
        ws.send(jsonData);
    }
    function adaptSignalOmega(signal) {
        var modifiedSignal;
        var a = signal.substring(48, 49);
        a = addHexValOmega(a, 8);
        modifiedSignal = signal.substring(0, 48) + a + signal.substring(49, 72);
        return modifiedSignal;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// HEXADECIMAL FUNCTIONS ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    function convertHexa(hexaVal) {
        var newval = parseInt(hexaVal, 16);
        if (newval > 0x80) {
            newval = newval - 0x100;
        }
        return newval;
    }
    function convertHexaPic(hexaVal) {
        var newval = parseInt(hexaVal, 16);
        return newval;
    }
    function convertHexa2(hexaVal) {
        var a = parseInt(hexaVal, 16);
        if ((a & 0x8000) > 0) {
            a = a - 0x10000;
        }
        return a;
    }
    function addHexVal(c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 8) {
            hexStr = '0' + hexStr;
        } // Zero pad.
        return hexStr;
    }
    function addHexValOmega(c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);

        return hexStr;
    }
    function addHexValOmegaDownload(c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 4) {
            hexStr = '0' + hexStr;
        } // Zero pad.
        return hexStr;
    }
    function hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }


});
