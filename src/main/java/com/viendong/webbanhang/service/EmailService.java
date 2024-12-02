package com.viendong.webbanhang.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("thanhdat.dev38@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        Context context = new Context();
        context.setVariables(variables);
        String htmlContent = templateEngine.process(templateName, context);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
