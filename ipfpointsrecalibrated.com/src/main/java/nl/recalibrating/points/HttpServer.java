package nl.recalibrating.points;

import nl.recalibrating.points.exceptions.RunTimeCustom;

import java.io.IOException;
import java.net.ServerSocket;
import java.util.concurrent.Executors;
import java.util.logging.Logger;
import java.util.logging.Level;

public class HttpServer {

    private int tcpPort;
    volatile boolean isRunning = true;
    private static final Logger logger = Logger.getLogger(HttpServer.class.getName());


    public HttpServer(int tcpPort) {
        this.tcpPort = tcpPort;
    }

    public static void main(String[] args) {
        new HttpServer(8383).startServer();
    }

    public void startServer() {
        try (
                var serverSocket = new ServerSocket(this.tcpPort)
        ) {
            logger.log(Level.INFO, "Server accepting requests on port {0}", tcpPort);
            var threadPool = Executors.newFixedThreadPool(10);
            while (isRunning) {
                var acceptedSocket = serverSocket.accept();
                threadPool.execute(new ConnectionHandler(acceptedSocket));

            }
        } catch (IOException e) {
            throw new RunTimeCustom("Something went wrong",e);
        }
    }
}