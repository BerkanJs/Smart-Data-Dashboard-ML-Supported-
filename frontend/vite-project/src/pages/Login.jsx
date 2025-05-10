import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import AuthStore from "../store/AuthStore"; 
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import AnimatedPattern from "../components/AnimatedPattern"; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setAuth } = AuthStore();  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
  
    try {
      const response = await login(formData);  
      const { token, user } = response;  
  
      setAuth(token);  // Token'ı store'a kaydet
      localStorage.setItem("token", token);  // Token'ı localStorage'a da kaydet
      toast.success("Login successful!");
  
      setTimeout(() => {
        navigate(`/dashboard/${user.id}`);  
      }, 2000); 
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid lg:grid-cols-2 bg-base-200">
      <div className="w-full h-full relative">
        <AnimatedPattern />
      </div>

      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <motion.h1
                className="2xl font-bold mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Login
              </motion.h1>
              <p className="text-base-content/60">
                Get logged in with your account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="form-control"
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
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="form-control"
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
                  className={`input input-bordered w-full pl-10`}
                  placeholder="*****"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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

            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don't you have an account yet?{" "}
              <Link to="/register" className="link link-primary ml-1">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
