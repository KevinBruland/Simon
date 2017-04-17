$(document).ready(function () {

    var yellowSound = new Audio('./audio/simonYellow.wav');
    var greenSound = new Audio('./audio/simonGreen.wav');
    var blueSound = new Audio('./audio/simonBlue.wav');
    var redSound = new Audio('./audio/simonRed.wav');
    var failSound = new Audio('./audio/simonFail.wav');

    var colors = ['yellow', 'green', 'blue', 'red'];
    var strictMode = false;
    var score, playerTurn, order, turnCount, delay, compSpeed, lastTurn, winAnimationCounter;

    function initialize() {
        score = 0;
        playerTurn = false;
        order = [];
        turnCount = 0;
        compSpeed = 700;
        lastTurn = false;
        winAnimationCounter = 1;
        changeScore();
    }
    /**/
    initialize();

    function colorOn(id) {
        eval(id + 'Sound').play();
        $('#' + id).css({
            'opacity': '1',
            'box-shadow': '0 0 15px ' + $('#' + id).css('background-color')
        });
    }

    function changeScore() {
        var displayScore = score;
        if (score < 10) {
            displayScore = "0" + score;
        }
        $('#count').html(displayScore);
    }

    function colorOff(id) {
        eval(id + 'Sound').pause();
        eval(id + 'Sound').currentTime = 0;
        $('#' + id).css({
            'opacity': '.7',
            'box-shadow': '0 0 0'
        });
    }

    function setComp() {
        playerTurn = false;
        lastTurn = false;
        turnCount = 0;
        delay = setInterval(compTurn, compSpeed);
    }

    function failure(id) {
        eval(id + 'Sound').pause();
        eval(id + 'Sound').currentTime = 0;
        failSound.play();
        if (strictMode) {
            initialize();
            changeScore();
        } else {
            setTimeout(setComp, 4000);
        }
    }

    $('.color').on('mousedown touchstart', function () {
        if (playerTurn) {
            colorOn($(this).attr('id'));
            if ($(this).attr('id') !== order[turnCount]) {
                console.log('fail');
                colorOff($(this).attr('id'));
                failure($(this).attr('id'));
            } else if (turnCount >= score) {
                lastTurn = true;
                return;
            }
            turnCount++
        }
    });

    $('.color').on('mouseup mouseleave touchend', function () {
        if (playerTurn) {
            colorOff($(this).attr('id'));
            if (lastTurn) {
                playerTurn = false;
                lastTurn = false;
                score = turnCount + 1;
                if (score == 20) {
                    return youWin();
                }
                changeScore();
                turnCount = 0;
                delay = setInterval(compTurn, compSpeed);
            }
        }
    });

    function winAnimation() {
        colorOff(colors[(winAnimationCounter - 1) % 4]);
        colorOn(colors[winAnimationCounter % 4]);
        winAnimationCounter++;
        if (winAnimationCounter < 27) {
            setTimeout(winAnimation, 100);
        } else {
            colorOff(colors[(winAnimationCounter - 1) % 4]);
        }
    }

    function youWin() {
        clearInterval(delay);
        $('#count').html('!!!');
        winAnimation();
    }

    $('#start').on('click', function () {
        initialize();
        clearInterval(delay);
        for (var x = 0; x < 20; x++) {
            order.push(colors[Math.floor(Math.random() * 4)]);
        }
        delay = setInterval(compTurn, compSpeed);
    });

    $('#reset').on('click', function () {
        initialize();
        clearInterval(delay);
        for (var x = 0; x < 20; x++) {
            order.push(colors[Math.floor(Math.random() * 4)]);
        }
        delay = setInterval(compTurn, compSpeed);
    });

    function compOff() {
        colorOff(order[turnCount - 1]);
        if (turnCount > score) {
            turnCount = 0;
            playerTurn = true;
            clearInterval(delay);
        }
    }

    function compTurn() {
        console.log(turnCount);
        if (turnCount <= score) {
            colorOn(order[turnCount]);
            setTimeout(compOff, compSpeed / 2);
        }
        turnCount++;
    }

    $('#strict').change(function () {
        if (this.checked) {
            strictMode = true;
        } else {
            strictMode = false;
        }
    });

});
