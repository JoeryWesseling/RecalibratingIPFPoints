package nl.recalibrating.points.exceptions;

public class RunTimeCustom extends RuntimeException {
    public RunTimeCustom(String message, Throwable cause) {
        super(message,cause);
    }
}
