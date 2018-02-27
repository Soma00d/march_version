$(document).ready(function () {
    var userInfo = {};
    var allUser = {};
    var allLogs = {};
    var allSerial = {};
    var arrayAllUser = $(".adm_all_user_container .array_all_user");
    var arrayAllLogs = $(".adm_logs_container .array_all_logs");
    var arrayAllSerial = $(".adm_serial_container .array_all_sn");
    
    var contentArrayAllUser = $(".adm_all_user_container .array_all_user .content_array_user");
    var contentArrayAlllogs = $(".adm_logs_container .array_all_logs .content_array_logs");
    var contentArrayAllSerial = $(".adm_serial_container .array_all_sn .content_array_sn");
    
    var contentArrayDicoButton = $(".dictionary_type_listing.bouton-type .content_new_dico");
    var contentArrayDicoJoystick = $(".dictionary_type_listing.joystick-type .content_new_dico");
    var contentArrayDicoDisplay = $(".dictionary_type_listing.display-type .content_new_dico");
    
    var updateUserBox = $(".adm_all_user_container .overlay_udpdate .update_user_box");
    var createUserBox = $(".adm_all_user_container .overlay_create .create_user_box");
    
    console.log("welcome admin");
    
    
    //============================================================================//
    //                              LOGIN ADMIN                                   //
    //============================================================================//
    
    //gestion du background login admin
    var height = $( window ).height();
    $(".overlay_admin_login").css("height",height+"px");    
    $( window ).resize(function() {
        var height = $( window ).height();
        $(".overlay_admin_login").css("height",height+"px");
    });
    
    //envoi du formulaire d'authentification
    $("#sub_bt").on('click', function () {
        var user_sso = $("input#username_admin").val();

        if (user_sso !== "") {
            $.ajax({
                url: '../php/api.php?function=check_user_sso&param1=' + user_sso,
                type: 'GET',
                dataType: 'JSON',
                success: function (data, statut) {
                    userInfo = data;
                    if (userInfo.length == 0) {
                        alert("No result found with this SSO : " + user_sso);
                    } else if (userInfo[0].user_is_admin == 1) {
                        $("#main_admin_content").removeClass("hidden");
                        $(".overlay_admin_login").addClass("hidden");
                        $(".authenticate_admin input").val("");
                        $(".sso_user").html(user_sso);
                        $(".head_userinfo").removeClass("hidden");
                        $(".head_userinfo .info .role_user").html(userInfo[0].user_name + " - " + userInfo[0].user_description);
                    } else {
                        alert("This user does not have access rights for this section.");
                        $("#main_admin_content").addClass("hidden");
                        $(".head_userinfo").addClass("hidden");
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while trying to access database.");
                    $("#main_admin_content").addClass("hidden");
                    $(".head_userinfo").addClass("hidden");
                }
            });

        } else {
            alert("Some fields are missing");
            $("#content_homeE .information").addClass("hidden");
            $(".head_userinfo").addClass("hidden");
        }
    });
    

    //============================================================================//
    //                              MENU                                          //
    //============================================================================//

    //gestion des liens du menu et de l'ouverture des panels
    $(".menu_item").on('click', function () {
        var link = $(this).data('menulink');
        if (link !== "") {
            $(".page_content.active").removeClass("active");
            setTimeout(function () {
                $(document).find("#adm_content_" + link).addClass("active");
            }, 100);
        }
    });
    
    //gestion du menu déroulant
    $(function () {
        var Accordion = function (el, multiple) {
            this.el = el || {};
            // more then one submenu open?
            this.multiple = multiple || false;

            var dropdownlink = this.el.find('.dropdownlink');
            dropdownlink.on('click',
                    {el: this.el, multiple: this.multiple},
                    this.dropdown);
        };

        Accordion.prototype.dropdown = function (e) {
            var $el = e.data.el,
                    $this = $(this),
                    //this is the ul.submenuItems
                    $next = $this.next();

            $next.slideToggle();
            $this.parent().toggleClass('open');

            if (!e.data.multiple) {
                //show only one menu at the same time
                $el.find('.submenuItems').not($next).slideUp().parent().removeClass('open');
            }
        }

        var accordion = new Accordion($('.accordion-menu'), false);
    });

    
    //============================================================================//
    //                              USERS ADMIN                                   //
    //============================================================================//
    
    //recupération de la table users
    function getAllUser(){
        $.ajax({
            url: '../php/api.php?function=get_all_user',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                allUser = data;   
                fillUserTable(allUser);
            }
        });
    };
    //remplissage du tableau html et génération json pour export excel
    function fillUserTable(allUser){
        var userLength = allUser.length;
        if(userLength > 0){
            console.log(allUser);
            arrayAllUser.find(".content_array_user").empty();
            
            $(".adm_all_user_container .result_description span").html(userLength);
            for(var i=0; i < userLength; i++){
                var isAdmin;
                if(allUser[i].user_is_admin == 1){isAdmin = "<img src='../images/check_admin.png' class='check_admin'>"}else{isAdmin = "-"}
                contentArrayAllUser.append(
                    "<div class='line_user'>"+
                        "<div class='user_item user_id'>"+allUser[i].id+"</div>"+
                        "<div class='user_item user_name'>"+allUser[i].user_name+"</div>"+
                        "<div class='user_item user_sso'>"+allUser[i].user_sso+"</div>"+
                        "<div class='user_item user_description'>"+allUser[i].user_description+"</div>"+
                        "<div class='user_item user_role'>"+allUser[i].user_role+"</div>"+    
                        "<div class='user_item user_is_admin' data-admin='"+allUser[i].user_is_admin+"'>"+isAdmin+"</div>"+
                        "<div class='user_item user_action' data-id='"+allUser[i].id+"' data-name='"+allUser[i].user_name+"' data-sso='"+allUser[i].user_sso+"' data-description='"+allUser[i].user_description+"' data-role='"+allUser[i].user_role+"' data-admin='"+allUser[i].user_is_admin+"'>"+
                            "<img src='../images/modif_admin.png' class='modif_admin'>"+
                            "<img src='../images/delete_admin.png' class='delete_admin'>"+
                        "</div>"+
                    "</div>"
                );
            }
            generateUserJson();
        }
        contentArrayAllUser.find(".delete_admin").on('click', function(){
            var idLine = $(this).parent().data("id");
            if (confirm('Confirm the deletion of user ID '+idLine+'. This action is irreversible.')) {
                deleteLineByID(idLine, "user");
                setTimeout(function(){
                    getAllUser();
                },500);
            }
        });
        contentArrayAllUser.find(".modif_admin").on('click', function(){
            var idLine = $(this).parent().data("id");
            var nameLine = $(this).parent().data("name");
            var ssoLine = $(this).parent().data("sso");
            var descriptionLine = $(this).parent().data("description");
            var roleLine = $(this).parent().data("role");
            var adminLine = $(this).parent().data("admin");  
            openUserUpdateBox(idLine, nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
    };   
    
    //Ouverture de la fenetre d'update user
    function openUserUpdateBox(idLine, name, sso, description, permission, isAdmin){
        updateUserBox.find("select option").each(function(){
            $(this).removeAttr('selected');
        });
        updateUserBox.find(".id_user_span").html(idLine);
        updateUserBox.find(".update_user_name").val(name);
        updateUserBox.find(".update_user_sso").val(sso);
        updateUserBox.find(".update_user_description option").each(function(){
            if($(this).val()== description){                
                $(this).attr("selected","selected");
            }
        });
        updateUserBox.find(".update_user_role option").each(function(){
            if($(this).val()== permission){
                $(this).attr("selected","selected");
            }
        });
        updateUserBox.find(".update_user_admin option").each(function(){
            if($(this).val()== isAdmin){
                $(this).attr("selected","selected");
            }
        });
        $(".adm_all_user_container .overlay_udpdate").fadeIn(300);
        
        updateUserBox.find(".update_user_btn").on('click', function(){
            var nameLine = updateUserBox.find(".update_user_name").val();
            var ssoLine = updateUserBox.find(".update_user_sso").val();
            var descriptionLine = updateUserBox.find(".update_user_description option:selected").val();
            var roleLine = updateUserBox.find(".update_user_role option:selected").val();
            var adminLine = updateUserBox.find(".update_user_admin option:selected").val();
            updateUserByID(idLine, nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
        
    }
    //Fermeture de la fenetre d'update user
    function closeUserUpdateBox(){        
        $(".adm_all_user_container .overlay_udpdate").fadeOut(300);
    }    
    //Appel ajax pour modifier un utilisateur
    function updateUserByID(idLine, name, sso, description, permission, isAdmin){        
        $.ajax({
            url: '../php/api.php?function=update_user_by_id',
            type: 'POST',
            dataType: 'JSON',
            data:{id:idLine,name:name, sso:sso,description:description,permission:permission,isadmin:isAdmin}
        });
        setTimeout(function(){
            getAllUser();
            closeUserUpdateBox();
        },200);
    }
    
    //Ouverture de la fenetre de creation user
    function openCreateUserBox(){
        createUserBox.find("select option").each(function(){
            $(this).removeAttr('selected');
        });        
        createUserBox.find("input").each(function(){
            $(this).val('');
        });
        
        $(".adm_all_user_container .overlay_create").fadeIn(300);
        
        createUserBox.find(".create_user_btn").on('click', function(){
            var nameLine = createUserBox.find(".create_user_name").val();
            var ssoLine = createUserBox.find(".create_user_sso").val();
            var descriptionLine = createUserBox.find(".create_user_description option:selected").val();
            var roleLine = createUserBox.find(".create_user_role option:selected").val();
            var adminLine = createUserBox.find(".create_user_admin option:selected").val();
            createUser(nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
        
    }
    //Appel ajax pour creer un utilisateur
    function createUser(nameLine, ssoLine, descriptionLine, roleLine, adminLine){        
        $.ajax({
            url: '../php/api.php?function=create_user',
            type: 'POST',
            dataType: 'JSON',
            data:{name:nameLine, sso:ssoLine,description:descriptionLine,permission:roleLine,isadmin:adminLine}
        });
        setTimeout(function(){
            getAllUser();
            closeUserCreateBox();
        },200);
    }    
    //Fermeture de la fenetre de creation user
    function closeUserCreateBox(){        
        $(".adm_all_user_container .overlay_create").fadeOut(300);
    }
    
    
    //remplissage du tableau all user
    $(".all_user_page").on('click', function(){
        getAllUser();
    });
    //bouton d'ajout d'user user
    $(".add_user_description").on('click', function(){
        openCreateUserBox();
    });
    //fermture de la fenetre d'update user
    $(".adm_all_user_container .overlay_udpdate .update_user_box .cancel_user_btn").on('click', function(){
        closeUserUpdateBox();
    });
        
        
        
        
    //============================================================================//
    //                              LOGS ADMIN                                   //
    //============================================================================//
    //
    //remplissage du tableau logs
    $(".log_page").on('click', function(){
        searchLog();
    });
    $(".search_container .search_bt").on('click', function(){
        searchLog();
    });
    $(".search_container .export_bt").on('click', function(){
       generateLogsJson();
    });
    
    function searchLog() {
        var historyPNVal = $(".search_container .search_pn_input").val().trim();
        var historySNVal = $(".search_container .search_sn_input").val().trim();
        var historySSOVal = $(".search_container .search_sso_input").val().trim();
           
        $.ajax({            
            url: '../php/api.php?function=get_global_log&param1=' + historyPNVal + '&param2=' + historySNVal + '&param3=' + historySSOVal + '&param4',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("No result found with this part number.")
                } else {

                    $(".search_pn_input").val(historyPNVal);
                    $(".search_sn_input").val(historySNVal);
                    $(".search_sso_input").val(historySSOVal);

                    allLogs = data;   
                    console.log(allLogs);
                    fillLogsTable(allLogs);
                    
                }
            }
        });
    }
   
    //remplissage du tableau html et génération json pour export excel
    function fillLogsTable(allLogs){
        var logsLength = allLogs.length;
        if(logsLength > 0){
            console.log(allLogs);
            arrayAllLogs.find(".content_array_logs").empty();
            
            $(".adm_logs_container .result_description span").html(logsLength);
            for(var i=0; i < logsLength; i++){
                
                contentArrayAlllogs.append(
                    "<div class='line_logs'>"+
                        "<div class='logs_item logs_id'>"+allLogs[i].id+"</div>"+
                        "<div class='logs_item logs_sso'>"+allLogs[i].user_sso+"</div>"+
                        "<div class='logs_item logs_role'>"+allLogs[i].role+"</div>"+
                        "<div class='logs_item logs_sn'>"+allLogs[i].serial_number+"</div>"+
                        "<div class='logs_item logs_pn'>"+allLogs[i].part_number+"</div>"+
                        "<div class='logs_item logs_type'>"+allLogs[i].type+"</div>"+                        
                        "<div class='logs_item logs_date'>"+allLogs[i].date+"</div>"+                        
                        "<div class='logs_item logs_actions'><a>Logs file</a></div>"+
                    "</div>"
                );
            }
            generateUserJson();
        }
        
    };   
    
    
    //============================================================================//
    //                            SERIALS ADMIN                                   //
    //============================================================================//
    //
    //remplissage du tableau logs
    $(".serial_page").on('click', function(){
        searchSerial();
    });
    $(".search_container_sn .search_bt").on('click', function(){
        searchSerial();
    });
    $(".search_container_sn .export_bt").on('click', function(){
       generateSerialJson();
    });
    
    function searchSerial() {        
        var SNVal = $(".search_container_sn .search_sn_input").val().trim();
        if(SNVal == ""){
            SNVal = "all";
        }
           
        $.ajax({            
            url: '../php/api.php?function=get_sn&param1=' + SNVal,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("No result found with this serial number.")
                } else {                                       
                    allSerial = data;   
                    console.log(allSerial);
                    fillSerialTable(allSerial);
                    
                }
            }
        });
    }
   
    //remplissage du tableau html et génération json pour export excel
    function fillSerialTable(allSerial){
        var serialLength = allSerial.length;
        if(serialLength > 0){
            console.log(allSerial);
            arrayAllSerial.find(".content_array_sn").empty();
            
            $(".adm_serial_container .result_description span").html(serialLength);
            for(var i=0; i < serialLength; i++){
                if(allSerial[i].commentary != "" && allSerial[i].commentary){var date_comment = allSerial[i].date_commentary}else{var date_comment = "-"};
                console.log(allSerial[i].commentary);
                contentArrayAllSerial.append(
                    "<div class='line_sn'>"+
                        "<div class='sn_item sn_id'>"+allSerial[i].id+"</div>"+
                        "<div class='sn_item sn_sn'>"+allSerial[i].serial_number+"</div>"+
                        "<div class='sn_item sn_comment'>"+allSerial[i].commentary+"</div>"+          
                        "<div class='sn_item sn_date_serial'>"+allSerial[i].date+"</div>"+                        
                        "<div class='sn_item sn_date_comment'>"+date_comment+"</div>"+    
                        "<div class='sn_item sn_action' data-id='"+allSerial[i].id+"' data-sn='"+allSerial[i].serial_number+"' data-comment='"+allSerial[i].commentary+"''>"+
                            "<img src='../images/modif_admin.png' class='modif_admin'>"+
                            "<img src='../images/delete_admin.png' class='delete_admin'>"+
                        "</div>"+
                    "</div>"
                );
            }
            generateSerialJson();
        }
        contentArrayAllSerial.find(".delete_admin").on('click', function(){
            var idLine = $(this).parent().data("id");
            if (confirm('Confirm the deletion of user ID '+idLine+'. This action is irreversible.')) {
                deleteLineByID(idLine, "user");
                setTimeout(function(){
                    getAllUser();
                },500);
            }
        });
        contentArrayAllSerial.find(".modif_admin").on('click', function(){
            var idLine = $(this).parent().data("id");
            var nameLine = $(this).parent().data("name");
            var ssoLine = $(this).parent().data("sso");
            var descriptionLine = $(this).parent().data("description");
            var roleLine = $(this).parent().data("role");
            var adminLine = $(this).parent().data("admin");  
            openUserUpdateBox(idLine, nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
    };   
    
    
    //============================================================================//
    //                              FUNCTIONS ADMIN                               //
    //============================================================================//
    
    //Suppression d'une ligne d'une table par ID + effacement dans le tableau admin
    function deleteLineByID(idLine, tableName){
        if(idLine !== "" && tableName !== ""){
            $.ajax({
                url: '../php/api.php?function=delete_line_by_id',
                type: 'POST',
                dataType: 'JSON',
                data:{id:idLine,table:tableName}
            });
        }
    }
    
    
    //============================================================================//
    //                              EXPORT EXCEL ADMIN                            //
    //============================================================================//

    function generateUserJson() {
        var jsonExcel = [];
        contentArrayAllUser.find(".line_user").each(function () {
            var lineID = $(this).find(".user_id").html();
            var lineName = $(this).find(".user_name").html();
            var lineSSO = $(this).find(".user_sso").html();
            var lineDescription = $(this).find(".user_description").html();
            var lineRole = $(this).find(".user_role").html();
            var lineAdmin = $(this).find(".user_is_admin").data("admin");
            jsonExcel.push({user_id: lineID, user_name: lineName, user_sso: lineSSO, user_description: lineDescription, user_role: lineRole, user_admin: lineAdmin});
        });
        jsonExcel = JSON.stringify(jsonExcel);
        generateUserExcelFile(jsonExcel);

    };
    function generateUserExcelFile(jsonObj) {
        testTypes = {
            "user_id": "Number",
            "user_name": "String",
            "user_sso": "String",
            "user_description": "String",
            "user_role": "String",
            "user_admin": "Number"
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

        download = function (content, filename, contentType) {
            if (!contentType)
                contentType = 'application/octet-stream';
            var a = document.getElementById('export_user');            
            var blob = new Blob([content], {
                'type': contentType
            });
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
        };

        download(jsonToSsXml(jsonObj), 'testbench_users.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


    };
    
    function generateLogsJson() {
        var jsonExcel = [];
        contentArrayAlllogs.find(".line_logs").each(function () {
            var lineID = $(this).find(".logs_id").html();
            var linePN = $(this).find(".logs_pn").html();
            var lineSN = $(this).find(".logs_sn").html();
            var lineSSO = $(this).find(".logs_sso").html();
            var lineType = $(this).find(".logs_type").html();
            var lineDate = $(this).find(".logs_date").html();
            jsonExcel.push({id: lineID, part_number: linePN, serial_number: lineSN, user_sso: lineSSO, type: lineType, date: lineDate});
        });
        jsonExcel = JSON.stringify(jsonExcel);
        generateLogsExcelFile(jsonExcel);

    };
    function generateLogsExcelFile(jsonObj) {
        testTypes = {
            "id": "Number",
            "part_number": "String",
            "serial_number": "String",
            "user_sso": "String",
            "type": "String",
            "date": "String"
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

        download = function (content, filename, contentType) {
            if (!contentType)
                contentType = 'application/octet-stream';
            var a = document.getElementById('export_logs');            
            var blob = new Blob([content], {
                'type': contentType
            });
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
        };

        download(jsonToSsXml(jsonObj), 'testbench_logs.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


    };


    //============================================================================//
    //                              DICTIONARIES ADMIN                            //
    //============================================================================//

    $(".type-entry").on('click', function(){
        var _this = $(this);
        $(".dico_step2 .dictionary_type_listing").fadeOut(300);
        $(".dico_step2 .type-entry").each(function(){
            $(this).removeClass("selected");
        });
        setTimeout(function(){
            if(_this.hasClass("entry-bt")){
                _this.addClass("selected");
                $(".dico_step2 .dictionary_type_listing.bouton-type").fadeIn(300);
            }
            else if(_this.hasClass("entry-joy")){
                _this.addClass("selected");
                $(".dico_step2 .dictionary_type_listing.joystick-type").fadeIn(300);
            }
            else{
                _this.addClass("selected");
                $(".dico_step2 .dictionary_type_listing.display-type").fadeIn(300);
            }
        },300)
        
    });
    
    
    $(".bt_send_dico_form.step1").on('click', function(){
        var newID = $(".new_id_dico_input").val().trim();
        var description = $(".new_description_dico_input").val().trim();
        var refID = $(".model_ref_selector option:selected").val();
        var refFamily = $(".model_ref_selector option:selected").data('family');
        var refModel = $(".model_ref_selector option:selected").data('model');
        var refType = $(".model_ref_selector option:selected").data('type');        
        
        if(newID != "" && description != ""){
            $(".step1 .error_form_text").html("");
            $(".dico_form.step1").removeClass("error");  
            checkNewID(newID, description, refID, refFamily, refModel, refType);
        }else{
            $(".step1 .error_form_text").html("Some fields are missing.");
            $(".dico_form.step1").addClass("error");
        }        
    });    
    
    function checkNewID(newID, description, refID, refFamily, refModel, refType){
       $.ajax({
            url: '../php/api.php?function=check_new_id',
            type: 'POST',
            dataType: 'JSON',
            data:{newID:newID},
            success: function (data, statut) {
                if (data.length == 0) {
                    launchStep2(newID, description, refID, refFamily, refModel, refType);
                }else {
                    $(".step1 .error_form_text").html("This ID already exists and can't be added.");
                    $(".dico_form.step1").addClass("error");
                }
            }
        });
    }
    
    function launchStep2(newID, description, refID, refFamily, refModel, refType){
        $(".dico_step1").fadeOut(500);
        $(".dico_step2 .presentation .newID").html(newID);
        $(".dico_step2 .presentation .description_new_dico").html(description);
        $(".dico_step2 .presentation .ref_model").html(refFamily+ " "+refModel+" "+refType);        
        $.ajax({
            url: '../php/api.php?function=get_dictionaries_by_id&param1='+refID,
            type: 'GET',
            dataType: 'JSON',
            data:{},
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("error");
                }else {
                    console.log(data);
                    for(var i=0; i< data.length; i++){
                        if(data[i].is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                        if(data[i].is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                        if(data[i].is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                        if(data[i].is_led == 1 || data[i].is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                        if(data[i].is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}
                        
                        if(data[i].type == "button"){
                            contentArrayDicoButton.append("<div class='line_new_dico bt_"+i+"' data-index='bt_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_safety'>"+isSafety+"</div>"
                                    +"<div class='td_dico is_enable'>"+isEnable+"</div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"      
                                    +"<div class='td_dico is_led'>"+isLED+"</div>"
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico can_info' title='CAN ID : "+data[i].can_id+"\nCAN Data Press : "+data[i].pressed_val+"\nCAN Data Release : "+data[i].released_val+"'><img src='../images/search.png' ></div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }else if(data[i].type == "joystick" || data[i].type == "mushroom"){
                            contentArrayDicoJoystick.append("<div class='line_new_dico joy_"+i+"' data-index='joy_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }else if(data[i].type == "display" || data[i].type == "buzzer"){
                            contentArrayDicoDisplay.append("<div class='line_new_dico disp_"+i+"'data-index='disp_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }
                    }
                    
                    $(".delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                    });
                    
                    $(".update_line").on('click', function(){
                        var id = $(this).parents(".line_new_dico").data('index');
                        var type = $(this).parents(".line_new_dico").data('type');
                        updateDictionaryLine(id, type); 
                    });
                    
                    
                    setTimeout(function(){
                        $(".dico_step2 .entry-bt").addClass("selected");
                        $(".dico_step2 .dictionary_type_listing.bouton-type").fadeIn(300);
                        $(".dico_step2").fadeIn(300);
                    },500);
                }
            }
        });
        
        function updateDictionaryLine(id, type){  
            
            console.log(id);
            
            var calib_subindex_x = $("."+id).data("calibsubindexx");
            var calib_subindex_y = $("."+id).data("calibsubindexy");
            var can_id = $("."+id).data("canid");
            var description = $("."+id).data("description");
            var dim_signal = $("."+id).data("dimsignal");
            var family_id = $("."+id).data("calibsubindexx");
            var flash_signal = $("."+id).data("flashsignal");
            var is_cdrh = $("."+id).data("iscdrh");
            var is_enable = $("."+id).data("isenable");
            var is_final = $("."+id).data("isfinal");
            var is_led = $("."+id).data("isled");
            var is_safety = $("."+id).data("issafety");
            var off_signal = $("."+id).data("offsignal");
            var on_signal = $("."+id).data("onsignal");
            var photo_link = $("."+id).data("photolink");
            var pressed_val = $("."+id).data("pressedval");
            var released_val = $("."+id).data("releasedval");
            var standard_name = $("."+id).data("standardname");
            var symbol_name = $("."+id).data("symbolname");
            var threshold_max_axis = $("."+id).data("thresholdmaxaxis");
            var threshold_max_zero = $("."+id).data("threshold_max_zero");
            var threshold_min_axis = $("."+id).data("thresholdminaxis");
            var threshold_min_zero = $("."+id).data("thresholdminzero");
            var timer = $("."+id).data("timer");
            var value = $("."+id).data("value");
            var x_pos = $("."+id).data("xpos");
            var y_pos = $("."+id).data("ypos");
            var zone = $("."+id).data("zone");
            
            var lineArray = {
                symbol_name:symbol_name, standard_name: standard_name, description:description,
                is_led:is_led, is_safety:is_safety, is_enable:is_enable,
                is_cdrh:is_cdrh, is_final:is_final, zone:zone, timer:timer,
                photo_link:photo_link, can_id:can_id, pressed_val:pressed_val, released_val:released_val,
                on_signal:on_signal, off_signal:off_signal, flash_signal:flash_signal, dim_signal:dim_signal,
                x_pos:x_pos,y_pos:y_pos,threshold_max_axis:threshold_max_axis, threshold_max_zero:threshold_max_zero,
                threshold_min_axis:threshold_min_axis,threshold_min_zero:threshold_min_zero,
                calib_subindex_x:calib_subindex_x, calib_subindex_y:calib_subindex_y
            };
            if(type == "button"){
                updateFormButton(id, lineArray);
            }else if(type == "joystick" || type == "mushroom"){
                console.log(lineArray);
                updateFormJoystick(id, lineArray);
            }else if(type == "display" || type == "buzzer"){
                updateFormDisplay(id, lineArray);
            }
        }
        
        function updateFormButton(id, lineArray){
            
            var formBtCtn = $(".dico_main_container .formulaire_update_button");
            
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
            
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formBtCtn.find(".title").html("Update Button <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            formBtCtn.find(".symbol_name").val(lineArray.symbol_name);
            formBtCtn.find(".photo_link").val(lineArray.photo_link);
            formBtCtn.find(".standard_name").val(lineArray.standard_name);
            formBtCtn.find(".timer").val(lineArray.timer);
            formBtCtn.find(".description").val(lineArray.description);
            
            formBtCtn.find(".can_id").val(lineArray.can_id);
            formBtCtn.find(".pressed_value").val(lineArray.pressed_val);
            formBtCtn.find(".released_value").val(lineArray.released_val);
            
            formBtCtn.find(".on_signal").val(lineArray.on_signal);
            formBtCtn.find(".off_signal").val(lineArray.off_signal);
            formBtCtn.find(".dim_signal").val(lineArray.dim_signal);
            formBtCtn.find(".flash_signal").val(lineArray.flash_signal);
            
            formBtCtn.find(".is_safety option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_safety){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_enable option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_enable){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_led option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            });
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            formBtCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"bt",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_led:formBtCtn.find(".is_led option:selected").val(), 
                    is_safety:formBtCtn.find(".is_safety option:selected").val(), 
                    is_enable:formBtCtn.find(".is_enable option:selected").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(), 
                    zone:formBtCtn.find(".zone option:selected").val(), 
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    pressed_val:formBtCtn.find(".pressed_value").val(),
                    released_val:formBtCtn.find(".released_value").val(),
                    on_signal:formBtCtn.find(".on_signal").val(),
                    off_signal:formBtCtn.find(".off_signal").val(),
                    flash_signal:formBtCtn.find(".flash_signal").val(),
                    dim_signal:formBtCtn.find(".dim_signal").val()
                }
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
                updateLineNewInfo(id, newLineArrayBt)
            });
        }
        
        function updateFormJoystick(id, lineArray){
            
            var formBtCtn = $(".dico_main_container .formulaire_update_joystick");
            
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
            
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formBtCtn.find(".title").html("Update Joystick <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            
            formBtCtn.find(".symbol_name").val(lineArray.symbol_name);
            
            formBtCtn.find(".photo_link").val(lineArray.photo_link);
            formBtCtn.find(".standard_name").val(lineArray.standard_name);
            formBtCtn.find(".timer").val(lineArray.timer);
            formBtCtn.find(".description").val(lineArray.description);
            
            formBtCtn.find(".x_pos").val(lineArray.x_pos);
            formBtCtn.find(".y_pos").val(lineArray.y_pos);
            formBtCtn.find(".calib_subindex_x").val(lineArray.calib_subindex_x);
            formBtCtn.find(".calib_subindex_y").val(lineArray.calib_subindex_y);
            formBtCtn.find(".threshold_max_zero").val(lineArray.threshold_max_zero);
            formBtCtn.find(".threshold_max_axis").val(lineArray.threshold_max_axis);
            formBtCtn.find(".threshold_min_axis").val(lineArray.threshold_min_axis);
            formBtCtn.find(".threshold_min_zero").val(lineArray.threshold_min_zero);
            formBtCtn.find(".calib_subindex_x").val(lineArray.calib_subindex_x);
            formBtCtn.find(".calib_subindex_y").val(lineArray.calib_subindex_y);
            
            formBtCtn.find(".can_id").val(lineArray.can_id);
            formBtCtn.find(".pressed_value").val(lineArray.pressed_val);
            formBtCtn.find(".released_value").val(lineArray.released_val);
                                   
                        
            formBtCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".type option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.type){$(this).attr('selected', 'selected')};
            });
            
            
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            formBtCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"joy",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(),
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    x_pos:formBtCtn.find(".x_pos").val(),
                    y_pos:formBtCtn.find(".y_pos").val(),
                    threshold_max_axis:formBtCtn.find(".threshold_max_axis").val(), 
                    threshold_max_zero:formBtCtn.find(".threshold_max_zero").val(),
                    threshold_min_axis:formBtCtn.find(".threshold_min_axis").val(),
                    threshold_min_zero:formBtCtn.find(".threshold_min_zero").val(),
                    calib_subindex_x:formBtCtn.find(".calib_subindex_x").val(),
                    calib_subindex_y:formBtCtn.find(".calib_subindex_y").val()
                }
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
                updateLineNewInfo(id, newLineArrayBt)
            });
        }
        
        function updateLineNewInfo(id, newLineArrayBt){
            console.log(id);
            console.log(newLineArrayBt);
            
            
            if(newLineArrayBt.type_array == "bt"){
                var formBtCtn = $(".dico_main_container .formulaire_update_button");
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}                
                
                $(".dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id).data('isled', newLineArrayBt.is_led);
                $(".dictionary_type_listing").find("."+id).data('issafety', newLineArrayBt.is_safety);
                $(".dictionary_type_listing").find("."+id).data('isenable', newLineArrayBt.is_enable);
                $(".dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".dictionary_type_listing").find("."+id).data('zone', newLineArrayBt.zone);
                $(".dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                $(".dictionary_type_listing").find("."+id).data('pressedval', newLineArrayBt.pressed_val);
                $(".dictionary_type_listing").find("."+id).data('releasedval', newLineArrayBt.released_val);
                $(".dictionary_type_listing").find("."+id).data('onsignal', newLineArrayBt.on_signal);
                $(".dictionary_type_listing").find("."+id).data('offsignal', newLineArrayBt.off_signal);
                $(".dictionary_type_listing").find("."+id).data('flashsignal', newLineArrayBt.flash_signal);
                $(".dictionary_type_listing").find("."+id).data('dimsignal', newLineArrayBt.dim_signal);
                
                $(".dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".dictionary_type_listing").find("."+id+" .can_info").attr('title', "CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val);
                
                $(".dictionary_type_listing").find("."+id+" .is_safety").html(isSafety);
                $(".dictionary_type_listing").find("."+id+" .is_enable").html(isEnable);
                $(".dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".dictionary_type_listing").find("."+id+" .is_led").html(isLED);
                $(".dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
                
            }else if(newLineArrayBt.type_array == "joy"){
                var formBtCtn = $(".dico_main_container .formulaire_update_button");
                
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}                
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}                
                
                $(".dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id).data('isenable', newLineArrayBt.is_enable);
                $(".dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                
                $(".dictionary_type_listing").find("."+id).data('xpos', newLineArrayBt.x_pos);
                $(".dictionary_type_listing").find("."+id).data('ypos', newLineArrayBt.y_pos);
                
                $(".dictionary_type_listing").find("."+id).data('calibsubindexx', newLineArrayBt.calib_subindex_x);
                $(".dictionary_type_listing").find("."+id).data('calibsubindexy', newLineArrayBt.calib_subindex_y);
                
                $(".dictionary_type_listing").find("."+id).data('thresholdmaxaxis', newLineArrayBt.threshold_max_axis);
                $(".dictionary_type_listing").find("."+id).data('thresholdminaxis', newLineArrayBt.threshold_min_axis);
                $(".dictionary_type_listing").find("."+id).data('thresholdminzero', newLineArrayBt.threshold_min_zero);
                $(".dictionary_type_listing").find("."+id).data('threshold_max_zero', newLineArrayBt.threshold_max_zero);
                
                $(".dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
                
            }
            
            $(".dictionary_type_listing").find("."+id).addClass("updated_state");
            
            console.log($(".dictionary_type_listing").find("."+id).data('symbolname'));
            
            
        }
        
        $(".add_new_entry").on('click', function(){
            if($(this).hasClass("bt")){
                createNewButton();
            }else if($(this).hasClass("joy")){
                createNewJoystick();
            }else if($(this).hasClass("disp")){
                createNewDisplay();
            }
        })
        
        function createNewButton(){
            var formBtCtn = $(".dico_main_container .formulaire_create_button");
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            formBtCtn.find(".create_button").off();
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
    
            formBtCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array: "bt",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_led:formBtCtn.find(".is_led option:selected").val(), 
                    is_safety:formBtCtn.find(".is_safety option:selected").val(), 
                    is_enable:formBtCtn.find(".is_enable option:selected").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(), 
                    zone:formBtCtn.find(".zone option:selected").val(), 
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    pressed_val:formBtCtn.find(".pressed_value").val(),
                    released_val:formBtCtn.find(".released_value").val(),
                    on_signal:formBtCtn.find(".on_signal").val(),
                    off_signal:formBtCtn.find(".off_signal").val(),
                    flash_signal:formBtCtn.find(".flash_signal").val(),
                    dim_signal:formBtCtn.find(".dim_signal").val()
                }
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".dictionary_type_listing.bouton-type .line_new_dico").length)+1;;
                
                var newEntry = "<div class='line_new_dico bt_"+count+" created_state' data-index='bt_"+count+"' data-calibsubindexx='' data-calibsubindexy='' data-canid='"+newLineArrayBt.can_id+"' data-description='"+newLineArrayBt.description+"' data-dimsignal='"+newLineArrayBt.dim_signal+"' data-familyid='' data-flashsignal='"+newLineArrayBt.flash_signal+"' data-id='' data-iscdrh='"+newLineArrayBt.is_cdrh+"' data-isenable='"+newLineArrayBt.is_enable+"' data-isfinal='"+newLineArrayBt.is_final+"' data-isled='"+newLineArrayBt.is_led+"' data-issafety='"+newLineArrayBt.is_safety+"' data-offsignal='"+newLineArrayBt.off_signal+"' data-onsignal='"+newLineArrayBt.on_signal+"' data-photolink='"+newLineArrayBt.photo_link+"' data-pressedval='"+newLineArrayBt.pressed_val+"' data-releasedval='"+newLineArrayBt.released_val+"' data-standardname='"+newLineArrayBt.standard_name+"' data-symbolname='"+newLineArrayBt.symbol_name+"' data-thresholdmaxaxis='0' data-threshold_max_zero='0' data-thresholdminaxis='0' data-thresholdminzero='0' data-timer='"+newLineArrayBt.timer+"' data-type='button' data-value='' data-xpos='' data-ypos='' data-zone='"+newLineArrayBt.zone+"'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayBt.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayBt.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayBt.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayBt.photo_link+"'></div>"
                    +"<div class='td_dico is_safety'>"+isSafety+"</div>"
                    +"<div class='td_dico is_enable'>"+isEnable+"</div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"      
                    +"<div class='td_dico is_led'>"+isLED+"</div>"
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico can_info' title='CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val+"'><img src='../images/search.png' ></div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
        
                $(".dictionary_type_listing.bouton-type .content_new_dico").append(newEntry);
                
                
                $(".bt_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".bt_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLine(id, type); 
                });
                
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
            });
        }
        
        function createNewJoystick(){
            var formJoyCtn = $(".dico_main_container .formulaire_create_joystick");
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formJoyCtn.fadeIn("200");
            
            formJoyCtn.find(".create_button").off();
            formJoyCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
    
            formJoyCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayJoy = {
                    type_array:"joy",
                    symbol_name:formJoyCtn.find(".symbol_name").val(),
                    standard_name: formJoyCtn.find(".standard_name").val(), 
                    description:formJoyCtn.find(".description").val(),
                    is_cdrh:formJoyCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formJoyCtn.find(".is_final option:selected").val(),
                    timer:formJoyCtn.find(".timer").val(),
                    photo_link:formJoyCtn.find(".photo_link").val(),
                    can_id:formJoyCtn.find(".can_id").val(),
                    x_pos:formJoyCtn.find(".x_pos").val(),
                    y_pos:formJoyCtn.find(".y_pos").val(),
                    threshold_max_axis:formJoyCtn.find(".threshold_max_axis").val(), 
                    threshold_max_zero:formJoyCtn.find(".threshold_max_zero").val(),
                    threshold_min_axis:formJoyCtn.find(".threshold_min_axis").val(),
                    threshold_min_zero:formJoyCtn.find(".threshold_min_zero").val(),
                    calib_subindex_x:formJoyCtn.find(".calib_subindex_x").val(),
                    calib_subindex_y:formJoyCtn.find(".calib_subindex_y").val()
                }
                               
                if(newLineArrayJoy.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayJoy.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".dictionary_type_listing.joystick-type .line_new_dico").length)+1;;
                
                       
                var newEntry = "<div class='line_new_dico joy_"+count+" created_state' data-index='joy_"+count+"' data-calibsubindexx='"+newLineArrayJoy.calib_subindex_x+"' data-calibsubindexy='"+newLineArrayJoy.calib_subindex_y+"' data-canid='"+newLineArrayJoy.can_id+"' data-description='"+newLineArrayJoy.description+"' data-dimsignal='' data-familyid='' data-flashsignal='' data-id='' data-iscdrh='"+newLineArrayJoy.is_cdrh+"' data-isenable='0' data-isfinal='"+newLineArrayJoy.is_final+"' data-isled='0' data-issafety='0' data-offsignal='' data-onsignal='' data-photolink='"+newLineArrayJoy.photo_link+"' data-pressedval='' data-releasedval='' data-standardname='"+newLineArrayJoy.standard_name+"' data-symbolname='"+newLineArrayJoy.symbol_name+"' data-thresholdmaxaxis='"+newLineArrayJoy.threshold_max_axis+"' data-threshold_max_zero='"+newLineArrayJoy.threshold_max_zero+"' data-thresholdminaxis='"+newLineArrayJoy.threshold_min_axis+"' data-thresholdminzero='"+newLineArrayJoy.threshold_min_zero+"' data-timer='"+newLineArrayJoy.timer+"' data-type='"+newLineArrayJoy.type+"' data-value='' data-xpos='"+newLineArrayJoy.x_pos+"' data-ypos='"+newLineArrayJoy.y_pos+"' data-zone='50'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayJoy.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayJoy.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayJoy.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayJoy.photo_link+"'></div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
        
                $(".dictionary_type_listing.joystick-type .content_new_dico").append(newEntry);
                
                
                $(".joy_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".joy_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLine(id, type); 
                });
                
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formJoyCtn.fadeOut("200");
                
            });
        }
        
    }

});

