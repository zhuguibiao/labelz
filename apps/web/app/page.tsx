"use client";

import { AnnotationHeader } from "@/components/header";
import HomePage from "@/components/home-page";

export default function Home() {
  return (
    <>
      <AnnotationHeader type="labelz" showBack={false} />
      <HomePage />
    </>
  );
}
