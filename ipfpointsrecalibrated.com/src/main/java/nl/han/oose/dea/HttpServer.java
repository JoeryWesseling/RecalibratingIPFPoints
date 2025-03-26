package nl.han.oose.dea;

import java.io.IOException;
import java.net.ServerSocket;
import java.util.concurrent.Executors;

public class HttpServer {

    private int tcpPort;

    public HttpServer(int tcpPort) {
        this.tcpPort = tcpPort;
    }

    public static void main(String[] args) {
        new HttpServer(8383).startServer();
    }

    public void startServer() {
        try (
                var serverSocket = new ServerSocket(this.tcpPort);
        ) {
            System.out.println("Server accepting requests on port " + tcpPort);
            var threadPool = Executors.newFixedThreadPool(10);
            while (true) {
                var acceptedSocket = serverSocket.accept();
                threadPool.execute(new ConnectionHandler(acceptedSocket));

            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}