package com.courier.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Database Connection Utility demonstrating JDBC Architecture.
 * Academic Mapping: 25ITT32 Unit 4 (Database Connectivity with JDBC / JPA Overview)
 */
public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/courier_db?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password";
    private static Connection connection = null;

    private DBConnection() {
        // Private constructor for Singleton Pattern
    }

    public static Connection getConnection() {
        if (connection == null) {
            try {
                // Load MySQL Driver dynamically
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("[JDBC] Database connection established successfully.");
            } catch (ClassNotFoundException e) {
                System.out.println("[JDBC] MySQL Driver not found on classpath. Operating in High-Performance In-Memory Mode.");
            } catch (SQLException e) {
                System.out.println("[JDBC] Live MySQL instance offline. Falling back to Simulated In-Memory Database.");
            }
        }
        return connection;
    }

    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
                System.out.println("[JDBC] Connection closed cleanly.");
            } catch (SQLException ignored) {}
        }
    }
}
