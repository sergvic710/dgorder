<?php

/**
 * Created by PhpStorm.
 * User: seryak
 * Date: 16.02.2016
 * Time: 16:16
 */
class dgOrder_Setting
{
    private $options;

    public function __construct()
    {
        add_action('admin_menu', array(&$this, 'dg_plugin_page'));
    }

    public function dgPluginPage()
    {
        $dgOrder_settings = get_option('dgOrder_settings');
        $dgOrder_settings = maybe_unserialize($dgOrder_settings);
        if (isset($_POST['save']) && check_admin_referer('dg-form')) {
            if (isset($_POST['admin_email']) && $_POST['admin_email'] != '') {
                $dgOrder_settings['admin_email'] = $_POST['admin_email'];
            } else {
                $dgOrder_settings['admin_email'] = '';
            }
            if (isset($_POST['pricem2']) && $_POST['pricem2'] != '') {
                $dgOrder_settings['pricem2'] = $_POST['pricem2'];
            } else {
                $dgOrder_settings['pricem2'] = 0;
            }
            $saved_values = maybe_serialize($dgOrder_settings);
            update_option('dgOrder_settings', $saved_values);
            echo '<div class="updated fade">
            <p><strong>Настройки обновлены</strong></p>
            </div>';

        }
        echo '<div class="wrap">';
        echo '<h2>Настройка</h2>';
        echo '<form id="dg-form-options" name="dg-form" method="post" action="">';
        echo '<div class="table" id="dg-options">';
        echo '<table class="form-table">';
        echo '<tbody>';
        echo '<tr><th>Email для заказов</th>
    <td>
    <input type="text" size="20" name="admin_email" value="' . $dgOrder_settings['admin_email'] . '" />
    </td></tr>';
/*        echo '<tr><th>Цена за кв.м.</th>
    <td>
    <input type="text" size="5" name="pricem2" value="' . $dgOrder_settings['pricem2'] . '" /> руб.
    </td></tr>';*/
        echo '</tbody>';
        echo '<p><input name="save" type="submit" class="button-primary" value="Сохранить" /></p>';
        wp_nonce_field('dg-form');
        echo '</form>';
        echo '</div>';
    }

