<?php
/**
 * Plugin Name: Tripzzy Payment Prototype
 * Plugin URI: https://wptripzzy.com
 * Description: Payment prototype allow you to create custom payement gateway for Tripzzy.
 * Version: 1.0.0
 * Author: WP Tripzzy
 * Author URI: https://wptripzzy.com
 *
 * License: GPLv3
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * Text Domain: payment-prototype
 * Domain Path: /languages/
 *
 * @package payment-prototype
 * @author  WP Tripzzy
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

use Tripzzy\PaymentGateway\MyGateway;

define( 'MY_GATEWAY_URL', plugin_dir_url( __FILE__ ) );

add_action( 'plugins_loaded', 'my_gateway_init' );

function my_gateway_init() {
	if ( ! class_exists( 'Tripzzy' ) ) {
		return;
	}
	require_once 'PaymentGateway/MyGateway.php';
	new MyGateway();
}
