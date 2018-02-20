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


});

