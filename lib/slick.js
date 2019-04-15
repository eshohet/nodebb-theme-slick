"use strict";

/*globals $, app, ajaxify, utils, socket, Slideout, zxcvbn, config*/

$(document).ready(function () {

        var env = utils.findBootstrapEnvironment();
        setupProgressBar();
        setupEditedByIcon();
        setupMobileMenu();
        setupChatsOnMobile();
        setupCheckBox();
        setupQuickReply();

        $(window).on('action:ajaxify.end', function (ev, data) {
            var header_container = $('#header-menu');
            toggleScrolled(header_container);

            $(window).on('scroll', function () {
                toggleScrolled(header_container);
            });

            if(data.url === "register")
                loadRegister();
        });


        function setupProgressBar() {
            $(window).on('action:ajaxify.start', function () {
                $('.load-bar').css('height', '2px');
            });

            $(window).on('action:ajaxify.end', function (ev, data) {
                setTimeout(function () {
                    $('.load-bar').css('height', '0px');
                }, 1000);

            });
        }

        function toggleScrolled(header_container) {
            if ($(this).scrollTop() > (header_container.outerHeight())) {
                header_container.addClass('scrolled');
            } else {
                header_container.removeClass('scrolled');
            }
        }

        function setupChatsOnMobile() {
            $(window).on('action:ajaxify.end', function (ev, data) {
                if (data.url && data.url.match('^user/.+/chats')) {
                    require(['slick/chats'], function (chats) {
                        chats.init();
                    });
                }
            });
        }

        function setupQuickReply() {
            $(window).on('action:ajaxify.end', function (ev, data) {
                if (data.url && data.url.match('^topic/')) {
                    require(['slick/quickreply'], function (quickreply) {
                        quickreply.init();
                    });
                }
            });
        }

        function setupEditedByIcon() {
            function activateEditedTooltips() {
                $('[data-pid] [component="post/editor"]').each(function () {
                    var el = $(this),
                        icon;

                    if (!el.attr('data-editor')) {
                        return;
                    }

                    icon = el.closest('[data-pid]').find('.edit-icon').first();
                    icon.prop('title', el.text()).tooltip('fixTitle').removeClass('hidden');
                });
            }

            $(window).on('action:posts.edited', function (ev, data) {
                var parent = $('[data-pid="' + data.post.pid + '"]');
                var icon = parent.find('.edit-icon').filter(function (index, el) {
                    return parseInt($(el).closest('[data-pid]').attr('data-pid'), 10) === parseInt(data.post.pid, 10);
                });
                var el = parent.find('[component="post/editor"]').first();
                icon.prop('title', el.text()).tooltip('fixTitle').removeClass('hidden');
            });

            $(window).on('action:topic.loaded', activateEditedTooltips);
            $(window).on('action:posts.loaded', activateEditedTooltips);
        }

        function setupMobileMenu() {
            if (!window.addEventListener) {
                return;
            }

            $('#menu').removeClass('hidden');

            var slideout = new Slideout({
                'panel': document.getElementById('panel'),
                'menu': document.getElementById('menu'),
                'padding': 256,
                'tolerance': 70,
                'side': 'right'
            });

            if (env !== 'xs') {
                slideout.disableTouch();
            }

            $('#mobile-menu').on('click', function () {
                slideout.toggle();
            });

            $('#menu a').on('click', function () {
                slideout.close();
            });

            $(window).on('resize action:ajaxify.start', function () {
                slideout.close();
                $('.account .cover').css('top', $('[component="navbar"]').height());
            });

            function openingMenuAndLoad() {
                openingMenu();
                loadNotificationsAndChat();
            }

            function openingMenu() {
                $('#header-menu').css({
                    'top': $(window).scrollTop() + 'px',
                    'position': 'absolute'
                });

                loadNotificationsAndChat();
            }

            function loadNotificationsAndChat() {
                require(['chat', 'notifications'], function (chat, notifications) {
                    chat.loadChatsDropdown($('#menu [data-section="chats"] ul'));
                    notifications.loadNotifications($('#menu [data-section="notifications"] ul'));
                });
            }

            slideout.on('open', openingMenuAndLoad);
            slideout.on('touchmove', function (target) {
                var $target = $(target);
                if ($target.length && ($target.is('code') || $target.parents('code').length || $target.hasClass('preventSlideOut') || $target.parents('.preventSlideOut').length)) {
                    slideout._preventOpen = true;
                }
            });

            slideout.on('close', function () {
                $('#header-menu').css({
                    'top': '0px',
                    'position': 'fixed'
                });
                $('.slideout-open').removeClass('slideout-open');
            });

            $('#menu [data-section="navigation"] ul').html($('#main-nav').html() + ($('#search-menu').html() || '') + ($('#logged-out-menu').html() || ''));

            $('#user-control-list').children().clone(true, true).appendTo($('#menu [data-section="profile"] ul'));
            $('#menu [data-section="profile"] ul').find('[component="user/status"]').remove();

            socket.on('event:user_status_change', function (data) {
                if (parseInt(data.uid, 10) === app.user.uid) {
                    app.updateUserStatus($('#menu [component="user/status"]'), data.status);
                    slideout.close();
                }
            });
        }

        function setupCheckBox() {
            $(window).on('action:ajaxify.end', function () {
                if (ajaxify.data.template.name == 'registerComplete') {
                    $('#agree-terms').after('<i class="input-helper"></i>');
                }
            });
        }

        (function (h, o, t, j, a, r) {
            h.hj = h.hj || function () {
                (h.hj.q = h.hj.q || []).push(arguments)
            };
            h._hjSettings = {hjid: 870102, hjsv: 6};
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

        'use strict';

        $('#register-link').on('click', () => {
            loadRegister();
        });

        $('#register-banner').on('click', () => {
            loadRegister();
        });

        function loadRegister() {

            history.pushState(null, null, "/register");

            $.get('/api/register', (data) => {
                const social = data.authentication.map((link) => {
                    return `<a rel="nofollow noopener noreferrer" target="_top" href="${link.url}"><i style="color: white;" class="fa ${link.icon} fa-3x"></i></a>`;
                }).join(' ');

                $('body').css(`background`, `#009fea`).html(`
				<div id="register">
					<div class="text-center">
						<img width="400px" src="https://s3-us-west-1.amazonaws.com/blockchainforums/uploads/logo_blue.png" />
					</div>
					<div class="text-center">
						<h1>Join now to discuss the future of blockchain.</h1>
					</div>
					<form>
					    <div id="social">${social}</div>
                        <div id="messages" class="text-center" style="color: white;"></div>
						<ul class="items"></ul>
						<fieldset id="usernameHolder" class="username enable">
							<div class="icon left"><i class="user"></i></div>
							<input type="text" id="username" name="username" placeholder="Username"/>
							<div class="icon right button"><i id="arrowUsername" class="arrow"></i></div>
						</fieldset>
						<fieldset id="emailHolder" class="email">
							<div class="icon left"><i class="letter"></i></div>
							<input type="email" id="email" name="email" placeholder="Email"/>
							<div class="icon right button"><i id="arrowEmail" class="arrow"></i></div>
						</fieldset>
						<fieldset id="passwordHolder" class="password">
							<div class="icon left"><i class="lock"></i></div>
							<input type="password" id="password" name="password" placeholder="Password"/>
							<div class="icon right button"><i id="arrowPassword" class="arrow"></i></div>
						</fieldset>
						<fieldset class="thanks">
							<div class="icon left"><i class="heart"></i></div>
							<p>Welcome!</p>
							<div class="icon right"><i id="arrowContinue" class="heart"></i></div>
						</fieldset>
					</form>
					<h1 class="text-center">By continuing you agree to our <a target="_blank" href="
https://docs.google.com/document/d/1zU5j0QLI6oeWTWBoyS9oSDLJMMnA4TJqmCxbg9f14y8/edit?usp=sharing">Privacy Policy</a> and <a target="_blank" href="https://drive.google.com/file/d/1luoC--8iAvVDjH_eyMXFqrtObTldfR_w/view?usp=sharing">ToS</a></h1>
				</div>
				`);
            });

            setTimeout(() => {
                const username = $('#username');
                const email = $('#email');
                const password = $('#password');
                $.get('/api/register', (ajaxify) => {
                    $(".arrow").on('click touchstart touch', () => {
                       touchPressed = true;
                    });

                    username.keyup((e) => {
                        if (username.val().length && event.keyCode !== 9 && event.keyCode !== 13) {
                            validateUsername(username.val(), ajaxify);
                        }
                    });

                    email.keyup((e) => {
                        if (email.val().length && event.keyCode !== 9 && event.keyCode !== 13) {
                            validateEmail(email.val());
                        }
                    });

                    password.keyup((e) => {
                        if (password.val().length && event.keyCode !== 9 && event.keyCode !== 13) {
                            validatePassword(password.val(), ajaxify);
                        }
                    });
                });


                $(username).focus();

            }, 1000);

            let canContinue = true;
            let touchPressed = false;
            let step = $("#usernameHolder");

            function validateUsername(username, ajaxify) {

                const username_notify = $('#usernameHolder');

                if (username.length < ajaxify.minimumUsernameLength) {
                    showError(username_notify);
                } else if (username.length > ajaxify.maximumUsernameLength) {
                    showError(username_notify);
                } else if (!utils.isUserNameValid(username) || !utils.slugify(username)) {
                    showError(username_notify);
                } else {
                    socket.emit('user.exists', {
                        username: username,
                    }, function (err, exists) {
                        if (err) {
                            return app.alertError(err.message);
                        }
                        if (exists) {
                            showError(username_notify, "Username already exists");
                        } else {
                            showSuccess(username_notify, `Other users can mention you via @${username}`);
                        }
                    });
                }
            }

            function validateEmail(email) {
                const email_notify = $('#emailHolder');

                if (!utils.isEmailValid(email)) {
                    showError(email_notify, 'Invalid email address');
                    return;
                }

                socket.emit('user.emailExists', {
                    email: email,
                }, function (err, exists) {
                    if (err) {
                        app.alertError(err.message);
                    }
                    if (exists) {
                        showError(email_notify, 'Email address is already taken');
                    } else {
                        showSuccess(email_notify, 'Good to go!');
                    }
                });
            }


            function validatePassword(password, ajaxify) {
                const password_notify = $('#passwordHolder');
                const passwordStrength = zxcvbn(password);

                if (password.length < ajaxify.minimumPasswordLength) {
                    showError(password_notify, 'Password is too short');
                } else if (password.length > 512) {
                    showError(password_notify, 'Password is too long');
                } else if (!utils.isPasswordValid(password)) {
                    showError(password_notify, 'Password is not valid');
                } else if (password === $('#username').val()) {
                    showError(password_notify, 'Password is the same as username');
                } else if (password === $('#email').val()) {
                    showError(password_notify, 'Password is the same as email');
                } else if (passwordStrength.score < ajaxify.minimumPasswordStrength) {
                    showError(password_notify, 'Password is too weak');
                } else {
                    showSuccess(password_notify, "Good to go!");
                }
            }

            function showError(element, msg) {
                $(element).css('border', '2px solid red');
                $('#messages').html(msg);
                canContinue = false;
                step = element;
            }

            function showSuccess(element, msg) {
                $(element).css('border', '2px solid #0de832');
                $('#messages').html(msg);
                canContinue = true;
                step = element;
            }

            function next(target) {
                var input = target.previousElementSibling;
                // Check if input is empty
                if (input.value === '') {
                    body.classList.add('error');
                } else {
                    body.classList.remove('error');
                    var enable = document.querySelector('form fieldset.enable'),
                        nextEnable = enable.nextElementSibling;
                    enable.classList.remove('enable');
                    enable.classList.add('disable');
                    nextEnable.classList.add('enable');

                    // Switch active class on left list
                    var active = document.querySelector('ul.items li.active'),
                        nextActive = active.nextElementSibling;
                    active.classList.remove('active');
                    nextActive.classList.add('active');

                }
            }

            function submitRegister() {
                //submit form
                const username = $('#username').val();
                const email = $('#email').val();
                const password = $('#password').val();
                $.ajax({
                    url: '/register',
                    type: 'post',
                    data: {
                        username, email, password,
                        "password-confirm": password
                    },
                    headers: {
                        'x-csrf-token': config.csrf_token,
                    },
                    success: function (data) {
                        ajaxify = null, app = null, socket = null; //block
                        $.ajax({
                            url: '/register/complete',
                            type: 'post',
                            data: {
                                'gdpr_agree_data': 'on',
                                'gdpr_agree_email': 'on'
                            },
                            headers: {
                                'x-csrf-token': config.csrf_token,
                            },
                            success: function (data) {
                                window.top.location = '/user/' + username;
                            }
                        });
                    },
                });
            }

            function keyDown(event) {
                setTimeout(() => {
                    var key = event.keyCode,
                        target = document.querySelector('fieldset.enable .button');
                    if (key === 13 || key === 9 || touchPressed) {
                        if (canContinue) {
                            if(step[0] === undefined)
                                submitRegister();
                            else {
                                switch (step[0].id) {
                                    case 'usernameHolder':
                                        setTimeout(() => {
                                            $("#email").focus();
                                            $("#messages").empty();
                                        }, 500);
                                        break;
                                    case 'emailHolder':
                                        setTimeout(() => {
                                            $("#password").focus();
                                            $("#messages").empty();
                                        }, 500);
                                        break;
                                    case 'passwordHolder':
                                        submitRegister();
                                        break;
                                    default:
                                        $("#messages").empty();

                                }
                            }
                            touchPressed = false;
                            next(target);
                        }
                        else {
                            $(step).css('animation', 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both');
                            setTimeout(() => {
                                $(step).css('animation', 'disable');
                            }, 1000);
                        }
                    }
                }, 100);
            }

            var body = document.querySelector('body'),
                form = document.querySelector('form');

            setTimeout(() => {
                document.addEventListener("keydown", keyDown, false);
            }, 1000);

        }
    }
);
