import { useState, useEffect } from 'react';
import { ArrowRight, Code, Smartphone, Globe, Zap, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AstronicLanding = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <Globe className="w-12 h-12" />,
      title: 'Web Development',
      description: 'Modern, responsive websites and web applications built with cutting-edge technology.'
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for iOS and Android with native performance.'
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: 'Custom Software',
      description: 'Tailored software solutions to streamline your business operations.'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Digital Transformation',
      description: 'Modernize your business with cloud solutions and automation.'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Cybersecurity',
      description: 'Protect your digital assets with enterprise-grade security solutions.'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'IT Consulting',
      description: 'Expert guidance on technology strategy and implementation.'
    }
  ];

  const portfolio = [
    {
      title: 'HH Asia Tyre Booking System',
      category: 'Web Application',
      description: 'Complete online booking platform for 6-branch automotive service chain',
      image: '/screenshots/booking_system.png',
      link: '/book'
    },
    {
      title: 'E-Commerce Platform',
      category: 'Online Store',
      description: 'Full-featured e-commerce with inventory management',
      image: '/images/portfolio/ecommerce.jpg'
    },
    {
      title: 'Corporate Website',
      category: 'Web Design',
      description: 'Modern corporate website with CMS integration',
      image: '/images/portfolio/corporate.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ASTRONIC
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="hover:text-purple-400 transition-colors">Services</a>
              <a href="#portfolio" className="hover:text-purple-400 transition-colors">Portfolio</a>
              <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
              <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Back to HH Asia Tyre
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Digital Solutions
            <br />
            That Transform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We build modern web applications, mobile apps, and digital platforms that drive business growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Start Your Project <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#portfolio"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-purple-500/30 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-400">Comprehensive digital solutions for modern businesses</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all hover:transform hover:-translate-y-2"
              >
                <div className="text-purple-400 mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Portfolio</h2>
            <p className="text-xl text-gray-400">Projects that showcase our expertise</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((project, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-purple-500/20 hover:border-purple-500/50 transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                  <p className="text-gray-500">Project Screenshot</p>
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-400 mb-2">{project.category}</div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                  {project.link && (
                    <button
                      onClick={() => navigate(project.link)}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm font-semibold"
                    >
                      View Project <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About Astronic</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Astronic Digital is a technology company specializing in creating innovative digital solutions. 
            From web applications to mobile apps, we help businesses leverage technology to achieve their goals.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">30+</div>
              <div className="text-gray-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">5+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-xl text-gray-400">Ready to start your project? Get in touch with us.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Project Details</label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ASTRONIC
            </span>
          </div>
          <p className="text-gray-500">© 2026 Astronic Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AstronicLanding;
