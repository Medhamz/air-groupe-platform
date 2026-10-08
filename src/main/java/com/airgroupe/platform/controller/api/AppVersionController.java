package com.airgroupe.platform.controller.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/app")
public class AppVersionController {

    @Value("${app.version.name:1.0.0}")
    private String versionName;

    @Value("${app.version.code:1}")
    private int versionCode;

    @Value("${app.version.apk-url:https://www.aes-sarlu.com/downloads/aes-sarlu-pro.apk}")
    private String apkUrl;

    @Value("${app.version.release-notes:Nouvelle version disponible.}")
    private String releaseNotes;

    @Value("${app.version.force-update:false}")
    private boolean forceUpdate;

    /**
     * Renvoie les informations de la dernière version de l'app Android.
     * Appelé au démarrage de l'app mobile.
     *
     * Réponse :
     * {
     *   "versionName": "1.0.1",
     *   "versionCode": 2,
     *   "apkUrl": "https://www.aes-sarlu.com/downloads/aes-sarlu-pro.apk",
     *   "releaseNotes": "Corrections de bugs + nouvelles fonctionnalités",
     *   "forceUpdate": false
     * }
     */
    @GetMapping("/version")
    public ResponseEntity<?> getLatestVersion() {
        System.out.println("========================================");
        System.out.println("=== GET /api/v1/app/version ===");
        System.out.println("Version = " + versionName + " (code " + versionCode + ")");
        System.out.println("========================================");

        return ResponseEntity.ok(Map.of(
                "versionName", versionName,
                "versionCode", versionCode,
                "apkUrl", apkUrl,
                "releaseNotes", releaseNotes,
                "forceUpdate", forceUpdate
        ));
    }
}