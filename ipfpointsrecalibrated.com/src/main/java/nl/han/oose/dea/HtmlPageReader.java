package nl.han.oose.dea;

import nl.han.oose.dea.exceptions.ResourceNotAvailableException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class HtmlPageReader {

    private static final Map<String, String> MIME_TYPES = new HashMap<>();

    static {
        MIME_TYPES.put(".css", "text/css");
        MIME_TYPES.put(".html", "text/html");
        MIME_TYPES.put(".js", "application/javascript");
        MIME_TYPES.put(".jpg", "image/jpeg");
        MIME_TYPES.put(".jpeg", "image/jpeg");
        MIME_TYPES.put(".png", "image/png");
        MIME_TYPES.put(".gif", "image/gif");
        MIME_TYPES.put(".svg", "image/svg+xml");
    }

    public String readFile(String filename) throws IOException, ResourceNotAvailableException {
        String fullPath = "pages" + filename;
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(fullPath);

        if (inputStream == null) {
            throw new ResourceNotAvailableException("File not found: " + fullPath);
        }

        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }

    public String getLength(String filename) throws ResourceNotAvailableException {
        String fullPath = "pages" + filename;
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(fullPath)) {
            if (inputStream == null) throw new ResourceNotAvailableException("File not found: " + fullPath);
            return String.valueOf(inputStream.readAllBytes().length);
        } catch (IOException e) {
            return "0";
        }
    }

    public String getContentType(String filename) {
        for (String extension : MIME_TYPES.keySet()) {
            if (filename.endsWith(extension)) {
                return MIME_TYPES.get(extension);
            }
        }
        return "application/octet-stream"; // default fallback
    }
}
