<?php
/*
Plugin Name: designecoprint order
Description: Crop picture and order
Version: 0.1
Author: Iakovlev Sergei
Author URI:
License: GPL2
*/

define('BW', '0.1');
require_once dirname(__FILE__) . '/dgOrder_Install.php';
require_once dirname(__FILE__) . '/dgOrder_Setting.php';

if (is_admin())
    $my_settings_page = new dgOrder_Setting();

register_activation_hook(__FILE__, array('dgOrder_Install', 'activate'));
register_deactivation_hook(__FILE__, array('dgOrder_Install', 'deactivate'));


add_action('wp_enqueue_scripts', 'dg_scripts');
function dg_scripts()
{
    $localVars = array(
        'ajaxurl' => admin_url('admin-ajax.php'),
    );
    wp_enqueue_script('jquery-jcrop', '/wp-content/plugins/dgorder/js/jquery.Jcrop.js', array());
    wp_enqueue_script('dg-order', '/wp-content/plugins/dgorder/js/dg-order~~.js', array());
    wp_localize_script('dg-order', 'dgorder', $localVars);
}

add_action('wp_enqueue_scripts', 'dg_styles');
function dg_styles()
{
    wp_register_style('dg-jcrop-styles', plugins_url('/css/jquery.Jcrop.css', __FILE__));
    wp_enqueue_style('dg-jcrop-styles');
    wp_register_style('dg-styles', plugins_url('/css/dgorder.css', __FILE__));
    wp_enqueue_style('dg-styles');
}

add_action('wp_ajax_dgcropimg', 'dgCropImage');
add_action('wp_ajax_nopriv_dgcropimg', 'dgCropImage');

add_action('wp_ajax_dgsendorder', 'dgSendOrder');
add_action('wp_ajax_nopriv_dgsendorder', 'dgSendOrder');

function dgSendOrder()
{
    global $wpdb;
    $subject = 'Поступил заказ';
    $message = "Имя картинки :" . $_POST['image'] . "\n";
    $message .= "Фактура : " . $_POST['facture'] . "\n";
    $message .= "Ширина : " . $_POST['widthOn'] . " см\n";
    $message .= "Высота : " . $_POST['heightOn'] . " см\n";
    $message .= "Площадь : " . $_POST['square'] . " кв.м.\n";
    $message .= "Цена : " . $_POST['price'] . "руб.\n";
    $message .= "Имя : " . $_POST['Name'] . "\n";
    $message .= "Телефон : " . $_POST['Phone'] . "\n";
    $message .= "Email : " . $_POST['Email'] . "\n\n";
	if( isset($_POST['Note']) && $_POST['Note'] != '' ) {
		$message .= "Комментарий к заказу :\n".$_POST['Note'];
	}
	

    $file = dgCropImage($_POST['img_id']);

    $dgOrder_settings = get_option('dgOrder_settings');
    $dgOrder_settings = maybe_unserialize($dgOrder_settings);

    wp_mail($dgOrder_settings['admin_email'], $subject, $message, $headers, $file);
//    wp_mail('sergvic@yandex.ru', $subject, $message, $headers, $file);
}


