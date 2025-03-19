<?php
/**
 * Payment Gateway : My Gateway.
 *
 * @package tripzzy
 */

namespace Tripzzy\PaymentGateway;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;
use Tripzzy\Core\Payment\PaymentGateways; // Base.
use Tripzzy\Core\Helpers\MetaHelpers;
use Tripzzy\Core\Helpers\Settings;
use Tripzzy\Core\Helpers\Trip;
use Tripzzy\Core\Traits\SingletonTrait;
use Tripzzy\Core\Traits\GatewayTrait;
use Tripzzy\Core\Cart;
use Tripzzy\Core\Bookings;
use Tripzzy\Core\Forms\CheckoutForm;

if ( ! class_exists( 'Tripzzy\PaymentGateway\MyGateway' ) ) {
	/**
	 * Payment Gateway.
	 */
	class MyGateway extends PaymentGateways {
		use SingletonTrait;
		use GatewayTrait;

		/**
		 * Payment Gateway slug.
		 *
		 * @var   string
		 */
		protected static $payment_gateway = 'my_gateway';

		/**
		 * Payment Gateway Title / name.
		 *
		 * @var   string
		 */
		protected static $payment_gateway_title;

		/**
		 * Tripzzy Settings.
		 *
		 * @var   array
		 */
		protected static $settings;

		/**
		 * Constructor.
		 */
		public function __construct() {
			self::$payment_gateway_title = __( 'My Gateway' );
			self::$settings              = Settings::get(); // for traits.

			// Add Settings Fields.
			add_filter( 'tripzzy_filter_payment_gateways_args', array( $this, 'init_args' ) );

			// Gateway Script.
			add_filter( 'tripzzy_filter_gateway_scripts', array( $this, 'init_gateway_scripts' ) );

			// add it, if you need localized data for your gateway.
			add_filter( 'tripzzy_filter_localize_variables', array( __CLASS__, 'localized_variables' ) );
		}

		/**
		 * Payment gateway arguments.
		 */
		protected static function payment_gateway_args() {
			$args = array(
				'title'         => self::$payment_gateway_title,
				'name'          => self::$payment_gateway,
				'wrapper_class' => '',
				'fields'        => array(
					'enabled'     => array( // this key is for php side.
						'name'  => 'enabled', // this name and its key must be identical.
						'label' => __( 'Enabled' ),
						'value' => true,
					),
					'description' => array(
						'name'  => 'description',
						'label' => __( 'Description' ),
						'type'  => 'textarea',
						'value' => __( 'Complete your booking by paying with My Gateway.' ),
					),
					// My Gateway Key.
					'key_id'      => array(
						'name'  => 'key_id',
						'type'  => 'text',
						'label' => __( 'My Gateway Key' ),
						'value' => '',
					),
				),
			);
			return $args;
		}

		/**
		 * Gateway scripts arguments.
		 */
		protected static function gateway_scripts() {
			$data = self::geteway_data();
			$args = array();
			if ( ! empty( $data ) ) {

				$key_id = $config['key_id'] ?? ''; // Payment key to use if required to pass in checkout js.

				$payment_js        = 'https://checkout.example.com/v1/checkout.js'; // checkout js.
				$payment_js_custom = sprintf( '%sassets/payment.js', MY_GATEWAY_URL );

				$args[] = $payment_js;
				$args[] = $payment_js_custom;
			}
			return $args;
		}

		/**
		 * Localized variables for payment.
		 *
		 * @param array $localized All localized variables.
		 * @return array
		 */
		public static function localized_variables( $localized ) {

			$data = self::geteway_data();
			if ( ! empty( $data ) ) {
				$config = $data['config']; // Payment gateway configuration.
				$key_id = $config['key_id'] ?? '';

				$localized['gateway']['my_gateway'] = array(
					'key_id' => $key_id,
				);
			}

			return $localized;
		}
	}
}
