package com.codelog.rss;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rss")
public class RssController {

    private final RssService rssService;

    public RssController(RssService rssService) {
        this.rssService = rssService;
    }

    @GetMapping(value = "/latest", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> latestPostsFeed() {
        return ResponseEntity.ok(rssService.buildLatestPostsRss());
    }
}
