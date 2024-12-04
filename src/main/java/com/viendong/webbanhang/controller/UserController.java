package com.viendong.webbanhang.controller;

import com.viendong.webbanhang.model.User;
import com.viendong.webbanhang.service.OTPService;
import com.viendong.webbanhang.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private OTPService otpService;

    @GetMapping("/")
    public String login() {
        return "users/login";
    }

    @GetMapping("/register")
    public String register(@NotNull Model model) {
        model.addAttribute("user", new User());
        return "users/register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("user") User user,
            @NotNull BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {
            var errors = bindingResult.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .toArray(String[]::new);
            model.addAttribute("errors", errors);
            return "users/register";
        }
        userService.save(user);
        userService.setDefaultRole(user.getUsername());
        return "redirect:/";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "users/forgot-password";
    }

    @PostMapping("/forgot-password")
    public String sendOtp(@RequestParam String email, HttpSession session, RedirectAttributes redirectAttributes) {
        String otp = otpService.generateOTP(email);
        String name = userService.getNameByEmail(email);


        if (name == null) {
            redirectAttributes.addFlashAttribute("message", "Người dùng không tồn tại.");
            return "redirect:/forgot-password";
        }
        else {
            userService.sendPasswordResetEmail(email, otp, name);
        }

        session.setAttribute("forgotPasswordEmail", email);
        redirectAttributes.addFlashAttribute("message", "OTP đã được gửi thành công. Vui lòng kiểm tra.");
        return "redirect:/verify-otp";
    }

    @GetMapping("/verify-otp")
    public String verifyOtp(HttpSession session, RedirectAttributes redirectAttributes, Model model) {
        String email = (String) session.getAttribute("forgotPasswordEmail");
        String name = userService.getNameByEmail(email);

        if (email == null) {
            redirectAttributes.addFlashAttribute("message", "Phiên làm việc đã hết hạn. Vui lòng thử lại.");
            return "redirect:/forgot-password";
        }

        model.addAttribute("email", email);
        model.addAttribute("name", name);

        return "users/verify-otp";
    }

    @PostMapping("/verify-otp")
    public String verifyOtpAndChangePassword(
            @RequestParam String otp,
            @RequestParam String newPassword,
            HttpSession session, RedirectAttributes redirectAttributes) {

        String email = (String) session.getAttribute("forgotPasswordEmail");

        if (email == null) {
            redirectAttributes.addFlashAttribute("message", "Phiên làm việc đã hết hạn. Vui lòng thử lại.");
            return "redirect:/verify-otp";
        }

        String name = userService.getNameByEmail(email);

        if (name == null) {
            redirectAttributes.addFlashAttribute("message", "Người dùng không tồn tại.");
            return "redirect:/verify-otp";
        }

        if (!otpService.validateOTP(email, otp)) {
            redirectAttributes.addFlashAttribute("message", "Mã OTP không hợp lệ hoặc đã hết hạn.");
            return "redirect:/verify-otp";
        }

        boolean updated = userService.updatePassword(email, newPassword);
        if (!updated) {
            redirectAttributes.addFlashAttribute("message", "Không thể cập nhật mật khẩu. Vui lòng thử lại.");
            return "redirect:/verify-otp";
        }

        session.removeAttribute("forgotPasswordEmail");
        redirectAttributes.addFlashAttribute("message", "Mật khẩu của bạn đã được cập nhật thành công.");
        return "redirect:/";
    }
}
