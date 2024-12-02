package com.viendong.webbanhang.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {

    private final Map<String, OTPData> otpCache = new HashMap<>();
    private final Random random = new Random();
    private final int otpExpiryMinutes = 5;

    public String generateOTP(String email) {
        String otp = String.format("%06d", random.nextInt(999999));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(otpExpiryMinutes);
        otpCache.put(email, new OTPData(otp, expiryTime));
        return otp;
    }

    public boolean validateOTP(String email, String otp) {
        OTPData otpData = otpCache.get(email);
        if (otpData == null) {
            return false;
        }

        if (otpData.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpCache.remove(email);
            return false;
        }

        return otpData.getOtp().equals(otp);
    }

    private static class OTPData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OTPData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}

