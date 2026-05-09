package com.codelog.rss;

import com.codelog.post.Post;
import com.codelog.post.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RssServiceImpl implements RssService {

    private static final DateTimeFormatter RSS_DATE_FORMAT =
            DateTimeFormatter.RFC_1123_DATE_TIME;

    private final PostRepository postRepository;

    public RssServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public String buildLatestPostsRss() {
        List<Post> latestPosts = postRepository.findTop10ByPublishedAtIsNotNullOrderByPublishedAtDesc();

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>")
                .append("<rss version=\"2.0\">")
                .append("<channel>")
                .append("<title>CodeLog - Son Yayinlanan Yazilar</title>")
                .append("<description>CodeLog platformundaki en guncel yazilar</description>")
                .append("<link>http://localhost:8080</link>");

        for (Post post : latestPosts) {
            xml.append("<item>")
                    .append("<title>").append(escapeXml(post.getTitle())).append("</title>")
                    .append("<description>").append(escapeXml(post.getContent())).append("</description>")
                    .append("<link>http://localhost:8080/posts/").append(post.getId()).append("</link>");

            if (post.getPublishedAt() != null) {
                xml.append("<pubDate>")
                        .append(post.getPublishedAt().atOffset(ZoneOffset.UTC).format(RSS_DATE_FORMAT))
                        .append("</pubDate>");
            }

            xml.append("</item>");
        }

        xml.append("</channel>")
                .append("</rss>");

        return xml.toString();
    }

    private String escapeXml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
