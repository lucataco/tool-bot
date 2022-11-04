import React from "react";
import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Easily create custom GPT-3 tools"
        subtitle="Simply describe what you want your tool to do!"
        image="https://source.unsplash.com/collection/856079/800x600"
        ctaText="Create Tool"
        ctaLink="/create"
      />
    </LandingLayout>
  );
}