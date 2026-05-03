import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, Torus, Sphere } from "@react-three/drei";
import { ShieldCheck, Truck, Sparkle, ArrowRight, Star, Crown, Diamond } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// ================= 3D Diamond Ring Component =================
const DiamondRing = ({ position, scale, className }) => {
  const groupRef = useRef();
  const [direction] = useState(Math.random() > 0.5 ? 1 : -1);
  const [speed] = useState(0.001 + Math.random() * 0.003);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed * direction;
      groupRef.current.rotation.x += speed / 2;
      groupRef.current.position.y += Math.sin(Date.now() * 0.001 + Math.random()) * 0.001;
    }
  });

  return (
    <Float speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={0.6}>
      <group ref={groupRef} position={position} scale={scale} className={className}>
        <Torus args={[1.2, 0.15, 32, 100]}>
          <meshStandardMaterial color="#e6c27a" metalness={0.9} roughness={0.2} />
        </Torus>
        <Sphere args={[0.35, 32, 32]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#a0e6ff" metalness={0.8} roughness={0.1} />
        </Sphere>
      </group>
    </Float>
  );
};

// ================= Floating Sparkles / Stars =================
const FloatingIcon = ({ icon: Icon, size, top, left, delay }) => {
  const ref = useRef();
  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
  }, [delay]);
  return (
    <div ref={ref} className="absolute text-[#c9a24d]" style={{ top, left }}>
      <Icon size={size} weight="fill" />
    </div>
  );
};

