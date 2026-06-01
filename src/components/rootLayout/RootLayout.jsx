import React from "react";
import { Outlet } from "react-router";
import HomePage from "../../pages/HomePage";
import Header from "../Header";
import Navigation from "../Navigation";

export default function RootLayout(basePath) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header basePath={basePath} />
      <div className="flex min-h-[calc(100vh-92px)]">
        <Navigation />
        <main className="flex-1 p-6">
          <HomePage />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
