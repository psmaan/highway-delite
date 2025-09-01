import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/login/request-otp",
        { email },
        { withCredentials: true }
      );
      setStep("otp");
      setTimer(30);
      const countdown = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/login/verify",
        { email, otp },
        { withCredentials: true }
      );
      navigate("/dashboard");
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p className="text-gray-500 mb-6">
          Please login to continue to your account.
        </p>

        {step === "email" && (
          <>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={handleRequestOtp}
              disabled={loading}
              fullWidth
              variant="contained"
              className="mt-4"
            >
              {loading ? <CircularProgress size={20} /> : "Request OTP"}
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <TextField
              label="OTP"
              type={showOtp ? "text" : "password"}
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOtp(!showOtp)}
                      edge="end"
                    >
                      {showOtp ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              fullWidth
              variant="contained"
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              {loading ? <CircularProgress size={20} /> : "Verify OTP"}
            </Button>

            <div className="flex justify-between items-center mt-3">
              {timer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {timer}s
                </p>
              ) : (
                <Button size="small" onClick={handleRequestOtp}>
                  Resend OTP
                </Button>
              )}
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
