jQuery(function($) {
    var size_ratio = 1.799648506151142;
    size_ratio = size_ratio;
    $('#aspectRatio').val(size_ratio);
    $('#widthOn').val( ($('#heightOn').val()*size_ratio).toFixed(0) );
    var root_width = 800;
    var root_height = 517;
    var jcrop_api;
    startCrop(size_ratio);
    sizeOnS();
    $(".each-facture").click(function() {
        var name = $(this).attr("name");
        var price = $(this).attr("price");
        var facture = $(this).attr("facture");
        $("#croped-facture").css("backgroundImage", "url(/img/textures/" + facture + ".png)");
        $('#PRICEM2').val(price);
        $(".each-facture").removeClass("cf");
        $(this).addClass("cf");
        $('#factureOnS').html(name);
        priceOnS();
        $('#quaprice').html(price+' руб.');
    });
    var reflect = 0;
    $('#reflection').click(function(){

        var our_img = document.getElementById("croped-img");
        var regexp = /grayscale=1/g;
        if(reflect == 0){
            $(this).addClass("cf");
            if (navigator.appName != "Netscape" && navigator.appName != "Opera") {
                our_img.style.zoom = 1;
                if(regexp.test(our_img.style.filter)){
                    our_img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(mirror=1, grayscale=1);";
                    $('#reverz').val("зеркальная");
                    $('#reverz').html("зеркальная");
                } else {
                    our_img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(mirror=1);";
                    $('#reverz').val("зеркальная");
                    $('#reverzdiv').html("зеркальная");
                }
            } else {
                $('#croped-img').removeClass('flip-revert');
                $('#croped-img').addClass('flip-horizontal');
                $('#reverz').val("зеркальная");
                $('#reverzdiv').html("зеркальная");
            }
            reflect = 1;
            $('#reflect').val("1");
        }else{
            $(this).removeClass("cf");
            if (navigator.appName != "Netscape" && navigator.appName != "Opera") {
                our_img.style.zoom = 1;
                if(regexp.test(our_img.style.filter)){
                    our_img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(mirror=0, grayscale=1);";
                    $('#reverz').val("стандартная");
                    $('#reverz').html("стандартная");
                } else {
                    our_img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(mirror=0);";
                    $('#reverz').val("стандартная");
                    $('#reverzdiv').html("стандартная");
                }
            } else {
                $('#croped-img').removeClass('flip-horizontal');
                $('#croped-img').addClass('flip-revert');
                $('#reverz').val("стандартная");
                $('#reverzdiv').html("стандартная");
            }
            reflect = 0;
            $('#reflect').val("0");
        }
    });
    var appgrey = 0;
    $('#dogray').click(function(){
        $(this).addClass("cf");
        $("#croped-img").addClass("make-black");
        $("#docolor").removeClass("cf");
        $('#color').val("черно-белая");
        $('#colordiv').html("черно-белая");
        $('#appgrey').val("1");
    });
    $('#docolor').click(function(){
        $("#docolor").addClass("cf");
        $("#croped-img").removeClass("make-black");
        $("#dogray").removeClass("cf");
        $('#color').val("цветная");
        $('#colordiv').html("цветная");
        $('#appgrey').val("0");
    });
    $('#get-crop').click(function(){
        StepCrop();
    });
    function StepCrop() {
        $("#app_step1").removeClass("cr-active");
        $("#app_step2").addClass("cr-active");
        $(".b-detail-step1").addClass("cf");
        $( "#step1-conteiner" ).slideUp( "slow", function() { });
        $( "#step2-conteiner" ).slideDown( "slow", function() { });
        var upload_dir = "/temp/crp/2016/02/";
        var mtrand=161881;
        $.ajax({
            url: "/ajax/crop.php",
            type: "POST",
            dataType: "html",
            data: "MTRAND="+ mtrand +"&&upload_dir="+ upload_dir +"&&NAME="+ $('#NAME').val()+"&&SIZEX="+$('#widthOn').val()+"&&SIZEY="+$('#heightOn').val()+"&&CORNER="+$('#cornerdiv').html()+"&&REVERS="+$('#reverzdiv').html()+"&&COLOR="+$('#colordiv').html()+"&&FACTURE="+$('#factureOnS').html()+"&&x1="+$('#x1').val()+"&&y1="+$('#y1').val()+"&&x2="+$('#x2').val()+"&&y2="+$('#y2').val()+"&&w="+$('#w').val()+"&&h="+$('#h').val()+"&&maxfoto="+$('#maxfoto').val()+"&&SQUARE="+$('#SQUARE').val()+"&&JART="+$('#jart').html(),
            success: function(data){
                $('#croped-img img').attr("src",upload_dir + mtrand + ".jpg");
            }
        });
        $( ".finish-buy" ).show();
        Dragle();
    }
    $('#app_step11').click(function(){
        cornerOff();
        $( ".finish-buy" ).hide();
        $('#croped-interior').hide();
        $(".b-detail-step1").removeClass("cf");
        $( "#step1-conteiner" ).slideDown( "slow", function() { });
        $( "#step2-conteiner" ).slideUp( "slow", function() { });
    });
    $('.f-chos').click(function(){
        $('.f-chos').removeClass("factf");
        $(this).addClass("factf");
        if($(this).attr('ID') == "f-int") {
            $( "#facade-fact" ).slideUp( "fast", function() { });
            $( "#all-fact" ).slideDown( "fast", function() { });
        }
        else {
            $( "#all-fact" ).slideUp( "fast", function() { });
            $( "#facade-fact" ).slideDown( "fast", function() { });
        }
    });
    $("#button_corner").click(function() { cornerOn(); });
    $("#button_corner_off").click(function() { cornerOff(); });
    function cornerOn(){
        $("#button_corner").addClass("cf");
        $("#button_corner_off").removeClass("cf");
        $("#line_t").width($("#croped-conteiner").width());
        $("#line_b").width($("#croped-conteiner").width()).css('top',$("#croped-conteiner").height()-25);
        $("#line_l").height($("#croped-conteiner").height());
        $("#line_r").height($("#croped-conteiner").height()).css('left',$("#croped-conteiner").width()-25);
        $("#corner_r_t").css('left',$("#croped-conteiner").width()-32);
        $("#corner_l_b").css('top',$("#croped-conteiner").height()-32);
        $("#corner_r_b").css('left',$("#croped-conteiner").width()-32).css('top',$("#croped-conteiner").height()-32);
        $("#cornerdiv").text("неровный");
        $(".edge").css("display", "block");
    }
    function cornerOff(){
        $("#button_corner").removeClass("cf");
        $("#button_corner_off").addClass("cf");
        $("#cornerdiv").text("прямой");
        $(".edge").css("display", "none");
    }
    $(".interior-color li").click(function() {
        var wall_number = $(this).attr("id");
        var sBackground="";
        if(wall_number == "none") {wall_number ="/"; sBackground="noimg.png";}
        else {  sBackground= wall_number+".jpg"; wall_number =wall_number+"/";}
        $(".wall-all").css("backgroundImage", "url(/img/textures/back/"+sBackground+")");
        $("#corner_l_t").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "corner_l_t.png)");
        $("#corner_r_t").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "corner_r_t.png)");
        $("#corner_l_b").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "corner_l_b.png)");
        $("#corner_r_b").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "corner_r_b.png)");
        $("#line_t").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "line_t.png)");
        $("#line_b").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "line_b.png)");
        $("#line_r").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "line_r.png)");
        $("#line_l").css("backgroundImage", "url(/img/textures/bord/" + wall_number + "line_l.png)");
    });

    function startCrop(noAS){
        jcrop_api = $.Jcrop('#for-crop');

        jcrop_api.setOptions({setSelect:   [ $('#x1').val(), $('#y1').val(), 800, 517 ]});
        jcrop_api.setOptions({
            onChange: showCoords,
            onSelect: showCoords,
            bgColor:     'black',
            bgOpacity:   .4,
            minSize: [ 800/100*20, 517/100*20 ],
            allowSelect:false
        });

    }
    $('#SOR').change(function(e) {
        var AS = '';
        AS=$('#aspectRatio').val();
        jcrop_api.setOptions(this.checked? { aspectRatio: AS }: { aspectRatio: 0 });
        $('#heightOn').val( ($('#widthOn').val() / AS).toFixed(0) );

    });
    function showCoords(c){
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
        }
    }
    var size_ratio = 1.5473887814313;
    size_ratio = size_ratio;
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
        $('.widthOnS').html($('#widthOn').val());
        $('.heightOnS').html($('#heightOn').val());
        priceOnS();

    }
    function priceOnS() {
        SquareS();
        var price =$('#PRICEM2').val();

        var priceSum = price * $('#SQUARE').val();
        priceSum = parseFloat(priceSum).toFixed(2);

        $('.priceOnS').html(priceSum);
        $('#PRICE').val(priceSum);
    }

    function SquareS() {
        var sQ = parseFloat((parseInt($('#widthOn').val())/100) * (parseInt($('#heightOn').val())/100));
        var sQ2 = parseFloat((parseInt($('#widthOn').val())/100) * (parseInt($('#heightOn').val())/100)).toFixed(2);
        var sQ_three = ( ($('#widthOn').val()/100) * ($('#heightOn').val()/100) );
        var sQ_three_3 = Math.round((sQ_three*1000))/1000;
        if (sQ_three_3 < 1 ) { sQ_three_3 = 1;}
        $('#SQUARE').val( sQ_three_3 );
        $('.SquareOnS').html( sQ_three_3 );
    }

});