// ================= Camera Parallax =================
const CameraController = () => {
  const { camera } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.x - 0.5) * 1.5 - camera.position.x;
    camera.position.y += (0.5 - mouse.y) * 1.5 - camera.position.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// ================= FAQ Item Component =================
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const answerRef = useRef();

  useEffect(() => {
    if (open) {
      gsap.to(answerRef.current, { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(answerRef.current, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
    }
  }, [open]);

  return (
    <div className="border-b border-[#ddd] py-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">{question}</p>
        <Diamond size={24} className={`transition-transform text-[#c9a24d] ${open ? "rotate-45" : ""}`} />
      </div>
      <div ref={answerRef} className="overflow-hidden h-0 opacity-0 mt-2">
        <p className="text-[#5f5f5f]">{answer}</p>
      </div>
    </div>
  );
};

// ================= Landing Page =================
const LandingPage = () => {
  const navigate = useNavigate();

  const heroTextRef = useRef();
  const aboutRef = useRef();
  const contactRef = useRef();

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1.2, ease: "power3.out" }
      );
    }

    // About section animation
    if (aboutRef.current) {
      gsap.fromTo(aboutRef.current, { opacity: 0, y: 60 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: { trigger: aboutRef.current, start: "top 80%" }
      });
    }

    // Contact section animation
    if (contactRef.current) {
      gsap.fromTo(contactRef.current, { opacity: 0, y: 60 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: { trigger: contactRef.current, start: "top 80%" }
      });
    }

  }, []);

  return (
    <div className="bg-[#fffafb] text-[#2b2b2b] overflow-hidden relative">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdecef]/90 to-transparent" />
        <div className="absolute right-0 top-0 w-full h-full lg:w-[55%]">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <Environment preset="studio" />
            <CameraController />
            <DiamondRing position={[-1.5, 0, -1]} scale={[0.8, 0.8, 0.8]} />
            <DiamondRing position={[1.2, 0.5, -0.5]} scale={[1, 1, 1]} />
            {/* Only show third ring if not mobile */}
            {!isMobile && <DiamondRing position={[0, -1, 0]} scale={[0.7, 0.7, 0.7]} />}
            <DiamondRing position={[-0.8, 1, 0.5]} scale={[0.6, 0.6, 0.6]} />
            <DiamondRing position={[1.5, -0.5, 0]} scale={[0.9, 0.9, 0.9]} />
          </Canvas>
        </div>

        {/* Floating sparkles */}
        <FloatingIcon icon={Sparkle} size={18} top="15%" left="10%" delay={0} />
        <FloatingIcon icon={Star} size={14} top="25%" left="50%" delay={0.5} />
        <FloatingIcon icon={Sparkle} size={16} top="40%" left="30%" delay={1} />
        <FloatingIcon icon={Star} size={12} top="60%" left="20%" delay={1.2} />
        <FloatingIcon icon={Sparkle} size={18} top="70%" left="65%" delay={0.8} />
        <FloatingIcon icon={Star} size={14} top="50%" left="80%" delay={1.5} />

        <div ref={heroTextRef} className="relative z-10 max-w-3xl px-6 mx-auto lg:mx-0 lg:pl-16 xl:pl-32">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-tight">
            Fine Jewellery <br /> Crafted to Endure
          </h1>
          <p className="mt-6 max-w-lg text-lg text-[#5f5f5f]">
            Discover refined jewellery inspired by Indian heritage, designed for the modern woman.
          </p>
          <div className="mt-10 flex gap-6">
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 rounded-full bg-[#2b2b2b] text-white flex items-center gap-2 hover:bg-[#111] transition"
            >
              Get Started <ArrowRight weight="bold" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT US ================= */}
      <section ref={aboutRef} className="py-32 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0" className="rounded-3xl shadow-2xl transform transition-transform duration-1000 hover:scale-105" alt="About Aravya Jewels" />
          <div className="relative">
            <Diamond size={36} weight="fill" className="text-[#c9a24d] absolute -top-8 animate-bounce" />
            <h2 className="font-serif text-4xl mt-10 text-gray-900">About Aravya Jewels</h2>
            <p className="mt-6 text-[#5f5f5f] leading-relaxed text-lg">
              Born from a passion for timeless elegance, Aravya Jewels is dedicated to crafting fine jewellery that endures through generations.
              We believe that every piece of jewellery tells a story—a story of love, celebration, and heritage.
            </p>
            <p className="mt-4 text-[#5f5f5f] leading-relaxed text-lg">
              Our artisans meticulously blend traditional craftsmanship with modern design sensibilities to create exclusive pieces that are
              both beautiful and meaningful. We source only the finest materials, ensuring that every creation meets our uncompromising standards of quality.
            </p>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate("/home");
              }}
              className="mt-10 px-10 py-4 rounded-full bg-[#2b2b2b] text-white flex items-center gap-2 hover:bg-[#111] transition"
            >
              Explore Collection <ArrowRight weight="bold" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= CONTACT US ================= */}
      <section ref={contactRef} className="py-24 bg-[#fdecef]" id="contact">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-gray-900">Contact Us</h2>
            <p className="mt-4 text-[#5f5f5f] text-lg">We would love to hear from you. Reach out for any inquiries.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Store */}
            <div className="bg-white rounded-3xl shadow-lg p-10 text-center flex flex-col items-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                <Diamond size={32} weight="fill" className="text-pink-400" />
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4">Our Store</h3>
              <p className="text-gray-600 leading-relaxed">
                Vidhuna road, Bharthana<br />
                Etawah, Uttarpradesh<br />
                206242
              </p>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-3xl shadow-lg p-10 text-center flex flex-col items-center hover:shadow-xl transition-shadow transform md:-translate-y-4 border-2 border-pink-100">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                <Sparkle size={32} weight="fill" className="text-pink-400" />
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4">Business Hours</h3>
              <p className="text-gray-600 leading-relaxed">
                Monday - Sunday:<br />10:00 AM - 7:00 PM
              </p>
            </div>

            {/* Get in Touch */}
            <div className="bg-white rounded-3xl shadow-lg p-10 text-center flex flex-col items-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                <Crown size={32} weight="fill" className="text-pink-400" />
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4">Get in Touch</h3>
              <p className="text-gray-600 leading-relaxed">
                aravyajewels@gmail.com<br />
                <span className="mt-2 block font-medium">+91 9258725997</span>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
