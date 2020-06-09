//jQuery(function ($) {
 jQuery( document ).ready(function($) {
    var sel_facture_image_id=0;
    var size_ratio = $('#aspectRatio').val();
//    var size_ratio = 1.5473887814313;
//    size_ratio = size_ratio;
//    $('#aspectRatio').val(size_ratio);

	if( $('#for-crop').height() > 400) {
		$('#for-crop').height(400);
		}

    $('#widthOn').val( ($('#heightOn').val()*size_ratio).toFixed(0) );
    var root_width = $('#w').val();
    var root_height = $('#h').val()
    var jcrop_api;
    $('.dg-sel-fac').hide();
	$(window).load(function(){
        startCrop(size_ratio);
        sizeOnS();
		});
/*    if( $('div').is('#dg-content')) {
		$('#for-crop').load(function(){
        startCrop(size_ratio);
        sizeOnS();
		});
    }*/
    var reflect = 0;
    var appgrey = 0;

    function startCrop(noAS){
        jcrop_api = $.Jcrop('#for-crop');
		console.log('x1='+$('#x1').val());
		console.log('x2='+$('#x2').val());
		console.log('root_width='+root_width);
		console.log('root_height='+root_height);
        jcrop_api.setOptions({setSelect:   [ $('#x1').val(), $('#y1').val(), root_width, root_height ]});

        jcrop_api.setOptions({
            onChange: showCoords,
            onSelect: showCoords,
            bgColor:     'black',
            bgOpacity:   .4,
//            minSize: [ root_width/100*20, root_height/100*20 ],
            allowSelect:false,
	aspectRatio: noAS
        });

    }
    $('#SOR').change(function(e) {
        var AS = '';
        AS=$('#aspectRatio').val();
        jcrop_api.setOptions(this.checked? { aspectRatio: AS }: { aspectRatio: 0 });
        $('#heightOn').val( ($('#widthOn').val() / AS).toFixed(0) );

    });
    function showCoords(c){
//        return;
        x1 = c.x;  $('#x1').val(c.x);
        y1 = c.y;  $('#y1').val(c.y);
        x2 = c.x2;  $('#x2').val(c.x2);
        y2 = c.y2;  $('#y2').val(c.y2);
        $('#w').val(c.w);
        $('#h').val(c.h);
        if(c.w > 0  && c.h > 0){
            $('#crop').show();
        }else{
            $('#crop').hide();
        }

        var rx = c.w;
        var ry = c.h;

        var hh = $('#heightOn').val();
        if(hh<300) { var hhz = hh/ry;} else {var hhz = 300/ry;}
        var zoomer = hhz*(380/300) ;

        $('#croped-conteiner').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});
        $('#croped-facture').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});
        $('#croped-img img').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});
        var hAw = c.w/c.h;
        if($("#SOR").prop("checked")==false &&
            ( $(".jcrop-tracker:nth-child(2)").css('cursor') == "e-resize"
                || $(".jcrop-tracker:nth-child(2)").css('cursor') == "se-resize"
                || $(".jcrop-tracker:nth-child(2)").css('cursor') == "s-resize"
                || $(".jcrop-tracker:nth-child(2)").css('cursor') == "sw-resize"
                || $(".jcrop-tracker:nth-child(2)").css('cursor') == "w-resize"
                || $(".jcrop-tracker:nth-child(2)").css('cursor') == "nw-resize"
                || $(".jcrop-tracker:nth-child(2)").css('cursor') == "n-resize"
                || $(".jcrop-tracker:nth-child(2)").css('cursor') == "ne-resize"
            )
        ) {
            //var nmz = parseInt($('#widthOn').val() / hAw);
            //$('#heightOn').val(nmz);
            var nmz = ($('#heightOn').val() * hAw).toFixed(0);
            $('#widthOn').val(nmz);
            aspectRatioOnChange();
            sizeOnS();
            SquareS();
            $('#crop-img-src').val($('#dg-crop-img img').attr("src"));
        }
    }
