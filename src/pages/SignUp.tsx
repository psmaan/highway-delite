import { useState, useEffect, useRef } from "react";
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
import signupbg from './../../public/assets/signup-image.png';
import hdlogo from './../../public/assets/hd-logo.png';

export default function SignUp() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // clear timer on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startTimer = () => {
    setTimer(30);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleRequestOtp = async () => {
    if (!name || !dob || !email) {
      alert("Please fill in all fields before requesting OTP");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signup/request-otp`,
        { name, dob, email },
        { withCredentials: true }
      );
      setOtpRequested(true);
      startTimer();
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signup/verify`,
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
    <div className="flex h-screen bg-gray-50 py-8 items-center">
      {/* Left side - form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo + Heading */}
          <div className="flex items-center gap-2 mb-8">
            <img src={hdlogo} className="w-6 h-6" />
            <span className="text-lg font-semibold">HD</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Sign up</h1>
          <p className="text-gray-500 mb-6">
            Sign up to enjoy the feature of HD
          </p>

          {/* Always show form fields */}
          <TextField
            label="Your Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        {!otpRequested && (
                  <Button
                    onClick={handleRequestOtp}
                    fullWidth
                    variant="contained"
                    className="mt-4"
                  >
                    Get OTP
                  </Button>
        )}

          {/* OTP Section - appears below form */}
          {otpRequested && (
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
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - image */}
      <div className="hidden md:flex w-1/2 max-w-[801px] h-full mr-8 items-center justify-center rounded-[40px] overflow-hidden">
        <img
          src={signupbg}
          alt="Background"
          className="rounded-[20px] object-contain h-full"
        />
      </div>
    </div>
  );
}
