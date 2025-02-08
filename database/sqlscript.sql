CREATE DATABASE fullstackweb;
USE fullstackweb;
CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    org_name VARCHAR(100) NOT NULL
);
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL
);
CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    org_uuid CHAR(36),
    role_uuid CHAR(36),
    pos_name VARCHAR(100) NOT NULL,
    valid_to DATE,
    FOREIGN KEY (org_uuid) REFERENCES organizations(uuid),
    FOREIGN KEY (role_uuid) REFERENCES roles(uuid)
);
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    user_name VARCHAR(100) NOT NULL
);
CREATE TABLE user_positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_uuid CHAR(36),
    position_uuid CHAR(36),
    FOREIGN KEY (user_uuid) REFERENCES users(uuid),
    FOREIGN KEY (position_uuid) REFERENCES positions(uuid)
);

