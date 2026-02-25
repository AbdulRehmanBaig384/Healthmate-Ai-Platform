import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {Heart,Upload,Activity,FileText,Brain,Shield,Users,Star,ArrowRight,CheckCircle,} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const { t, isUrdu } = useLanguage();
  const features = [
    {
      icon: Brain,
      title: isUrdu ? "AI-Powered Analysis" : "AI-Powered Analysis",
      description: isUrdu
        ? "Gemini AI se apke medical reports ka detailed analysis"
        : "Detailed analysis of your medical reports using Gemini AI",
    },
    {
      icon: Upload,
      title: isUrdu ? "Easy Upload" : "Easy Upload",
      description: isUrdu
        ? "PDF aur images easily upload karein"
        : "Upload PDFs and images with ease",
    },
    {
      icon: Activity,
      title: isUrdu ? "Vitals Tracking" : "Vitals Tracking",
      description: isUrdu
        ? "BP, Sugar, Weight sab track karein"
        : "Track BP, Sugar, Weight and more",
    },
    {
      icon: Shield,
      title: isUrdu ? "Secure & Private" : "Secure & Private",
      description: isUrdu
        ? "Aapka data completely secure hai"
        : "Your data is completely secure",
    },
  ];

  const benefits = [
    isUrdu
      ? "Medical reports ka instant analysis"
      : "Instant medical report analysis",
    isUrdu
      ? "Bilingual support (English/Urdu)"
      : "Bilingual support (English/Urdu)",
    isUrdu
      ? "Health tips aur recommendations"
      : "Health tips and recommendations",
    isUrdu
      ? "Doctor questions generate karta hai"
      : "Generates questions for doctors",
    isUrdu ? "Timeline view of reports" : "Timeline view of reports",
    isUrdu ? "Mobile responsive design" : "Mobile responsive design",
  ];

  return (
    <div className="min-h-screen">
      {/* hero section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
        {/* background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />

        {/* floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-20 h-20 rounded-full top-20 left-10 bg-primary-200/30 blur-xl"/>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-32 h-32 rounded-full bottom-20 right-10 bg-secondary-200/30 blur-xl"/>
        </div>
        <div className="relative z-10 px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8">
            <div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 border rounded-full bg-white/80 backdrop-blur-sm border-white/20">
              <Heart className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">
                {isUrdu
                  ? "AI-Powered Health Companion"
                  : "AI-Powered Health Companion"}
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold md:text-7xl">
              <span className="text-gradient">HealthMate</span>
            </h1>

            <p className="mb-4 text-xl text-gray-600 md:text-2xl">
              {isUrdu ? "Sehat ka Smart Dost" : "Sehat ka Smart Dost"}
            </p>

            <p className="max-w-3xl mx-auto mb-8 text-lg text-gray-500">
              {isUrdu
                ? "AI technology se apke medical reports ko analyze karein, health tips paayein, aur apni health ko better banayein. Gemini AI ke saath smart health tracking."
                : "Analyze your medical reports with AI technology, get health tips, and improve your health. Smart health tracking with Gemini AI."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register"
              className="flex items-center px-8 py-4 space-x-2 text-lg btn-primary group">
              <span>{isUrdu ? "Start Free" : "Start Free"}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link to="/login" className="px-8 py-4 text-lg btn-secondary">
              {isUrdu ? "Already have account?" : "Already have account?"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* features collections section */}
      <section className="py-20 bg-white/50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {isUrdu ? "Powerful Features" : "Powerful Features"}
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {isUrdu
                ? "HealthMate ke saath apni health ko smart way mein manage karein"
                : "Manage your health the smart way with HealthMate"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 text-center card card-hover" >
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 gradient-primary rounded-2xl">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {isUrdu
                  ? "Kyun choose karein HealthMate?"
                  : "Why Choose HealthMate?"}
              </h2>
              <p className="mb-8 text-xl text-white/90">
                {isUrdu
                  ? "AI technology aur modern design ke saath, health management ko easy banayein"
                  : "Make health management easy with AI technology and modern design"}
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3">
                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-300" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative">
              <div className="p-8 border card bg-white/10 backdrop-blur-sm border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-white/20">
                    <Star className="w-12 h-12 text-yellow-300" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">
                    {isUrdu ? "AI-Powered Insights" : "AI-Powered Insights"}
                  </h3>
                  <p className="mb-6 text-white/90">
                    {isUrdu
                      ? "Gemini AI se detailed analysis aur personalized recommendations"
                      : "Detailed analysis and personalized recommendations with Gemini AI"}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">99%</div>
                      <div className="text-sm text-white/80">
                        {isUrdu ? "Accuracy" : "Accuracy"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-sm text-white/80">
                        {isUrdu ? "Available" : "Available"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">2</div>
                      <div className="text-sm text-white/80">
                        {isUrdu ? "Languages" : "Languages"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {isUrdu ? "Ready to start?" : "Ready to get started?"}
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              {isUrdu
                ? "Apni health journey start karein aur AI ke saath smart health management karein"
                : "Start your health journey and manage your health smartly with AI"}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/register"
                className="flex items-center justify-center px-8 py-4 space-x-2 text-lg btn-primary group" >
                <span>
                  {isUrdu ? "Free Account Banayein" : "Create Free Account"}
                </span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="px-8 py-4 text-lg btn-ghost">
                {isUrdu ? "Login Karein" : "Login Now"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