add_shortcode('dgorder', 'dgOrder');
function dgOrder()
{
    global $wpdb;

    if (isset($_GET['id']) && $_GET['id'] != 0) {
        $img_id = $_GET['id'];
        $img = wp_get_attachment_image_src($img_id, 'full');
        $img_name = get_the_title($_GET['id']);
        $aspect_ratio = $img[1] / $img[2];
        $dgOrder_settings = get_option('dgOrder_settings');
        $dgOrder_settings = maybe_unserialize($dgOrder_settings);
    } else {
        $html = '<div class="dg-content"><h1>Картинка не найдена</h1></div>';
        return $html;
    } ?>

    <div id="dg-content">
        <a href="#" onClick="history.back();">Назад к каталогу</a>

        <div id="dg-image" class="row order-content">
            <div class="col-sm-12 col-md-8">
                        <h3>Введите ваши резмеры (см)</h3>

                <div class="row" id="dg-options">
                    <div class="col-sm-1 col-xs-6 text-center" style="min-width: 61px;">
                        <div class="dg-b-input" style="float:left; margin-right: 40px;"><label>Ширина:</label>
                            <br><input type="text" value="" id="widthOn">
                        </div>
                    </div>
                    <div class="col-sm-1 hidden-xs text-center nopad">
						<span><br>X</span>
					</div>

                    <div class="col-sm-1 col-xs-6 text-center" style="min-width: 61px;">
                        <div class="dg-b-input" style="float:left;"><label>Высота:</label>
                            <br><input type="text" value="200" id="heightOn">
                        </div>
                        <input type="hidden" value="<?= sprintf('%F', $aspect_ratio) ?>" id="aspectRatio">
                        <input type="hidden" value="<?= $_GET['id'] ?>" id="idimage">
                    </div>
                    <div class="col-sm-3 col-xs-6 text-center">
                        <div>
                            <span class="dg-square-name">Площадь:</span>
                            <br><span class="dg-square-value"></span> м. <sup>2</sup>
                        </div>
                    </div>
                    <div class="col-sm-4 col-xs-6 text-center">
                        <div>
                            <span class="dg-summe-name">Цена заказа:</span>
                            <br><span class="dg-summe-value"></span>
                        </div>
                    </div>

                </div>

                <!--<div class="row">
                    <div class="col-sm-12">
                        <div class="dg-aspect-Ratio-box text-left">
                            <input type="checkbox" id="SOR"><label for="SOR">&nbsp;&nbsp;Сохранять пропорции</label>
                        </div>
                    </div>
                </div>-->
                <div class="row">
                    <div class="col-sm-12">
                        <div class="m-t-15">
                            <!--<div class="dg-move-polz">Выберите нужный фрагмент изображения.</div>-->
                            <div class="dg-crop-b-cont">
                                <div class="dg-crop-step1">
<!--                                    <img id="for-crop" alt="" src="<?= $img[0] ?>" style="height: 400px;">-->
                                    <img id="for-crop" alt="" src="<?= $img[0] ?>">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-4">
                <div class="text-left factura-head">Выберите фактуру и калькулятор посчитает стоимость вашего заказа</div>
                <div id="list-factures"><div class="container-fluid">
                    <?
                    $query = "SELECT * FROM " . $wpdb->prefix . "dgfactures";
                    $results = $wpdb->get_results($query);
                    $columns = 4;
                    $column = 1;

                    echo '<div class="row">';
                    foreach ($results as $row) {
                        $image_id = $row->image;
                        $row->image = wp_get_attachment_image_src($row->image, 'thumbnail');
                        $row->image = $row->image[0];
                        $image_name = explode('/', $row->image);
                        $image_name = $image_name[count($image_name) - 1];
                        if ($row->image) {
                            if ($column > 3) {
								echo '<div class="clearfix"></div>';
                                echo '</div>';
                                $column = 1;
                                echo '<div class="row">';
                            }
                            $column++; ?>
                            <div class="col-sm-4 normal-column">
                                <div class="facture text-center" id="facture-<?= $image_id ?>">
                                    <div style="display:none;">
                                        <input type="radio" data-price="<?= $row->price ?>" name="facture"
                                               data-name="<?= $row->name ?>" data-img-id="<?= $image_id ?>">
                                    </div>
                                    <div class="facture-name text-center">
                                        <!--                                    <label for="facture"><?= $row->name ?></label>-->
                                        <?= $row->name ?>
                                    </div>
                                    <div class="text-center">
                                        <img class="facture-image" id="<?= $image_id ?>" data-price="<?= $row->price ?>"
                                             data-facture-image-id="<?= $image_id ?>"
                                             data-facture-name="<?= $row->name ?>"
                                             src="<?= $row->image ?>"/>
                                             <!--ДЛЯ ВЫВОДА ЦЕНЫ-->
                                             <!-- <p><?= $row->price ?></p> -->

                                    </div>
                                </div>
                            </div>
                            <?
                        }
                    }
                    echo '</div>';
                    ?>
                </div>
				</div>
            </div>
                <div class="row">
                    <div class="col-sm-3 text-center">
                        <a class="button custom-btn-color" id="btn-order" href="#content">Оформить заказ</a>
<!--                        <a class="dgorder-form-control dgorder-submit" id="btn-order" href="#">Оформить заказ</a>-->
<!--						<input type="submit" id="btn-order" class="dgorder-form-control dgorder-submit" value="Оформить заказ">-->
					</div>
				</div>
        </div>
    <div class="row">
        <div class="col-sm-12" id="corder" style="display: none">
            <div role="form" class="dgorder" lang="ru-RU" dir="ltr">
                <div id="form-error"></div>
                <div id="form-message" class="text-center" style="display: none;">Спасибо, ваш заказ отправлен!</div>
                <form method="post" class="dgorder-form" novalidate="novalidate" id="dgorder-form"
                      action="javascript:void(null);" onsubmit="sendform()">
                    <div style="display: none;">
                        <input type="hidden" id="x1" name="x1" value="0">
                        <input type="hidden" id="y1" name="y1" value="0">
                        <input type="hidden" id="x2" name="x2" value="<?= $img[1] ?>">
                        <input type="hidden" id="y2" name="y2" value="<?= $img[2] ?>">
                        <input type="hidden" id="w" name="w" value="<?= $img[1] ?>">
                        <!-- <input type="hidden" id="w" name="w" value="<?= $img[1] ?>"> -->
                        <input type="hidden" id="h" name="h" value="<?= $img[2] ?>">
                        <input type="hidden" id="IMAGE" name="image" value="<?= $img_name ?>">
                        <input type="hidden" id="IMAGEID" name="image_id" value="<?= $img_id ?>">
                        <input type="hidden" id="SQUARE" name="square" value="">
                        <input type="hidden" id="PRICE" name="price" value="">
                        <input type="hidden" id="PRICEM2" name="pricem2" value="<?= $dgOrder_settings['pricem2'] ?>">
                        <input type="hidden" id="FACTURE" name="facture" value="">
                        <input type="hidden" name="action" value="dgsendorder">
                    </div>
                    <p>Ваше имя (обязательно)<br>
                        <span class="dgorder-form-control-wrap"><input type="text" id="formName" name="Name" value=""
                                                                       class="dgorder-form-control dgorder-text "
                                                                       aria-required="true" aria-invalid="false"></span>
                    </p>

                    <p>Ваш e-mail (обязательно)<br>
                        <span class="dgorder-form-control-wrapl"><input type="email" id="formEmail" name="Email"
                                                                        value="" 
                                                                        class="dgorder-form-control dgorder-text "
                                                                        aria-required="true"
                                                                        aria-invalid="false"></span></p>

                    <p>Ваш номер телефона (обязательно)<br>
                        <span class="dgorder-form-control-wrap"><input type="text" id="formPhone" name="Phone" value=""
                                                                       class="dgorder-form-control dgorder-text "
                                                                       aria-required="true" aria-invalid="false"></span>
                    </p>

                    <p>Комментарий к заказу<br>
                        <span class="dgorder-form-control-wrap"><textarea name="Note" rows="5"
                                                                          class="dgorder-form-control dgorder-textarea"
                                                                          aria-invalid="false"></textarea></span>
				</p>

                    <p><input type="submit" class="dgorder-form-control dgorder-submit" value="Отправить заказ"></p>
<!--				<p><input type="button" id="dgorder-back" class="dgorder-form-control dgorder-back" value="Обратно к выбору размеров и фактуры"></p>-->
<!--				<p><button id="dgorder-back" class="dgorder-form-control dgorder-back" >Обратно к выбору размеров и фактуры</button></p>-->
				<p><a href="#content" id="dgorder-back" class="dgorder-form-control dgorder-back" >Обратно к выбору размеров и фактуры</a></p>
                </form>
            </div>
            <!--<a href="/shop/" >Назад к каталогу</a>-->
        </div>
    </div>
    </div>


    <!--            <form method="post">

                    <label>Ваше имя: <input type="text" name="Name"></label><br>
                    <label>Ваш телефон: <input type="text" name="Phone"></label><br>
                    <label>Ваш email: <input type="text" name="Email"></label><br>
                    Комментарий к заказу:<br>
                    <textarea cols="50" rows="5" name="Note" placeholder="Комментарий к заказу"></textarea><br>
                    <input type="submit" name="dg-submit-order" value="Сделать заказ">
                </form>
            </div>
            </div>

    </div> -->
    <div id="dg-step2-cont">
        <div id="dg-crop-cont">
            <!--                <div id="dg-crop-facture" style="background: url('/wp-content/uploads/2016/02/treshinizoloto.png');">-->
            <div id="dg-crop-facture">
            </div>
            <div id="dg-crop-img">
                <img src="">
            </div>

        </div>
        <div id="dg-info">
            <div class="dg-info-col1">
                <div>
                    <span class="dg-width-name">Ширина:</span>
                    <span class="dg-width-value"></span> см.
                </div>
                <div>
                    <span class="dg-height-name">Высота:</span>
                    <span class="dg-height-value"></span> см.
                </div>
                <div>
                    <span class="dg-square-name">Площать:</span>
                    <span class="dg-square-value"></span> м. <sup>2</sup>
                </div>
            </div>
            <div class="dg-info-col2">
                <div>
                    <span class="dg-priceone-name">Цена за 1 м. <sup>2</sup></span>
                    <span class="dg-priceone-value"><?= $dgOrder_settings['pricem2'] ?></span> руб.
                </div>
                <div>
                    <span class="dg-summe-name">Итого:</span>
                    <span class="dg-summe-value"></span> руб.
                </div>
                <div>
                    <span class="dg-square-name">Площать:</span>
                    <span class="dg-square-value"></span> м. <sup>2</sup>
                </div>
            </div>
        </div>
        <input type="button" id="get-order" value="Оформить заказ">
    </div>

    <!--        <div id="dg-order">
            <h1>Оформление заказа</h1>

            <form method="post">
                <input type="hidden" id="SQUARE" name="square" value="">
                <input type="hidden" id="PRICE" name="price" value="">
                <input type="hidden" id="PRICEM2" name="pricem2" value="<?= $dgOrder_settings['pricem2'] ?>">
                <input type="hidden" id="FACTURE" name="name-facture" value="10">
                <input type="hidden" id="crop-img-src" name="crop-img-src">

                <label>Ваше имя: <input type="text" name="Name"></label><br>
                <label>Ваш телефон: <input type="text" name="Phone"></label><br>
                <label>Ваш email: <input type="text" name="Email"></label><br>
                Комментарий к заказу:<br>
                <textarea cols="50" rows="5" name="Note" placeholder="Комментарий к заказу"></textarea><br>
                <input type="submit" name="dg-submit-order" value="Сделать заказ">
            </form>
        </div>


    </div>-->

    <?php
}