/*    var size_ratio = 1.5473887814313;
    size_ratio = size_ratio;*/

    $( "#widthOn" ).keyup(function() {
        var cheked = $("#SOR").prop("checked");
        if(cheked==true) {
            $('#heightOn').val( parseInt(parseInt($('#widthOn').val()) / $('#aspectRatio').val() ) );
            $('.widthOnS').html($('#widthOn').val());
            $('.heightOnS').html($('#heightOn').val());
            SquareS();
            sizeOnS();

            var rx = $('#w').val();
            var ry = $('#h').val();

            var hh = $('#heightOn').val();
            if(hh<300) { var hhz = hh/ry;} else {var hhz = 300/ry;}
            var zoomer = hhz*(380/300) ;

            $('#croped-conteiner').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});
            $('#croped-facture').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});
            $('#croped-img img').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});

        }
        else {
            aspectRatioOnChange();
            jcrop_api.destroy();
            startCrop();
            jcrop_api.setOptions({ aspectRatio: $('#aspectRatio').val()});
            aspectRatioOnChange();
            jcrop_api.setOptions({ aspectRatio: 0});
            sizeOnS();

        }
    });

    $( "#heightOn" ).keyup(function() {

        var cheked = $("#SOR").prop("checked");
        if(cheked==true) {
            $('#widthOn').val( parseInt($('#heightOn').val() * $('#aspectRatio').val())  );
            $('.widthOnS').html($('#widthOn').val());
            $('.heightOnS').html($('#heightOn').val());
            SquareS();
            sizeOnS();

            var rx = $('#w').val();
            var ry = $('#h').val();

            var hh = $('#heightOn').val();
            if(hh<300) { var hhz = hh/ry;} else {var hhz = 300/ry;}
            var zoomer = hhz*(380/300) ;

            $('#croped-conteiner').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});
            $('#croped-facture').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});
            $('#croped-img img').css({ width: Math.round(rx*zoomer) + 'px', height: Math.round(ry*zoomer) + 'px'});

        }
        else {

            aspectRatioOnChange();
            jcrop_api.destroy();
            startCrop();
            jcrop_api.setOptions({ aspectRatio: $('#aspectRatio').val()});
            aspectRatioOnChange();
            jcrop_api.setOptions({ aspectRatio: 0});
            sizeOnS();

        }

    });
    function aspectRatioOnChange() {
        $('#aspectRatio').val( parseInt($('#widthOn').val()) / parseInt($('#heightOn').val()));
        ;
    }

    function sizeOnS() {
        $('.dg-width-value').html($('#widthOn').val());
        $('.dg-height-value').html($('#heightOn').val());
        priceOnS();

    }

    function priceOnS() {
        SquareS();
        var price =$('#PRICEM2').val();

        var priceSum = price * $('#SQUARE').val();
        priceSum = parseFloat(priceSum).toFixed(2);

        $('.dg-summe-value').html(priceSum+' руб.');
        $('#PRICE').val(priceSum);
    }

    function SquareS() {
        var sQ = parseFloat((parseInt($('#widthOn').val())/100) * (parseInt($('#heightOn').val())/100));
        var sQ2 = parseFloat((parseInt($('#widthOn').val())/100) * (parseInt($('#heightOn').val())/100)).toFixed(2);
        var sQ_three = ( ($('#widthOn').val()/100) * ($('#heightOn').val()/100) );
        var sQ_three_3 = Math.round((sQ_three*1000))/1000;
        if (sQ_three_3 < 1 ) { sQ_three_3 = 1;}
        $('#SQUARE').val( sQ_three_3 );
        $('.dg-square-value').html( sQ_three_3 );
    }

    $('#dg-sel-step2').click(function(){
        addFacture();
        $('.dg-sel-fac').show();
    })

    $('#get-crop').click(function(){
        addFacture();
        $('.dg-sel-fac').show();
    })

    $('#get-order').click(function(){
        $('#dg-step2-cont').hide();
        $('#dg-steps').hide();
        $('.dg-sel-fac').hide();
        $('#crop-img-src').val($('#dg-crop-img img').attr("src"));
        $('#dg-order').show();
    })

    function addFacture() {
        $('#dg-step1-cont').slideUp( "slow", function() { });
        $('#dg-step2-cont').slideDown( "slow", function() { });
        var upload_dir = "/temp/crp/2016/02/";
        var mtrand=161881;
        $.post(dgorder.ajaxurl + '?action=dgcropimg',{
            'MTRAND': mtrand,
            'idimage':$('#idimage').val(),
            'x1':$('#x1').val(),
            'x2':$('#x2').val(),
            'y1':$('#y1').val(),
            'y2':$('#y2').val(),
            'w':$('#w').val(),
            'h':$('#h').val()},
            function(data){
                $('#dg-crop-img img').attr("src",data.image_url);
                $('#dg-crop-facture').css('background','url("/wp-content/uploads/2016/02/treshinizoloto.png")').css('width',$('#w').val()).css('height',$('#h').val());
        },'json');

/*        $.ajax({
            url: dgorder.ajaxurl,
            type: "POST",
            dataType: "html",
            data: "MTRAND="+ mtrand +"&&upload_dir="+ upload_dir +"&&NAME="+ $('#NAME').val()+"&&SIZEX="+$('#widthOn').val()+"&&SIZEY="+$('#heightOn').val()+"&&CORNER="+$('#cornerdiv').html()+"&&REVERS="+$('#reverzdiv').html()+"&&COLOR="+$('#colordiv').html()+"&&FACTURE="+$('#factureOnS').html()+"&&x1="+$('#x1').val()+"&&y1="+$('#y1').val()+"&&x2="+$('#x2').val()+"&&y2="+$('#y2').val()+"&&w="+$('#w').val()+"&&h="+$('#h').val()+"&&maxfoto="+$('#maxfoto').val()+"&&SQUARE="+$('#SQUARE').val()+"&&JART="+$('#jart').html(),
            data: "action=dgcropimg",
            success: function(data){
                $('#croped-img img').attr("src",upload_dir + mtrand + ".jpg");
            }
        });*/
    }
    $('#dg-sel-fac1').click(function() {
        $('#dg-crop-facture').css('background','url("/wp-content/uploads/2016/02/treshinizoloto.png")');
    })
    $('#dg-sel-fac2').click(function() {
        $('#dg-crop-facture').css('background','url("/wp-content/uploads/2016/02/mistral.png")');
    })
    $('#dg-sel-fac3').click(function() {
        $('#dg-crop-facture').css('background','url("/wp-content/uploads/2016/02/keramobrilliant.png")');
    })

    $('.facture-image').click(function(e){
        price = $(this).data('price');
        if(sel_facture_image_id != 0 ) {
/*            $('#'+sel_facture_image_id).removeClass('facture-image-active');
            $('#'+sel_facture_image_id).addClass('facture-image');*/
            $('#facture-'+sel_facture_image_id).removeClass('facture-active');
//            $('#'+sel_facture_image_id).addClass('facture-image');
        }
        sel_facture_image_id = $(this).data('facture-image-id');
  //      $(this).removeClass('facture-image');
//        $(this).addClass('facture-image-active');
        $('#facture-'+sel_facture_image_id).addClass('facture-active');
        $('#FACTURE').val($(this).data('facture-name'));

/*        var priceSum = price * $('#SQUARE').val();
        priceSum = parseFloat(priceSum).toFixed(2);
        $('.dg-summe-value').html(priceSum);
        $('#PRICE').val(priceSum);*/

        $('#PRICEM2').val(price);
        priceOnS();
    })
 $('#btn-order').click(function(e){
	$('#corder').show();
	$('#dg-image').hide();
	//if ($(window).width() <= '995'){
// сперва получаем позицию элемента относительно документа
	var scrollTop = $('#page-content').offset().top-50;
// скроллим страницу на значение равное позиции элемента
	$(document).scrollTop(scrollTop);
	//}
//	$("html, body").animate({scrollTop: $("header").height()+ 100 },"fast");
	});
 $('#dgorder-back').click(function(e){
	$('#corder').hide();
	$('#dg-image').show();
	$('#form-error').hide();
    $('#form-error').html('');
	var scrollTop = $('#page-content').offset().top-50;
// скроллим страницу на значение равное позиции элемента
	$(document).scrollTop(scrollTop);

	});
});


    function sendform() {
        var name = jQuery('#formName').val();
        var email = jQuery('#formEmail').val();
        var phone = jQuery('#formPhone').val();
        var facture = jQuery('#FACTURE').val();
        var mess='';
        if( facture == '' ) {
            mess = mess+'Не выбрана фактура.<br>';
        }
        if( name == '' ) {
            jQuery('#formName').css('border-color','red');
            mess = mess+'Введите ваше имя.<br>';
        }
        if( email == '' ) {
            jQuery('#formEmail').css('border-color','red');
            mess = mess+'Введите ваш Email.<br>';
        }
        if( phone == '' ) {
            jQuery('#formPhone').css('border-color','red');
            mess = mess+'Введите ваш телефон.<br>';
        }
        if( mess != '') {
            jQuery('#form-error').css('display','block');
            jQuery('#form-error').html(mess);
            return;
        }
        jQuery('#form-error').css('display','none');
//        var msg   = jQuery('#dgorder-form').serialize()+ '&widthOn='+jQuery('#widthOn').val()+'&heightOn='+jQuery('#heightOn').val();
        var msg   = jQuery('#dgorder-form').serialize()+ '&widthOn='+jQuery('#widthOn').val()+'&heightOn='+jQuery('#heightOn').val()+'&height='+jQuery('#for-crop').height();

        jQuery.ajax({
            type: 'POST',
            url: "/wp-admin/admin-ajax.php",
            data: msg,
            success: function(data) {
//                jQuery('#form-message').html(data);
                jQuery('#form-message').css('display','block');
            },
            error:  function(xhr, str){
                alert('Возникла ошибка: ' + xhr.responseCode);
            }
        });
    }

