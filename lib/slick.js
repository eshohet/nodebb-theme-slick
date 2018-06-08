"use strict";

/*globals $, app, ajaxify, utils, socket, Slideout, zxcvbn*/

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
            $.get('/api/register', (data) => {
                console.log(data);
                $('body').css(`background`, `#009fea`).html(`
				<div id="register">
					<div class="text-center">
						<img width="440px" src="https://s3-us-west-1.amazonaws.com/blockchainforums/uploads/logo_blue.png" />
					</div>
					<div class="text-center">
						<h1>Register now for access to exclusive discounts on conferences, classes, icos, and other events</h1>
					</div> 
					<form onsubmit="registerSubmit()">
						<ul class="items"></ul>
						<fieldset id="usernameHolder" class="username enable">
							<div class="icon left"><i class="user"></i></div>
							<input type="text" id="username" name="username" placeholder="Username"/>
							<div class="icon right button"><i class="arrow"></i></div>
						</fieldset>
						<fieldset id="emailHolder" class="email">
							<div class="icon left"><i class="letter"></i></div>
							<input type="email" id="email" name="email" placeholder="Email"/>
							<div class="icon right button"><i class="arrow"></i></div>
						</fieldset>
						<fieldset id="passwordHolder" class="password">
							<div class="icon left"><i class="lock"></i></div>
							<input type="password" id="password" name="password" placeholder="Password"/>
							<div class="icon right button"><i class="arrow"></i></div>
						</fieldset>
						<fieldset class="thanks">
							<div class="icon left"><i class="heart"></i></div>
							<p>Welcome!</p>
							<div class="icon right"><i class="heart"></i></div>
						</fieldset>
					</form>
					<div id="messages" class="text-center" style="color: white;"></div>
				</div>
				`);
            });


            setTimeout(() => {
                const username = $('#username');
                const email = $('#email');
                const password = $('#password');

                username.keyup(() => {
                    if (username.val().length) {
                        validateUsername(username.val());
                    }
                });

                email.keyup(() => {
                    if (email.val().length) {
                        validateEmail(email.val());
                    }
                });

                password.keyup(() => {
                    if (password.val().length) {
                        validatePassword(password.val());
                    }
                });

                $(username).focus();

            }, 1000);

            let canContinue = true;
            let step = null;

            function validateUsername(username) {

                const username_notify = $('#usernameHolder');

                if (username.length < ajaxify.data.minimumUsernameLength) {
                    showError(username_notify);
                } else if (username.length > ajaxify.data.maximumUsernameLength) {
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


            function validatePassword(password) {
                const password_notify = $('#passwordHolder');
                const passwordStrength = zxcvbn(password);

                if (password.length < ajaxify.data.minimumPasswordLength) {
                    showError(password_notify, 'Password is too short');
                } else if (password.length > 512) {
                    showError(password_notify, 'Password is too long');
                } else if (!utils.isPasswordValid(password)) {
                    showError(password_notify, 'Password is not valid');
                } else if (password === $('#username').val()) {
                    showError(password_notify, 'Password is the same as username');
                } else if (password === $('#email').val()) {
                    showError(password_notify, 'Password is the same as email');
                } else if (passwordStrength.score < ajaxify.data.minimumPasswordStrength) {
                    showError(password_notify, 'Password is too weak');
                } else {
                    showSuccess(password_notify);
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

            function init() {
                // Generate li foreach fieldset
                for (var i = 0; i < count; i++) {
                    var ul = document.querySelector('ul.items'),
                        li = document.createElement("li");

                    ul.appendChild(li);
                }
                // Add class active on first li
                ul.firstChild.classList.add('active');
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

            function keyDown(event) {
                var key = event.keyCode,
                    target = document.querySelector('fieldset.enable .button');
                if (key === 13 || key === 9) {
                    if (canContinue) {
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
                            default:
                                $("#messages").empty();

                        }
                        next(target);
                    }
                    else {
                        $(step).css('animation', 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both');
                        setTimeout(() => {
                            $(step).css('animation', '');
                        }, 1000);
                    }
                }
            }

            var body = document.querySelector('body'),
                form = document.querySelector('form'),
                count = form.querySelectorAll('fieldset').length;

            // setTimeout(init, 1000);
            setTimeout(() => {
                document.body.onmouseup = function (event) {
                    var target = event.target || event.toElement;
                    if (target.classList.contains("button")) next(target);
                };
                document.addEventListener("keydown", keyDown, false);
            }, 1000);

        }
    }
);
