"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { login, LoginActionState } from "@/services/admin/authService";

const initialState: LoginActionState = {
  success: false,
  message: "",
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-brand text-white rounded-xl font-medium hover:bg-brand-hover active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
    >
      {pending ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
        />
      ) : (
        "Masuk ke Dashboard"
      )}
    </button>
  );
};

interface LoginFormProps {
  storeName?: string;
}

export const LoginForm = ({ storeName = "Fleuriste" }: LoginFormProps) => {
  const [state, formAction] = useActionState<LoginActionState, FormData>(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6 relative overflow-hidden font-inter">
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#B76E79] opacity-5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-brand/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand mb-2">
            {storeName}
          </h1>
          <p className="text-sm text-gray-500 font-sans">Admin Workspace</p>
        </div>

        {state.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center font-medium">
            {state.message}
          </div>
        )}

        <form action={formAction}>
          <Input
            label="Email/Username"
            name="email"
            type="text"
            variant="outline"
            placeholder="admin@fleuriste.com"
            defaultValue={state.inputs?.email || ""}
            error={state.errors?.email?.[0]}
            className="rounded-xl bg-white/50"
          />

          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outline"
            placeholder="••••••••"
            error={state.errors?.password?.[0]}
            className="rounded-xl bg-white/50"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          <SubmitButton />
        </form>
      </motion.div>
    </div>
  );
};
