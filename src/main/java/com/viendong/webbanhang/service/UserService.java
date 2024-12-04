package com.viendong.webbanhang.service;

import com.viendong.webbanhang.Role;
import com.viendong.webbanhang.model.User;
import com.viendong.webbanhang.repository.IRoleRepository;
import com.viendong.webbanhang.repository.IUserRepository;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional
public class UserService implements UserDetailsService {
    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
        Optional<User> existingUser = userRepository.findById(user.getId());
        if (existingUser.isPresent()) {
            // Cập nhật thông tin người dùng và lưu lại
            User updatedUser = existingUser.get();
            updatedUser.setUsername(user.getUsername());
            updatedUser.setEmail(user.getEmail());
            updatedUser.setPhone(user.getPhone());
            // Lưu đối tượng đã cập nhật vào cơ sở dữ liệu
            return userRepository.save(updatedUser);
        } else {
            throw new RuntimeException("User not found with id " + user.getId());
        }
    }
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public void save(@NotNull User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepository.save(user);
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public void setDefaultRole(String username) {
        userRepository.findByUsername(username).ifPresentOrElse(user -> {
            user.getRoles().add(roleRepository.findRoleById(Role.USER.value));
            userRepository.save(user);
        }, () -> {
            throw new UsernameNotFoundException("User not found");
        });
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPassword()).authorities(user.getAuthorities())
                .accountExpired(!user.isAccountNonExpired()).accountLocked(!user.isAccountNonLocked())
                .credentialsExpired(!user.isCredentialsNonExpired()).disabled(!user.isEnabled()).build();
    }

    public Optional<User> findByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }

    public boolean sendPasswordResetEmail(String userEmail, String otp, String name) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("userEmail", userEmail);
        variables.put("otp", otp);
        variables.put("name", name);

        try {
            emailService.sendHtmlEmail(
                    userEmail,
                    "Thay Đổi Mật Khẩu",
                    "mail/password-reset",
                    variables);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return true;
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public boolean updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public String getNameByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(User::getUsername).orElse(null);
    }
}
