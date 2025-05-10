import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // useNavigate burada ekleniyor
import AuthStore from "../store/AuthStore";
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import AnimatedPattern from "../components/AnimatedPattern";
import toast from "react-hot-toast";
import { register } from "../api/auth";  
import { motion } from "framer-motion";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setAuth } = AuthStore();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();  // useNavigate hook'u ekleniyor

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (
      !formData.email.trim() ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    )
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
      setIsSigningUp(true);

      try {
     
        const response = await register(formData);

       
        console.log(response);

        if (response && response.message === 'Kayıt başarılı!') {
          toast.success("Account created successfully!");

       
          setFormData({
            email: "",
            password: "",
          });

       
          setTimeout(() => {
            navigate('/login');  
          }, 1000); 
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } catch (error) {
        
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          if (message === "Kullanıcı zaten var.") {
            toast.error("This email is already registered");
          } else {
            toast.error(`Signup failed: ${message}`);
          }
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  return (
    <div className="min-h-[90vh] grid lg:grid-cols-2 bg-base-200">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get Started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div
              className="form-control"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label className="label-text font-medium">
                <span>Your Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="form-control"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <label className="label-text font-medium">
                <span>Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="*****"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          {/* Link to login */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary ml-1">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full h-full">
        <AnimatedPattern />
      </div>
    </div>
  );
};

export default Register;
