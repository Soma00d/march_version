<?php

?>
<!DOCTYPE html>
<html>
    <head>
        <title>Test Bench User Admin</title>
        <link rel="stylesheet" type="text/css" href="../css/application.css">
        <link rel="stylesheet" type="text/css" href="../css/admin.css">
        <script src="../lib/jquery-3.1.1.min.js"></script>
        <script src="../lib/jquery-ui.js"></script>
        
    </head>
    <body>
        <div class="overlay_admin_login">
            <div class="authenticate_admin">
                <div class="title">Administrator Login</div>
                <div class="text_login">Please fill in your user SSO</div>
                <input type="text"  id="username_admin"/>
                <div><button id="sub_bt">Submit</button></div>
            </div>
        </div>        
        
        <div id="main_admin_content" class="hidden">
            <div id="header_admin">
                <?php include('template/header.html'); ?>
            </div>
            <div class="main_admin_menu">
                <ul class="accordion-menu">
                    <li>
                        <div class="dropdownlink"> <img src="../images/admin/man-user.png">Users
                        
                      </div>
                      <ul class="submenuItems">
                        <li><a href="#" class="menu_item all_user_page" data-menulink="user">Show all users</a></li>
                        <li><a href="#" class="menu_item" data-menulink="user">Add a new user</a></li>
                      </ul>
                    </li>
                    <li>
                      <div class="dropdownlink"><img src="../images/admin/3d-dictionary.png"> Dictionaries
                      </div>
                      <ul class="submenuItems">
                        <li><a href="#" class="menu_item show_dictionary_page" data-menulink="show_dictionary">Show all dictionaries</a></li>
                        <li><a href="#" class="menu_item dictionaries_page" data-menulink="dictionaries">Add a new dictionary</a></li>
                      </ul>
                    </li>
                    <li>
                      <div class="dropdownlink"><img src="../images/admin/tsui.png"> TSUI
                      </div>
                      <ul class="submenuItems">
                        <li><a href="#" class="menu_item tsui_page" data-menulink="tsui">Show all TSUI</a></li>
                      </ul>
                    </li>
                    <li>
                      <div class="dropdownlink"><img src="../images/admin/logs.png"> Logs
                      </div>
                      <ul class="submenuItems">
                        <li><a href="#" class="menu_item log_page" data-menulink="log">View all logs</a></li>
                        <li><a href="#">Find log</a></li>
                      </ul>
                    </li>
                    <li>
                      <div class="dropdownlink"><img src="../images/admin/serial.png"> Serial Numbers
                      </div>
                      <ul class="submenuItems">
                        <li><a href="#" class="menu_item serial_page" data-menulink="serial">View all SN</a></li>
                      </ul>
                    </li>
                  </ul>
            </div>
            <div class="main_admin_panels">
                <div id="adm_content_home" class="page_content active">
                    <?php include('template/home.html'); ?>
                </div>
                <div id="adm_content_user" class="page_content">
                    <?php include('template/users.html'); ?>
                </div>
                <div id="adm_content_dictionaries" class="page_content">
                    <?php include('template/dictionaries.html'); ?>
                </div>
                <div id="adm_content_show_dictionary" class="page_content">
                    <?php include('template/show_dictionary.html'); ?>
                </div>
                <div id="adm_content_tsui" class="page_content">
                    <?php include('template/tsui.html'); ?>
                </div>
                <div id="adm_content_log" class="page_content">
                    <?php include('template/log.html'); ?>
                </div>
                <div id="adm_content_serial" class="page_content">
                    <?php include('template/serial.html'); ?>
                </div>
            </div>
        </div>      
        
        
        <script src="../js/admin_function.js"></script>
    </body>
</html>