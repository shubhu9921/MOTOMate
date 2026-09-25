package com.carewash.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendRegistrationOtp(String toEmail, String otp) {
        Context context = new Context();
        context.setVariable("otp", otp);
        context.setVariable("title", "Verify Your Email");
        context.setVariable("message", "Your REVORA verification code is:");
        context.setVariable("footerMsg", "If you did not request this code, you can safely ignore this email.");
        String htmlContent = templateEngine.process("otp-email", context);
        sendHtmlEmail(toEmail, "REVORA - Verify Your Email", htmlContent);
    }

    @Override
    public void sendForgotPasswordOtp(String toEmail, String otp) {
        Context context = new Context();
        context.setVariable("otp", otp);
        context.setVariable("title", "Password Reset OTP");
        context.setVariable("message", "Your REVORA password reset code is:");
        context.setVariable("footerMsg", "If you did not request a password reset, please secure your account.");
        String htmlContent = templateEngine.process("otp-email", context);
        sendHtmlEmail(toEmail, "REVORA - Password Reset", htmlContent);
    }

    @Override
    public void sendPasswordResetConfirmation(String toEmail) {
        Context context = new Context();
        context.setVariable("title", "Password Reset Successful");
        context.setVariable("message", "Your REVORA password has been successfully reset. If this was not you, please contact support immediately.");
        String htmlContent = templateEngine.process("info-email", context);
        sendHtmlEmail(toEmail, "REVORA - Password Reset Successful", htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log the error but don't crash, or rethrow as a custom exception
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}
