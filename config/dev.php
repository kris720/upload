<?php

return array(
    //数据库配置信息
	'db' => array(
        'driver' => 'mysql',
        'host' => 'localhost',
        'username'=>'root',
        'password'=>'',
        'database'=>'plume',
        'port' => '3306',
        'charset'=>'utf8'
	),
    'redis' => array(
        'host' => '120.25.90.135',
        'port' => '16379'
    ),
    'redis_slave' => array(
        'host' => '120.25.90.135',
        'port' => '16379'
    ),
    'log' => array(
        'project_name' => 'plume-demo-web',
        'server' => array('127.0.0.1' => 4730)
    ),

    'fileType'=>array(
        'jpeg', 'jpg', 'png', 'gif',
        'mp3',
        'mp4', 'avi','flv','mkv',
        'doc','xls','ppt','pdf'
    )


);