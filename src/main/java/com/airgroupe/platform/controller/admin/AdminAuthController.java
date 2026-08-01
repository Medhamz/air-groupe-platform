package com.airgroupe.platform.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminAuthController {

    @GetMapping("/login")
    public String login() {
        return "admin/login";   // Vue dans templates/admin/login.html
    }
}