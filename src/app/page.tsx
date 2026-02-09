import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import About from "@/components/About";
import CourseCarousel from "@/components/CourseCarousel";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Partners />
      <About />
      <CourseCarousel />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Contact />
    </main>
  );
}
