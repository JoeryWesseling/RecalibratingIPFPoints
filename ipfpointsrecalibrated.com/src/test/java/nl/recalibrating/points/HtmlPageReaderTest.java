package nl.recalibrating.points;

import nl.recalibrating.points.exceptions.ResourceNotAvailableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class HtmlPageReaderTest {

    private HtmlPageReader reader;

    @BeforeEach
    void setUp() {
        reader = new HtmlPageReader();
    }

    @Test
    void testReadExistingFile() throws IOException, ResourceNotAvailableException {
        String content = reader.readFile("/pages/test.html");
        assertNotNull(content);
        assertTrue(content.contains("<html>")); // depends on your test file content
    }

    @Test
    void testReadNonExistentFileThrowsException() {
        assertThrows(ResourceNotAvailableException.class, () -> reader.readFile("/nonexistent.html"));
    }

    @Test
    void testGetContentTypeForHtml() {
        String type = reader.getContentType("index.html");
        assertEquals("text/html", type);
    }

    @Test
    void testGetContentTypeForCss() {
        String type = reader.getContentType("style.css");
        assertEquals("text/css", type);
    }

    @Test
    void testGetContentTypeFallback() {
        String type = reader.getContentType("data.unknown");
        assertEquals("application/octet-stream", type);
    }

    @Test
    void testGetLengthForExistingFile() throws ResourceNotAvailableException {
        String length = reader.getLength("/pages/test.html");
        assertTrue(Integer.parseInt(length) > 0);
    }

    @Test
    void testGetLengthForMissingFileThrowsException() {
        assertThrows(ResourceNotAvailableException.class, () -> reader.getLength("/missing.html"));
    }
}
