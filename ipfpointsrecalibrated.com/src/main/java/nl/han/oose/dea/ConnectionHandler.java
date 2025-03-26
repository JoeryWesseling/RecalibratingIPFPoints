package nl.han.oose.dea;


import nl.han.oose.dea.exceptions.ResourceNotAvailableException;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

public class ConnectionHandler implements Runnable {

    private String method;
    private String resource;

    private static final String METHOD_GET = "GET";
    private static final String METHOD_POST = "POST";
    private static final String STATUS_405 = "405 Method Not Allowed";
    private static final String HTTP_STATUS_200 = "200 OK";
    private static final String HTTP_STATUS_404 = "404 NOT FOUND";


    private Socket socket;

    public ConnectionHandler(Socket socket) {
        this.socket = socket;
    }

    public void handle() {
        try {
            var inputStreamReader = new BufferedReader(
                    new InputStreamReader(socket.getInputStream(), StandardCharsets.US_ASCII));
            var outputStreamWriter = new BufferedWriter(
                    new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.US_ASCII));

            var startLine = parseRequest(inputStreamReader);

            if (startLine == null) {
                return;
            }
            if (METHOD_GET.equals(method)) {
                writeResponse(outputStreamWriter, resource);
            } else if (METHOD_POST.equals(method)) {
                handlePostRequest(inputStreamReader, outputStreamWriter);

            } else {
                writeErrorResponse(outputStreamWriter, STATUS_405);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void writeErrorResponse(BufferedWriter outPutStreamWriter, String status) throws IOException {
        String response = "HTTP/1.1 " + status + "\r\n" +
                "Content-Length: 0\r\n" +
                "Content-Type: text/plain\r\n\r\n";
        outPutStreamWriter.write(response);
        outPutStreamWriter.flush();
    }

    private void handlePostRequest(BufferedReader inputStreamReader, BufferedWriter outputStreamWriter) throws IOException {
        Map<String, String> headers = readHeaders(inputStreamReader);
        int contentLength = headers.containsKey("Content-Length") ? Integer.parseInt(headers.get("Content-Length")) : 0;

        char[] body = new char[contentLength];
        inputStreamReader.read(body, 0, contentLength);

        String requestBody = new String(body);
        System.out.println("Received POST data: " + requestBody);

        String response = "HTTP/1.1 200 OK\r\n" +
                "Content-Length: " + contentLength + "\r\n" +
                "Content-Type: text/plain\r\n\r\n" +
                requestBody;

        outputStreamWriter.write(response);
        outputStreamWriter.flush();
    }


    private Map<String, String> readHeaders(BufferedReader inputStreamReader) throws IOException {
        Map<String, String> headers = new HashMap<>();
        String line;
        while ((line = inputStreamReader.readLine()) != null && !line.isEmpty()) {
            String[] parts = line.split(": ", 2);
            if (parts.length == 2) {
                headers.put(parts[0], parts[1]);
            }
        }
        return headers;
    }

    private String parseRequest(BufferedReader inputStreamReader) throws IOException {
        var request = inputStreamReader.readLine();
        if (request == null || request.isEmpty()) return null;

        System.out.println("recieved request: " + request);

        String[] parts = request.split(" ");
        if (parts.length < 2) return null;

        this.method = parts[0];
        this.resource = parts[1];

        // ✅ Redirect root path to /index.html
        if (this.resource.equals("/")) {
            this.resource = "/index.html";
        }

        return request;
    }


    private void writeResponse(BufferedWriter outputStreamWriter, String resource) {
        System.out.println("Writing response for resource: " + resource);
        try {
            writeHeader(outputStreamWriter, resource);
            writeBody(outputStreamWriter, resource);
            outputStreamWriter.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void writeHeader(BufferedWriter outputStreamWriter, String resource) throws IOException {
        outputStreamWriter.write(generateHeader(resource));
        outputStreamWriter.newLine();
    }

    private void writeBody(BufferedWriter outputStreamWriter, String resource) throws IOException {
        var file = "\n";

        try {
            file = new HtmlPageReader().readFile(resource);
        } catch (ResourceNotAvailableException e) {
            System.out.println(e.getMessage());
        }

        outputStreamWriter.write(file);
        outputStreamWriter.newLine();
    }

    private String generateHeader(String resource) {
        var length = "0";
        var status = HTTP_STATUS_200;
        String contentType = "text/html";

        try {
            length = new HtmlPageReader().getLength(resource);
            contentType = new HtmlPageReader().getContentType(resource);
        } catch (ResourceNotAvailableException e) {
            status = HTTP_STATUS_404;
        }

        return "HTTP/1.1 " + status + "\r\n" +
                "Date: " + OffsetDateTime.now().format(DateTimeFormatter.RFC_1123_DATE_TIME) + "\r\n" +
                "Server: JERRY SERVER\r\n" +
                "Content-Length: " + length + "\r\n" +
                "Content-Type: " + contentType + "\r\n" +
                "Connection: keep-alive\r\n" +
                "Cache-Control: max-age=3600, public\r\n" +
                "\r\n";

    }

    @Override
    public void run() {
        handle();
    }
}