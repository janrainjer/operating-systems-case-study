"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export interface AuthContextProps {
    children: React.ReactNode
  }

const AuthProvider   = ({ children }: AuthContextProps ) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>);
};

export default AuthProvider;