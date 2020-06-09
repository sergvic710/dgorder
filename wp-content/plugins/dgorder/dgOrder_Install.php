<?php


class dgOrder_Install
{
    static function install()
    {
        global $wpdb;
        //add some default options
        $dgOrder_settings = array(
            'admin_email' => '',
            'pricem2' => '0'
        );
        $table_name = $wpdb->prefix . "dgfactures";
        //dbDelta is responsible to alter the table if necessary
        $sql = "CREATE TABLE `$table_name` (
                      id int(11) NOT NULL AUTO_INCREMENT,
                      name varchar(100) NOT NULL,
                      price VARCHAR(10) NOT NULL,
                      image varchar(500) DEFAULT NULL,
                      UNIQUE KEY id (id)
                    ) DEFAULT CHARSET=utf8;";
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );

        //if the plugin was installed, do not lose previous settings
            add_option( 'dgOrder_settings', $dgOrder_settings);
        return;
    }

    static function activate() {
        if ( ! current_user_can ( 'activate_plugins' ) )
            return "You cannot activate it";
        return dgOrder_Install::install();
    }
    static function deactivate() {
        if ( get_option( 'dgOrder_settings' ) ) {
            delete_option('admin_email');
            delete_option('pricem2');
        }
    }

}