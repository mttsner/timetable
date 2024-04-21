#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 8080
#define BUFFER_SIZE 1024

void handle_client(int client_socket) {
    char buffer[BUFFER_SIZE];
    int bytes_read;

    // Read the client's request
    bytes_read = read(client_socket, buffer, sizeof(buffer));
    if (bytes_read > 0) {
        // Parse the request (e.g., get the request method and path)
        char method[10], path[100];
        sscanf(buffer, "%s %s", method, path);

        // Serve the requested file
        char file_path[200];
        snprintf(file_path, sizeof(file_path), "build%s", path);
        if (strcmp(path, "/") == 0) {
            strcpy(file_path, "../index.html");
        }

        FILE *file = fopen(file_path, "r");
        if (file) {
            // Serve the file
            char file_buffer[BUFFER_SIZE];
            size_t n;
            // Set the correct MIME type based on file extension
            const char *mime_type;
            if (strstr(file_path, ".html")) {
                mime_type = "text/html";
            } else if (strstr(file_path, ".css")) {
                mime_type = "text/css";
            } else if (strstr(file_path, ".js")) {
                mime_type = "application/javascript";
            } else if (strstr(file_path, ".ts")) {
                mime_type = "application/typescript";
            } else if (strstr(file_path, ".tsx")) {
                mime_type = "application/typescript";
            } else {
                mime_type = "text/plain";
            }

            // Send HTTP headers
            char response_header[BUFFER_SIZE];
            snprintf(response_header, BUFFER_SIZE,
                     "HTTP/1.1 200 OK\r\n"
                     "Content-Type: %s\r\n"
                     "Connection: close\r\n"
                     "\r\n", mime_type);
            write(client_socket, response_header, strlen(response_header));

            // Send the file content
            while ((n = fread(file_buffer, 1, sizeof(file_buffer), file)) > 0) {
                write(client_socket, file_buffer, n);
            }

            fclose(file);
        } else {
            // Send a 404 Not Found response if the file is not found
            const char *response =
                "HTTP/1.1 404 Not Found\r\n"
                "Content-Type: text/html\r\n"
                "Connection: close\r\n"
                "\r\n"
                "<html><body><h1>404 Not Found</h1></body></html>";
            write(client_socket, response, strlen(response));
        }
    }

    // Close the connection
    close(client_socket);
}


int main() {
    int server_socket, client_socket;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_addr_len = sizeof(client_addr);

    // Create a socket
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == -1) {
        perror("Failed to create socket");
        exit(EXIT_FAILURE);
    }

    // Configure the server address
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY; // Bind to any local address
    server_addr.sin_port = htons(PORT);

    // Bind the socket to the address and port
    if (bind(server_socket, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1) {
        perror("Failed to bind socket");
        close(server_socket);
        exit(EXIT_FAILURE);
    }

    // Listen for incoming connections
    if (listen(server_socket, 10) == -1) {
        perror("Failed to listen on socket");
        close(server_socket);
        exit(EXIT_FAILURE);
    }

    printf("Server is listening on port %d\n", PORT);

    // Accept and handle incoming connections
    while (1) {
        // Accept a new client connection
        client_socket = accept(server_socket, (struct sockaddr *)&client_addr, &client_addr_len);
        if (client_socket == -1) {
            perror("Failed to accept client connection");
            continue;
        }

        // Handle the client request
        handle_client(client_socket);
    }

    // Close the server socket
    close(server_socket);

    return 0;
}