package nl.recalibrating.points;

import nl.recalibrating.points.exceptions.ResourceNotAvailableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.io.*;
import java.net.Socket;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ConnectionHandlerTest {

    private Socket mockSocket;
    private ByteArrayOutputStream outputStream;
    private ByteArrayInputStream inputStream;

    @BeforeEach
    void setup() throws IOException {
        mockSocket = mock(Socket.class);
        outputStream = new ByteArrayOutputStream();
    }

    @Test
    void testGetRequestWithRootRedirect() throws IOException {
        String input = "GET / HTTP/1.1\r\nHost: localhost\r\n\r\n";
        inputStream = new ByteArrayInputStream(input.getBytes());

        when(mockSocket.getInputStream()).thenReturn(inputStream);
        when(mockSocket.getOutputStream()).thenReturn(outputStream);

        var handler = new ConnectionHandler(mockSocket);
        handler.handle();

        String response = outputStream.toString();
        assertTrue(response.contains("HTTP/1.1 200 OK"));
        assertTrue(response.contains("Content-Type: text/html"));
    }

    @Test
    void testPostRequestHandling() throws IOException {
        String body = "name=test&email=test@example.com";
        String input = "POST /submit HTTP/1.1\r\nContent-Length: " + body.length() + "\r\n\r\n" + body;
        inputStream = new ByteArrayInputStream(input.getBytes());

        when(mockSocket.getInputStream()).thenReturn(inputStream);
        when(mockSocket.getOutputStream()).thenReturn(outputStream);

        var handler = new ConnectionHandler(mockSocket);
        handler.handle();

        String response = outputStream.toString();
        assertTrue(response.contains("HTTP/1.1 200 OK"));
        assertTrue(response.contains(body));
    }

    @Test
    void testUnsupportedMethod() throws IOException {
        String input = "PUT /data HTTP/1.1\r\n\r\n";
        inputStream = new ByteArrayInputStream(input.getBytes());

        when(mockSocket.getInputStream()).thenReturn(inputStream);
        when(mockSocket.getOutputStream()).thenReturn(outputStream);

        var handler = new ConnectionHandler(mockSocket);
        handler.handle();

        String response = outputStream.toString();
        assertTrue(response.contains("405 Method Not Allowed"));
    }

}
