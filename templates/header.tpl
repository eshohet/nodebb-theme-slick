<!DOCTYPE html>
<html lang="{function.localeToHTML, userLang, defaultLang}" <!-- IF languageDirection -->data-dir="{languageDirection}" style="direction: {languageDirection};" <!-- ENDIF languageDirection -->>

<head>
	<title>{browserTitle}</title>
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
				})(window,document,'script','dataLayer','GTM-W5T7CQQ');</script>

	<meta property="og:description"
		  content="A forum for cryptocurrency & blockchain enthusiasts. Join now!" />
	<!-- BEGIN metaTags -->
	<!-- IF metaTags.content -->
	{function.buildMetaTag}
	<!-- ENDIF metaTags.content -->
	<!-- END metaTags -->
	<link rel="stylesheet" type="text/css" href="{relative_path}/assets/stylesheet.css?{config.cache-buster}" />
	<!-- BEGIN linkTags -->{function.buildLinkTag}
	<!-- END linkTags -->

	<script>
		var RELATIVE_PATH = "{relative_path}";
		var config = JSON.parse('{{configJSON}}');
		var app = {
			template: "{template.name}",
			user: JSON.parse('{{userJSON}}')
		};
	</script>

	<!-- IF useCustomHTML -->
	{{customHTML}}
	<!-- END -->

	<!-- Facebook Pixel Code -->
	<script>
        !function(f,b,e,v,n,t,s)
				{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
				n.callMethod.apply(n,arguments):n.queue.push(arguments)};
				if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
				n.queue=[];t=b.createElement(e);t.async=!0;
				t.src=v;s=b.getElementsByTagName(e)[0];
				s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '166704077332741');
        fbq('track', 'PageView');
	</script>
	<noscript><img height="1" width="1" style="display:none"
				   src="https://www.facebook.com/tr?id=166704077332741&ev=PageView&noscript=1"
		/></noscript>
	<!-- End Facebook Pixel Code -->

	<!-- IF useCustomCSS -->
	<style type="text/css">{{customCSS}}</style>
	<!-- END -->
</head>

<body class="{bodyClass} skin-{config.selectedSkin}">
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5T7CQQ"
					  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<nav id="menu" class="hidden">
		<section class="menu-profile">
			<!-- IF user.uid -->
			<!-- IF user.picture -->
			<img class="user-avatar" src="{user.picture}" />
			<!-- ELSE -->
			<div class="user-icon" style="background-color: {user.icon:bgColor};">{user.icon:text}</div>
			<!-- ENDIF user.picture -->
			<i component="user/status" class="fa fa-fw fa-circle status {user.status}"></i>
			<!-- ENDIF user.uid -->
		</section>

		<section class="menu-section" data-section="navigation">
			<h3 class="menu-section-title">[[global:header.navigation]]</h3>
			<ul class="menu-section-list"></ul>
		</section>

		<!-- IF config.loggedIn -->
		<section class="menu-section" data-section="profile">
			<h3 class="menu-section-title">[[global:header.profile]]</h3>
			<ul class="menu-section-list" component="header/usercontrol"></ul>
		</section>

		<section class="menu-section" data-section="notifications">
			<h3 class="menu-section-title">
				[[global:header.notifications]]
				<span class="counter" component="notifications/icon" data-content="0"></span>
			</h3>
			<ul class="menu-section-list notification-list-mobile" component="notifications/list"></ul>
			<p class="menu-section-list"><a href="{relative_path}/notifications">[[notifications:see_all]]</a></p>
		</section>

		<section class="menu-section" data-section="chats">
			<h3 class="menu-section-title">
				[[global:header.chats]]
				<i class="counter" component="chat/icon" data-content="0"></i>
			</h3>
			<ul class="menu-section-list chat-list" component="chat/list"></ul>
		</section>
		<!-- ENDIF config.loggedIn -->
	</nav>

	<main id="panel">
		<nav class="navbar navbar-default navbar-fixed-top header" id="header-menu" component="navbar">

			<!-- IF !config.loggedIn -->
			<div onclick="window.location = '/register';" class="banner-holder">
				<span class="banner-text"><a href="/register" style="color: white">Join our community of crypto & blockchain enthusiasts today.</a></span>
			</div>
			<!-- ENDIF !config.loggedIn -->

			<div class="load-bar">
				<div class="bar"></div>
				<div class="bar"></div>
				<div class="bar"></div>
			</div>
			<div class="container">
				<!-- IMPORT partials/menu.tpl -->
			</div>
		</nav>
		<!-- IF !config.loggedIn -->
		<div class="container guest" id="content">
		<!-- ELSE -->
		<div class="container" id="content">
		<!-- ENDIF !config.loggedIn -->


			<!-- IMPORT partials/noscript/warning.tpl -->
			<!-- Twitter universal website tag code -->
			<script>
                !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
						},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
						a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
                // Insert Twitter Pixel ID and Standard Event data below
                twq('init','nzglc');
                twq('track','PageView');
			</script>
			<!-- End Twitter universal website tag code -->
