<!-- IF ../isSection -->
<span class="category-title">{../name}</span>
<!-- ELSE -->
<!-- IF ../link -->
<a class="category-title" href="{../link}" itemprop="url" title="{../name}">
<!-- ELSE -->
<!-- IF loggedIn -->
<a class="category-title {../unread-class}" href="{config.relative_path}/category/{../slug}" itemprop="url" title="{../name}">
<!-- ELSE -->
<a class="category-title" href="{config.relative_path}/category/{../slug}" itemprop="url" title="{../name}">
<!-- ENDIF loggedIn -->

<!-- ENDIF ../link -->
{../name}
</a>
<!-- ENDIF ../isSection -->