    public function dgFactursPage()
    {
        global $wpdb, $plugin_errors;
        $setting_url = admin_url('admin.php') . '?page=dgorder-facturs';
        $table_name = $wpdb->prefix . "dgfactures";

        wp_register_script('admin-script', plugins_url('js/admin.js', __FILE__), array('jquery'), BW, true);
        wp_enqueue_script('admin-script');
        wp_register_style('dg-styles', plugins_url('/css/dgorder.css', __FILE__));
        wp_enqueue_style('dg-styles');

        wp_enqueue_media();

        echo '<div class="wrap">
                    <h2><div id="icon-options-general" class="icon32"></div>' . 'Список текстур' .
            '<a href="#facture_name" class="add-new-h2">' . 'Новая текстура' . '</a>' .
            '</h2>';

        if (isset($_POST['dgorder_add_new'])) {
            if (!isset($_POST['dgorder_facture_name']) || empty($_POST['dgorder_facture_name']) || !isset($_POST['dgorder_facture_price']) || empty($_POST['dgorder_facture_price'])) {
                ?>
                <div id="message" class="error"><p>Пожалуйста заполните все поля.</p></div><?php
            } else {
                //add the new entry
                $insert_query = "INSERT INTO $table_name (name, price, image) VALUES (%s, %s, %s);";
                $query = $wpdb->prepare($insert_query, $_POST['dgorder_facture_name'], $_POST['dgorder_facture_price'], $_POST['facture_image']);
                if ($wpdb->query($query) == 1) {
                    ?>
                    <div id="message" class="updated"><p>Новая фактура добавлена</p></div><?php
                } else {
                    ?>
                    <div id="message" class="error"><p>Ошибка добавления</p></div><?php
                }
            }
        }
        if (isset($_GET['action']) && !isset($_POST['dgorder_add_new'])) {
            if (!isset($_GET['id']) || empty($_GET['id'])) {
                //id is not set, some error must have occurred
                ?>
                <div id="message" class="error"><p><?php _e('There was an error!', 'birthdays-widget'); ?></p>
                </div><?php
            } elseif ($_GET['action'] == "delete") {
                //delete the record
                $delete_query = "DELETE FROM $table_name WHERE id = '%d' LIMIT 1;";
                if ($wpdb->query($wpdb->prepare($delete_query, $_GET['id'])) == 1)
                    echo '<div id="message" class="updated"><p> Запись удалена.</p></div>';
                else
                    echo '<div id="message" class="error"><p>Ошибка удаления.</p></div>';
            } elseif ($_GET['action'] == "edit") {
                if (isset($_GET['do']) && $_GET['do'] == "save" && isset($_POST['dgorder_edit'])) {
                    if (!isset($_POST['dgorder_facture_name']) || empty($_POST['dgorder_facture_name']) || !isset($_POST['dgorder_facture_price']) || empty($_POST['dgorder_facture_price'])) {
                        ?>
                        <div id="message" class="error"><p>Пожалуйста заполните все поля.</p></div><?php
                    } else {
                        $update_query = "UPDATE $table_name SET name = '%s', price = '%s', image = '%s' WHERE id = '%d' LIMIT 1;";
                        $query = $wpdb->prepare( $update_query, $_POST[ 'dgorder_facture_name' ],$_POST[ 'dgorder_facture_price' ], $_POST[ 'facture_image' ], $_GET[ 'id' ] );
                        if ( $wpdb->query( $query ) == 1 ) {
                            echo '<div id="message" class="updated"><p>Запись обновлена</p></div>';
                        }
                    }
                } else {
                    //get record to edit
                    $select_query = "SELECT * FROM $table_name WHERE id = '%d' LIMIT 1;";
                    $result_edit = $wpdb->get_row($wpdb->prepare($select_query, $_GET['id']));
                    $dgorder_edit = true;
                }
            }
        }


        ?>
        <div id="factures_list">
            <table class="widefat dataTable display" id="factures_table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Названия</th>
                    <th>Цена</th>
                    <th>Фактура</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                <?
                $query = "SELECT * FROM $table_name;";
                $results = $wpdb->get_results($query);
                $flag_row = true;

                foreach ($results as $row) {
                    $row->image = wp_get_attachment_image_src($row->image, 'medium');
                    $row->image = $row->image[0];
                    $image_name = explode('/', $row->image);
                    $image_name = $image_name[count($image_name) - 1];
                    echo '<tr><td>' . $row->id;
                    echo '</td>
                                    <td class="facture_name">' . $row->name . '</td>
                                    <td>' . $row->price . '</td>
                                    <td';
                    if ($row->image) {
                        echo ' class="list-image birthday_name"><img class="dgorder_admin_edit_image" src="' . $row->image . '"/>';
                    }
                    echo '</td><td>';
                    $edit_link = '<a href="' . $setting_url . '&action=edit&id=' . $row->id . '">Редактировать</a>';
                    $delete_link = '<a class="delete_link" href="' . $setting_url . '&action=delete&id=' . $row->id . '">Удалить</a>';
                    echo $edit_link . ' | ' . $delete_link;
                    echo '</td></tr>';
                    if ($flag_row)
                        $flag_row = false;
                    else
                        $flag_row = true;

                }
                ?>
                </tbody>
            </table>

            <table class="widefat">
                <thead>
                <tr>
                    <th></th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Фактура</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                <tr><?
                    $flag = isset($dgorder_edit);
                    if ($flag) {
                        echo '<form method="POST" action="' . $setting_url . '&action=edit&id=' . $_GET['id'] . '&do=save">
                                  <td>Редактирование</td>
                                  <input type="hidden" name="dgorder_edit" value="1" />';
                        $name_input = '<input type="text" name="dgorder_facture_name" id="facture_name" value="' . $result_edit->name . '" />';
                        $price_input = '<input type="text" name="dgorder_facture_price" id="facture_price" value="' . $result_edit->price . '" />';

                        $image = $result_edit->image;
                        $result_edit->image = wp_get_attachment_image_src($result_edit->image, 'medium');
                        $result_edit->image = $result_edit->image[0];

                        $image_input = '<img id="dgorder_facture_image_preview" class="dgorder_admin_edit_image" src="' . $result_edit->image . '" alt="Фактура" />' .
                            '<input name="image" type="button" class="button-primary upload_image_button" value="+" data-url-input="dgorder_facture_image" >' .
                            '<input type="hidden" id="dgorder_facture_image" name="facture_image" class="upload_image_button bw-image" value="'.$image.'" />';
                    } else {
                        echo '<form method="POST" action="' . $setting_url . '">
                                  <td>Новая фактура</td>
                                  <input type="hidden" name="dgorder_add_new" value="1" />';

                        $name_input = '<input type="text" name="dgorder_facture_name" id="facture_name" value="" />';
                        $price_input = '<input type="text" name="dgorder_facture_price" id="facture_price" value="" />';
                        $image_input = '<img id="dgorder_facture_image_preview" class="dgorder_admin_edit_image" src="" alt="Фактура" />' .
                            '<input name="image" type="button" class="button-primary upload_image_button" value="+" data-url-input="dgorder_facture_image" >' .
                            '<input type="hidden" id="dgorder_facture_image" name="facture_image" class="upload_image_button bw-image" value="" />';
                    }


                    ?>
                    <td>
                        <?php echo $name_input; ?>
                    </td>
                    <td>
                        <?php echo $price_input; ?>
                    </td>
                    <td>
                        <?php echo $image_input; ?>
                    </td>
                    <td>
                        <input name="save" type="submit" class="button-primary" value="Записать"/>
                        <?php wp_nonce_field('dgorder_add_form'); ?>
                    </td>

                </tr>
                </tbody>
            </table>
        </div>

        <?


    }
    public function dg_plugin_page()
    {
        add_menu_page('Настройки', 'Заказ картинок', 'read', 'dgorder', array(&$this, 'dgPluginPage'));
        add_submenu_page('dgorder', 'Список текстру', 'Список текстур', 'read', 'dgorder-facturs', array(&$this, 'dgFactursPage'));
    }
}