package nl.recalibrating.points.exceptions;

public class ResourceNotAvailableException extends Exception {

    public ResourceNotAvailableException(String fullFileName) {
        super(fullFileName + " is requested, but nog available.");
    }
}