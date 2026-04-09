import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const slides = [
  {
    title: 'Registra tus gastos fácilmente',
    description: 'Lleva el control de cada peso que gastas con solo unos toques',
    image: 'https://images.unsplash.com/photo-1768228103038-98c2ea91a687?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBmaW5hbmNlJTIwc2F2aW5nJTIwbW9uZXl8ZW58MXx8fHwxNzc1NzQ0NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Controla tu presupuesto mensual',
    description: 'Define límites para cada categoría y mantente dentro de tu plan',
    image: 'https://images.unsplash.com/photo-1762427354397-854a52e0ded7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRnZXQlMjBwbGFubmluZyUyMG9yZ2FuaXphdGlvbnxlbnwxfHx8fDE3NzU3NDQ1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Visualiza tus estadísticas y ahorra mejor',
    description: 'Obtén insights claros sobre tus finanzas y mejora tus hábitos',
    image: 'https://images.unsplash.com/photo-1762427354251-f008b64dbc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBzdGF0aXN0aWNzJTIwZ3Jvd3RofGVufDF8fHx8MTc3NTc0NDU1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-6">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipForward size={20} className="mr-2" />
          Omitir
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-72 h-72 mb-8 rounded-3xl overflow-hidden">
              <ImageWithFallback
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 max-w-sm">
              {slides[currentSlide].title}
            </h2>
            <p className="text-muted-foreground max-w-sm">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next/Start Button */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl"
        >
          {currentSlide === slides.length - 1 ? 'Empezar' : 'Siguiente'}
          <ChevronRight size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
