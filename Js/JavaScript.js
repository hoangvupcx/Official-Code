$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() >= $(".picture-product img:last-child").prop('offsetTop'))
        $('.accordion').hide("slow")
        else
        $('.accordion').show("slow")
    })

    $(window).scroll(function(event) {
        var pos_body = $('html,body').scrollTop();
        if(pos_body>20){
            $('.gotop').addClass('hien-ra');
        }
        else{
            $('.gotop').removeClass('hien-ra');
        }
        if(pos_body<2000){
            $('.accordion').addClass('hien-ra');
        }
        else{
            $('.accordion').removeClass('hien-ra');
        }
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() >= 150) {
            $('nav').css({
                "position": "fixed",
                "left": 0,
                "right": 0,
                "top": 0,
                "z-index": 999,
                "opacity": 1
            })
        }
        else {
            $('nav').css({
                "position": "relative",
                "opacity": 1
            })
        }
    })

    $('.gotop').click(function(event) {
        $('html,body').animate({scrollTop: 0},800);
    });

    $('.gobot').click(function(event) {
        $('html,body').animate({scrollTop: $(".Detail-product").prop('offsetTop')},800);
    });

    $('.accordion-item1.active .accordion-body1').slideDown();
    $('.accordion-header1').click(function(){
        $(this).parent().toggleClass('active');
        $(this).parent().children('.accordion-body1').slideToggle(); // Từ header tìm về cha (item) rồi đưa về con (body)
    })
});