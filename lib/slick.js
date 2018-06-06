"use strict";

/*globals $, app, ajaxify, utils, socket, Slideout*/

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


            // function registerSubimt() {
            //    var Register = {};
            //    var validationError = false;
            //    var successIcon = '';
            //
            //    Register.init = function () {
            //        var email = $('#email');
            //        var username = $('#username');
            //        var password = $('#password');
            //
            //        handleLanguageOverride();
            //
            //        $('#referrer').val(app.previousUrl);
            //        $('#content #noscript').val('false');
            //
            //        email.on('blur', function () {
            //            if (email.val().length) {
            //                validateEmail(email.val());
            //            }
            //        });
            //
            //        var query = utils.params();
            //        if (query.email && query.token) {
            //            email.val(decodeURIComponent(query.email));
            //            $('#token').val(query.token);
            //        }
            //
            //        // Update the "others can mention you via" text
            //        username.on('keyup', function () {
            //            $('#yourUsername').text(this.value.length > 0 ? utils.slugify(this.value) : 'username');
            //        });
            //
            //        username.on('blur', function () {
            //            if (username.val().length) {
            //                validateUsername(username.val());
            //            }
            //        });
            //
            //        password.on('blur', function () {
            //            if (password.val().length) {
            //                validatePassword(password.val(), password_confirm.val());
            //            }
            //        });
            //
            //        password_confirm.on('blur', function () {
            //            if (password_confirm.val().length) {
            //                validatePasswordConfirm(password.val(), password_confirm.val());
            //            }
            //        });
            //
            //        function validateForm(callback) {
            //            validationError = false;
            //            validatePassword(password.val(), password_confirm.val());
            //            validatePasswordConfirm(password.val(), password_confirm.val());
            //
            //            validateEmail(email.val(), function () {
            //                validateUsername(username.val(), callback);
            //            });
            //        }
            //
            //        register.on('click', function (e) {
            //            var registerBtn = $(this);
            //            var errorEl = $('#register-error-notify');
            //            errorEl.addClass('hidden');
            //            e.preventDefault();
            //            validateForm(function () {
            //                if (validationError) {
            //                    return;
            //                }
            //
            //                registerBtn.addClass('disabled');
            //
            //                registerBtn.parents('form').ajaxSubmit({
            //                    headers: {
            //                        'x-csrf-token': config.csrf_token,
            //                    },
            //                    success: function (data) {
            //                        registerBtn.removeClass('disabled');
            //                        if (!data) {
            //                            return;
            //                        }
            //                        if (data.referrer) {
            //                            var pathname = utils.urlToLocation(data.referrer).pathname;
            //
            //                            var params = utils.params({ url: data.referrer });
            //                            params.registered = true;
            //                            var qs = decodeURIComponent($.param(params));
            //
            //                            window.location.href = pathname + '?' + qs;
            //                        } else if (data.message) {
            //                            translator.translate(data.message, function (msg) {
            //                                bootbox.alert(msg);
            //                                ajaxify.go('/');
            //                            });
            //                        }
            //                    },
            //                    error: function (data) {
            //                        translator.translate(data.responseText, config.defaultLang, function (translated) {
            //                            if (data.status === 403 && data.responseText === 'Forbidden') {
            //                                window.location.href = config.relative_path + '/register?error=csrf-invalid';
            //                            } else {
            //                                errorEl.find('p').text(translated);
            //                                errorEl.removeClass('hidden');
            //                                registerBtn.removeClass('disabled');
            //                            }
            //                        });
            //                    },
            //                });
            //            });
            //        });
            //    };
            //
            //    function validateEmail(email, callback) {
            //        callback = callback || function () {};
            //        var email_notify = $('#email-notify');
            //
            //        if (!utils.isEmailValid(email)) {
            //            showError(email_notify, '[[error:invalid-email]]');
            //            return callback();
            //        }
            //
            //        socket.emit('user.emailExists', {
            //            email: email,
            //        }, function (err, exists) {
            //            if (err) {
            //                app.alertError(err.message);
            //                return callback();
            //            }
            //
            //            if (exists) {
            //                showError(email_notify, '[[error:email-taken]]');
            //            } else {
            //                showSuccess(email_notify, successIcon);
            //            }
            //
            //            callback();
            //        });
            //    }
            //

            //
            //    function validatePassword(password, password_confirm) {
            //        var password_notify = $('#password-notify');
            //        var password_confirm_notify = $('#password-confirm-notify');
            //        var passwordStrength = zxcvbn(password);
            //
            //        if (password.length < ajaxify.data.minimumPasswordLength) {
            //            showError(password_notify, '[[reset_password:password_too_short]]');
            //        } else if (password.length > 512) {
            //            showError(password_notify, '[[error:password-too-long]]');
            //        } else if (!utils.isPasswordValid(password)) {
            //            showError(password_notify, '[[user:change_password_error]]');
            //        } else if (password === $('#username').val()) {
            //            showError(password_notify, '[[user:password_same_as_username]]');
            //        } else if (password === $('#email').val()) {
            //            showError(password_notify, '[[user:password_same_as_email]]');
            //        } else if (passwordStrength.score < ajaxify.data.minimumPasswordStrength) {
            //            showError(password_notify, '[[user:weak_password]]');
            //        } else {
            //            showSuccess(password_notify, successIcon);
            //        }
            //
            //        if (password !== password_confirm && password_confirm !== '') {
            //            showError(password_confirm_notify, '[[user:change_password_error_match]]');
            //        }
            //    }
            //
            //    function validatePasswordConfirm(password, password_confirm) {
            //        var password_notify = $('#password-notify');
            //        var password_confirm_notify = $('#password-confirm-notify');
            //
            //        if (!password || password_notify.hasClass('alert-error')) {
            //            return;
            //        }
            //
            //        if (password !== password_confirm) {
            //            showError(password_confirm_notify, '[[user:change_password_error_match]]');
            //        } else {
            //            showSuccess(password_confirm_notify, successIcon);
            //        }
            //    }
            //
            //    function showError(element, msg) {
            //        translator.translate(msg, function (msg) {
            //            element.html(msg);
            //            element.parent()
            //                .removeClass('register-success')
            //                .addClass('register-danger');
            //            element.show();
            //        });
            //        validationError = true;
            //    }
            //
            //    function showSuccess(element, msg) {
            //        translator.translate(msg, function (msg) {
            //            element.html(msg);
            //            element.parent()
            //                .removeClass('register-danger')
            //                .addClass('register-success');
            //            element.show();
            //        });
            //    }
            //
            //    function handleLanguageOverride() {
            //        if (!app.user.uid && config.defaultLang !== config.userLang) {
            //            var formEl = $('[component="register/local"]');
            //            var langEl = $('<input type="hidden" name="userLang" value="' + config.userLang + '" />');
            //
            //            formEl.append(langEl);
            //        }
            //    }
            // }

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
                if (key == 13 || key == 9) {
                    if(canContinue)
                        next(target);
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

            setTimeout(init, 1000);
            document.body.onmouseup = function (event) {
                var target = event.target || event.toElement;
                if (target.classList.contains("button")) next(target);
            };
            document.addEventListener("keydown", keyDown, false);
        }


    }

);