function dgCropImage($imgid)
{
    $aa = 10;
    /*    if (($x_o < 0) || ($y_o < 0) || ($w_o < 0) || ($h_o < 0)) {
            echo "Некорректные входные параметры";
            return false;
        }*/
    $img = wp_get_attachment_image_src($_POST['image_id'], 'full');
	$height = $_POST['height'];
    $aspect_ratio = $img[1] / $img[2];
    $image_w = $img[1];
    $image_h = $img[2];
//    $ratio_h = $img[2] / 400; 
//    $ratio_w = $img[1] / (400 * $aspect_ratio); 
    $ratio_h = $img[2] / $height; //2.0175
    $ratio_w = $img[1] / ($height * $aspect_ratio); //2.017

    $_POST['x1'] = ceil($_POST['x1'] * $ratio_w);
    $_POST['y1'] = ceil($_POST['y1'] * $ratio_h);
    $_POST['w'] = ceil($_POST['w'] * $ratio_w);
    $_POST['h'] = ceil($_POST['h'] * $ratio_h);;
//    $image = get_attached_file($_POST['idimage']);
    $image = get_attached_file($_POST['image_id']);
    // img[1] ширина img[2] высота
    list($w_i, $h_i, $type) = getimagesize($image); // Получаем размеры и тип изображения (число)
    $types = array("", "gif", "jpeg", "png"); // Массив с типами изображений
    $ext = $types[$type]; // Зная "числовой" тип изображения, узнаём название типа
    if ($ext) {
        $func = 'imagecreatefrom' . $ext; // Получаем название функции, соответствующую типу, для создания изображения
        $img_i = $func($image); // Создаём дескриптор для работы с исходным изображением
    } else {
        echo 'Некорректное изображение'; // Выводим ошибку, если формат изображения недопустимый
        return false;
    }
//    if ($x_o + $w_o > $w_i) $w_o = $w_i - $x_o; // Если ширина выходного изображения больше исходного (с учётом x_o), то уменьшаем её
//    if ($y_o + $h_o > $h_i) $h_o = $h_i - $y_o; // Если высота выходного изображения больше исходного (с учётом y_o), то уменьшаем её
    $img_o = imagecreatetruecolor($_POST['w'], $_POST['h']); // Создаём дескриптор для выходного изображения
    imagecopy($img_o, $img_i, 0, 0, $_POST['x1'], $_POST['y1'], $_POST['w'], $_POST['h']); // Переносим часть изображения из исходного в выходное
    $func = 'image' . $ext; // Получаем функция для сохранения результата
    $image_url = plugins_url('/crops/' . MTRAND . '.' . $ext, __FILE__);
    $filename = uniqid();
    $file = plugin_dir_path(__FILE__) . 'crops/' . $filename . '.' . $ext;
    $func($img_o, $file); // Сохраняем изображение в тот же файл, что и исходное, возвращая результат этой операции
//    $ret = array();
//    $ret['image_url'] = plugins_url('/crops/' . $_POST['MTRAND'] . '.jpg', __FILE__);
//    $file = plugin_dir_path(__FILE__) . 'crops/' . $info['basename'];
    return plugin_dir_path(__FILE__) . 'crops/' . $filename . '.' . $ext;
//    echo json_encode($ret);
//    die();
}
