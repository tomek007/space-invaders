'use strict';
$( document ).ready(function() {

    var keydowns = {
        left: 0,
        right: 0,
        space: 0
    };

    $('body').on('keydown', function (e) {

        var left = $('#cannon').offset().left - $('#game').offset().left;

        switch (e.keyCode) {
            case 37: keydowns.left = 1; break;
            case 39: keydowns.right = 1; break;
            case 32: keydowns.space = 1; break;
        }

    });

    $('body').on('keyup', function (e) {

        switch (e.keyCode) {
            case 37: keydowns.left = 0; break;
            case 39: keydowns.right = 0; break;
            case 32: keydowns.space = 0; break;
        };

    });



    var alienWidth = 50;
    var alienHeight = 40;

    function createAlians() {

        var aliens = [
            "images/alien3a.png", "images/alien1a.png", "images/alien2a.png"
        ]
        $(aliens).each(function (idx, el) {

            for(var row = 0; row < 2; row++) {

                for(var col=0; col < 11; ++col) {
                    var image = new Image();
                    image.src = el;
                    $(image).css({
                        left: col * alienWidth,
                        top: (idx * 2 + row) * alienHeight + 50
                    });
                    $(image).addClass('alien');
                    $('#game').append(image);
                }

            }


        });

    }


    function alienHit(bulletPosition) {
        var alien = null;

        $('.alien').each(function () {

            if(alien) {
                return
            }

            var alienPosition = $(this).position();

            if( alienPosition.left < bulletPosition.left &&
                bulletPosition.left < alienPosition.left + $(this).width() &&
                alienPosition.top < bulletPosition.top &&
                bulletPosition.top < alienPosition.top + $(this).height() ) {

                alien = this;

                }

        });

        return alien;

    }

    var tick = 0;
    var alienTick = 70;
    var alienDir = 5;
    var alienDown = 3;

    function draw() {
        requestAnimationFrame(draw);
        tick++;

        var d = 3,
            left = $('#cannon').position().left,
            alien;

        if(tick % 100 === 0) {
            alienTick = Math.max(1, alienTick - 1);
        }

        if(tick % alienTick === 0 ) {

            $('.alien').each(function () {

                $(this).css({
                    left: $(this).position().left + alienDir
                })

            });

            var alienLefts = $('.alien').map(function () {
                return $(this).position().left;
            })

            if(Math.max.apply(Math, alienLefts) + alienWidth > $('#game').width() || Math.min.apply(Math, alienLefts) <= 0 ) {
                alienDir = -alienDir;
                $('.alien').each(function () {
                   $(this).css({
                       top: $(this).position().top + alienDown
                   })
                });
            }

        }



        if($('#bullet').length > 0) {

            $('#bullet').css({
                top: $('#bullet').position().top - 4
            });

            if(tick % 10 == 5) {
                $('#bullet').attr('src', $('#bullet').attr('src') === 'images/bulleta.png' ? 'images/bulletb.png' : 'images/bulleta.png');
            };

            alien = alienHit( $('#bullet').position() );

            if(alien) {
                alienTick = Math.max(1, alienTick - 1);
                $(alien).remove();
                $('#bullet').remove();
            }

            if( $('#bullet').length > 0 && $('#bullet').position().top < 0 ) {
                $('#bullet').remove();
            };

        };

        if(keydowns.left) { $('#cannon').css({left:left-d}) };
        if(keydowns.right) { $('#cannon').css({left:left+d}) };
        if(keydowns.space) {

            if( $('#bullet').length === 0 ) {
                $('#game').append('<img id="bullet" src="images/bulleta.png">');

                $('#bullet_sound')[0].play();

                $('#bullet').css({
                    position: 'absolute',
                    left: left + ($('#cannon').width() / 2) - 1,
                    top: $('#cannon').position().top - $('#cannon').height()
                });
            }


        }

    };

    createAlians();
    draw();

});

