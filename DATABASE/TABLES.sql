CREATE TABLE `customers` (
    `customer_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `customer_name` varchar(255) DEFAULT NULL,
    `email` varchar(255) NOT NULL UNIQUE,
    `birthday` date NOT NULL,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`customer_id`),
    KEY `idx_email` (`email`) USING BTREE,
    KEY `idx_birthday` (`birthday`) USING BTREE,
    KEY `idx_created_date` (`created_date`) USING BTREE
);

CREATE TABLE `products` (
    `product_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `product_name` varchar(255) NOT NULL,
    `product_image` text DEFAULT NULL,
    `product_description` text DEFAULT NULL,
    `product_price` decimal(10, 2) NOT NULL,
    `category_id` bigint(20) NOT NULL,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`product_id`),
    KEY `idx_product_name` (`product_name`) USING BTREE,
    KEY `idx_category_id` (`category_id`) USING BTREE
);

CREATE TABLE `categories` (
    `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `category_name` varchar(100) NOT NULL,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`category_id`)
);

CREATE TABLE `product_options` (
    `option_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `option_name` varchar(100) NOT NULL,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`option_id`)
);

CREATE TABLE `product_option_values` (
    `option_value_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `product_id` bigint(20) NOT NULL,
    `option_id` bigint(20) NOT NULL,
    `option_value` varchar(100) NOT NULL,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`option_value_id`),
    KEY `idx_product_id` (`product_id`) USING BTREE,
    KEY `idx_option_id` (`option_id`) USING BTREE
);

CREATE TABLE `product_option_combinations` (
    `combination_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `product_id` bigint(20) NOT NULL,
    `price` decimal(10,2),
    `stock` int DEFAULT 0,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`combination_id`),
    KEY `idx_product_id` (`product_id`) USING BTREE,
    KEY `idx_price` (`price`) USING BTREE
);

CREATE TABLE `product_option_combination_details` (
    `combination_id` bigint(20) NOT NULL,
    `option_value_id` bigint(20) NOT NULL,
    PRIMARY KEY (`combination_id`,`option_value_id`)
);

CREATE TABLE `carts` (
    `cart_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `customer_id` bigint(20) NOT NULL,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`cart_id`),
    KEY `idx_customer_id` (`customer_id`) USING BTREE
);

CREATE TABLE `cart_items` (
    `cart_item_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `cart_id` bigint(20) NOT NULL,
    `combination_id` bigint(20) NOT NULL,
    `quantity` int DEFAULT 1,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`cart_item_id`),
    KEY `idx_cart_id` (`cart_id`) USING BTREE,
    KEY `idx_combination_id` (`combination_id`) USING BTREE
);

CREATE TABLE `orders` (
    `order_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `customer_id` bigint(20) NOT NULL,
    `total_amount` decimal(10,2),
    `subtotal` decimal(10,2),
    `discount` decimal(10,2),
    `shipping_cost` decimal(10,2),
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_id`),
    KEY `idx_customer_id` (`customer_id`) USING BTREE
);

CREATE TABLE `order_items` (
    `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `order_id` bigint(20) NOT NULL,
    `combination_id` bigint(20) NOT NULL,
    `quantity` int DEFAULT 1,
    `unit_price` decimal(10,2),
    PRIMARY KEY (`order_item_id`),
    KEY `idx_order_id` (`order_id`) USING BTREE,
    KEY `idx_combination_id` (`combination_id`) USING BTREE
);
