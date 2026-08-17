import GlassDock from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import NotchNavbar from "../components/Navbar";
import Image from "../components/Image";
import IconCloud from "../components/UI/icon_cloud";
import ResearchBentoGrid from "../components/UI/research-bento-grid";

export default function Home() {
  return (
    <>
      <NotchNavbar />
      <Image />
      {/* <Hero /> */}
      {/* <IconCloud images={images} /> */}
      <About />

      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}
