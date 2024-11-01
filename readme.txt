=== ShopSite ===
Plugin Name: ShopSite
Contributors: ShopSite
Tags: e-commerce, shopping, shopsite
Requires at least: 3.2.0
Tested up to: 6.6
Stable tag: 1.5.10

Add a free ShopSite shopping cart to your WordPress site and start taking orders today!

== Description ==

The plugin integrates ShopSite shopping cart functionality with WordPress blogs. If you don't have a ShopSite cart you can get a free Express store (http://saas.shopsite.com/express).  After installing the plugin a merchant will be able to select ShopSite products directly from WordPress admin console and add them to her blog. The visitors of that blog will be able to add products to cart right on the blog, after which they are redirected to the merchant's ShopSite store to check out. Requires ShopSite v11 SP2 or greater.

Usage: There will be new button when adding a new post to the blog, with ShopSite's "SS" on it. Clicking it will bring out a product search form where you can select products from your ShopSite's store database to insert into the post.

Note: Since Wordpress switched their default editor in v5.x, the 'Classic Editor Plugin' is required. In Wordpress go to Settings > Writing and change "Default editor for all users" to Classic.

== Installation ==

The plugin requires ShopSite v11 SP2 or greater.

1. Select 'Plugins' in your WordPress admin console
1. Select 'Add New'
1. Search for 'shopsite' in Plugins search box
1. Select 'Install Now' under 'ShopSite' plugin
1. Select 'Activate plugin'


== Changelog ==
= 1.5.10 =
* Bug Fixes for WordPress 6.4.3 (Classic Editor Plugin required).

= 1.5.7 =
* Test with WordPress 5.0.3 (Classic Editor Plugin required).

= 1.5.6 =
* Test with WordPress 4.8.1

= 1.5.5 =
* Remove call to a jQuery 1.7 function; update WordPress version

= 1.5.4 =
* Improve compatibility with other TinyMCE plugins; improve image display

= 1.5.3 =
* Fix for PHP versions less than 5.4.

= 1.5.2 =
* Don't require SSL verification of secure URLs.

= 1.5.1 =
* Renamed options and variables to minimize potential conflict with other plugins. Minor UI changes. Delete data when deleting plugin.

= 1.5.0 =
* Changed UI for selecting a product.

= 1.4.1 =
* Changed the shortcode to [ss_product] and javascript variable name to ss_path to avoid conflicts with other plugins.

= 1.4 =
* Changed the configuration procedure to only make user copy/paste 1 string instead of 5. Added installation tutorial.

= 1.3 =
* Changed shopper-facing product download method to allow product display in the blog for some PHP config settings.

= 1.2 =
* Added a Test Connection button on the configuration screen. Added a 30-second connection timeout.

= 1.1 =
* Fixed a bug preventing product display in the blog for some PHP config settings

= 1.0 =
* Initial release
