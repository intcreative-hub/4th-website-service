import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeOffer from "@/components/WhatWeOffer";
import WhyChooseUs from "@/components/WhyChooseUs";
import HoursLocation from "@/components/HoursLocation";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WhatWeOffer />
      <WhyChooseUs />
      <HoursLocation />
      <SocialProof />
      <FAQ />
      <Footer />
    </main>
  );
}
