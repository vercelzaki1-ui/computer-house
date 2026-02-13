"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, Cpu, Network, Shield } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

type SlideData = {
  id: number
  titleFr: string
  titleAr: string
  subtitleFr: string
  subtitleAr: string
  descFr: string
  descAr: string
  primaryColor: string
  secondaryColor: string
  bgGradient: string
  icon: any
  stats: { number: string; labelFr: string; labelAr: string; suffix?: string }[]
  features: { iconFr: string; iconAr: string; textFr: string; textAr: string }[]
}

const slides: SlideData[] = [
  {
    id: 1,
    titleFr: "Gaming",
    titleAr: "ألعاب",
    subtitleFr: "Extrême",
    subtitleAr: "متطرف",
    descFr: "Configurations sur mesure avec composants premium. Performance maximale garantie.",
    descAr: "تكوينات مخصصة مع مكونات متميزة. أداء أقصى مضمون.",
    primaryColor: "#6D28D9",
    secondaryColor: "#A78BFA",
    bgGradient: "linear-gradient(135deg, #F3E8FF 0%, #FAFAFA 50%, #EDE9FE 100%)",
    icon: Cpu,
    stats: [
      { number: "5090", labelFr: "RTX Series", labelAr: "سلسلة RTX" },
      { number: "240", labelFr: "Refresh Rate", labelAr: "معدل التحديث", suffix: "Hz" },
      { number: "96", labelFr: "RAM DDR5", labelAr: "ذاكرة DDR5", suffix: "GB" }
    ],
    features: [
      { iconFr: "⚡", iconAr: "⚡", textFr: "Overclocking Pro", textAr: "رفع تردد احترافي" },
      { iconFr: "❄️", iconAr: "❄️", textFr: "Watercooling 360mm", textAr: "تبريد مائي 360مم" },
      { iconFr: "💎", iconAr: "💎", textFr: "RGB Synchronisé", textAr: "إضاءة متزامنة" }
    ]
  },
  {
    id: 2,
    titleFr: "Réseau",
    titleAr: "شبكة",
    subtitleFr: "Intelligent",
    subtitleAr: "ذكية",
    descFr: "Infrastructure réseau fiber avec WiFi 7. Couverture nationale professionnelle.",
    descAr: "بنية تحتية للشبكة بالألياف مع WiFi 7. تغطية وطنية احترافية.",
    primaryColor: "#0891B2",
    secondaryColor: "#06B6D4",
    bgGradient: "linear-gradient(135deg, #ECFEFF 0%, #FAFAFA 50%, #CFFAFE 100%)",
    icon: Network,
    stats: [
      { number: "10", labelFr: "Fiber Speed", labelAr: "سرعة الألياف", suffix: "Gb/s" },
      { number: "58", labelFr: "Wilayas", labelAr: "ولايات" },
      { number: "24/7", labelFr: "Support", labelAr: "دعم" }
    ],
    features: [
      { iconFr: "📡", iconAr: "📡", textFr: "WiFi 7 Dernière Gen", textAr: "WiFi 7 أحدث جيل" },
      { iconFr: "🔌", iconAr: "🔌", textFr: "Installation Certifiée", textAr: "تركيب معتمد" },
      { iconFr: "🌍", iconAr: "🌍", textFr: "Couverture Nationale", textAr: "تغطية وطنية" }
    ]
  },
  {
    id: 3,
    titleFr: "Sécurité",
    titleAr: "أمن",
    subtitleFr: "Totale",
    subtitleAr: "كامل",
    descFr: "Surveillance intelligente 4K avec IA. Protection 24/7 de vos espaces.",
    descAr: "مراقبة ذكية 4K مع الذكاء الاصطناعي. حماية 24/7 لمساحاتك.",
    primaryColor: "#DB2777",
    secondaryColor: "#F472B6",
    bgGradient: "linear-gradient(135deg, #FCE7F3 0%, #FAFAFA 50%, #FDF2F8 100%)",
    icon: Shield,
    stats: [
      { number: "4K", labelFr: "Ultra HD", labelAr: "دقة فائقة" },
      { number: "AI", labelFr: "Detection", labelAr: "كشف ذكي" },
      { number: "∞", labelFr: "Cloud Storage", labelAr: "تخزين سحابي" }
    ],
    features: [
      { iconFr: "🎥", iconAr: "🎥", textFr: "Caméras 4K Pro", textAr: "كاميرات 4K احترافية" },
      { iconFr: "🤖", iconAr: "🤖", textFr: "Intelligence Artificielle", textAr: "ذكاء اصطناعي" },
      { iconFr: "☁️", iconAr: "☁️", textFr: "Backup Cloud", textAr: "نسخ احتياطي سحابي" }
    ]
  }
]

export function HeroSliderPro() {
  const { locale } = useLocale()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const parallaxX = useTransform(mouseX, [0, 1], [-15, 15])
  const parallaxY = useTransform(mouseY, [0, 1], [-15, 15])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]
  const isArabic = locale === "ar"
  const Icon = slide.icon

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1200 : -1200,
      opacity: 0,
      scale: 0.8,
      rotateY: dir > 0 ? 45 : -45
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1]
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 1200 : -1200,
      opacity: 0,
      scale: 0.8,
      rotateY: dir < 0 ? 45 : -45,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }
    })
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: slide.bgGradient }}
      onMouseMove={handleMouseMove}
    >
      
      {/* Animated grain texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: slide.primaryColor }}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{ background: slide.secondaryColor }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-8 lg:px-16 max-w-[1600px]">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                
                {/* Left Content */}
                <div className={`lg:col-span-7 space-y-10 ${isArabic ? 'lg:col-start-6 text-right' : 'text-left'}`}>
                  
                  {/* Badge */}
                  <motion.div
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full backdrop-blur-xl border-2"
                    style={{
                      background: `${slide.primaryColor}15`,
                      borderColor: `${slide.primaryColor}50`,
                      boxShadow: `0 8px 32px ${slide.primaryColor}20`
                    }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: slide.primaryColor }} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: slide.primaryColor }}>
                      Computer House
                    </span>
                  </motion.div>

                  {/* Title */}
                  <div className="space-y-3">
                    <motion.div
                      className="overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.h1
                        className="text-[clamp(4rem,12vw,10rem)] font-black leading-[0.85] tracking-tight"
                        style={{
                          fontFamily: "'Syne', 'Tajawal', sans-serif",
                          color: slide.primaryColor,
                          textShadow: `4px 4px 0 ${slide.secondaryColor}40`
                        }}
                        initial={{ y: '100%', rotateX: -90 }}
                        animate={{ y: 0, rotateX: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        {isArabic ? slide.titleAr : slide.titleFr}
                      </motion.h1>
                    </motion.div>
                    
                    <motion.div
                      className="overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.h2
                        className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] tracking-tight"
                        style={{
                          fontFamily: "'Syne', 'Tajawal', sans-serif",
                          WebkitTextStroke: `2px ${slide.primaryColor}`,
                          WebkitTextFillColor: 'transparent',
                        }}
                        initial={{ y: '100%', rotateX: -90 }}
                        animate={{ y: 0, rotateX: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        {isArabic ? slide.subtitleAr : slide.subtitleFr}
                      </motion.h2>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.p
                    className="text-xl lg:text-2xl max-w-2xl leading-relaxed font-medium"
                    style={{ 
                      color: '#1F2937',
                      fontFamily: "'Outfit', 'Cairo', sans-serif"
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {isArabic ? slide.descAr : slide.descFr}
                  </motion.p>

                  {/* Features */}
                  <motion.div
                    className={`flex flex-wrap gap-4 ${isArabic ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    {slide.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2.5 px-5 py-3 rounded-2xl backdrop-blur-xl"
                        style={{
                          background: `${slide.secondaryColor}20`,
                          border: `1.5px solid ${slide.secondaryColor}40`
                        }}
                        initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + i * 0.1, type: "spring" }}
                        whileHover={{ 
                          scale: 1.05,
                          background: `${slide.secondaryColor}30`,
                          borderColor: slide.secondaryColor
                        }}
                      >
                        <span className="text-lg">{isArabic ? feature.iconAr : feature.iconFr}</span>
                        <span className="text-sm font-semibold" style={{ color: slide.primaryColor }}>
                          {isArabic ? feature.textAr : feature.textFr}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <Link href="/shop">
                      <motion.button
                        className="group relative px-10 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${slide.primaryColor}, ${slide.secondaryColor})`,
                          boxShadow: `0 20px 60px ${slide.primaryColor}40`
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white"
                          initial={{ x: '-100%', skewX: -20 }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                          style={{ opacity: 0.1 }}
                        />
                        <span className="relative flex items-center gap-3">
                          {isArabic ? 'ابدأ الآن' : 'Commencer'}
                          <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isArabic ? 'rotate-180' : ''}`} />
                        </span>
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Right Stats */}
                <div className={`lg:col-span-5 ${isArabic ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <motion.div
                    className="relative"
                    style={{ x: parallaxX, y: parallaxY }}
                  >
                    {/* Large Icon */}
                    <motion.div
                      className="relative aspect-square mb-12"
                      initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ delay: 0.5, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="relative p-16 rounded-[4rem] backdrop-blur-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${slide.primaryColor}15, ${slide.secondaryColor}15)`,
                            border: `3px solid ${slide.primaryColor}30`,
                            boxShadow: `0 40px 100px ${slide.primaryColor}30, inset 0 0 60px ${slide.secondaryColor}20`
                          }}
                          animate={{
                            rotate: [0, 5, 0, -5, 0],
                          }}
                          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Icon className="w-48 h-48" style={{ color: slide.primaryColor, strokeWidth: 1.5 }} />
                        </motion.div>
                      </div>

                      {/* Floating particles */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 rounded-full"
                          style={{
                            background: slide.secondaryColor,
                            boxShadow: `0 0 20px ${slide.secondaryColor}`,
                            top: `${20 + Math.sin(i * 2) * 30}%`,
                            left: `${20 + Math.cos(i * 2) * 30}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                      {slide.stats.map((stat, i) => (
                        <motion.div
                          key={i}
                          className="relative p-6 rounded-3xl backdrop-blur-2xl overflow-hidden group"
                          style={{
                            background: `linear-gradient(135deg, ${slide.primaryColor}12, ${slide.secondaryColor}12)`,
                            border: `2px solid ${slide.primaryColor}25`,
                            boxShadow: `0 10px 40px ${slide.primaryColor}15`
                          }}
                          initial={{ opacity: 0, y: 50, rotateX: -45 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0 }}
                          transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
                          whileHover={{ 
                            y: -5,
                            boxShadow: `0 20px 60px ${slide.primaryColor}30`,
                            borderColor: slide.primaryColor
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100"
                            style={{
                              background: `linear-gradient(135deg, ${slide.primaryColor}08, ${slide.secondaryColor}08)`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <div className="relative">
                            <div className="text-4xl font-black mb-1"
                              style={{
                                fontFamily: "'Syne', 'Tajawal', sans-serif",
                                color: slide.primaryColor,
                                textShadow: `2px 2px 0 ${slide.secondaryColor}30`
                              }}>
                              {stat.number}
                            </div>
                            {stat.suffix && (
                              <div className="text-sm font-bold mb-2"
                                style={{ color: slide.secondaryColor }}>
                                {stat.suffix}
                              </div>
                            )}
                            <div className="text-xs font-semibold uppercase tracking-wider opacity-60"
                              style={{ color: slide.primaryColor }}>
                              {isArabic ? stat.labelAr : stat.labelFr}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Progress */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 z-40">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setDirection(i > current ? 1 : -1)
              setCurrent(i)
            }}
            className="group relative"
          >
            <motion.div
              className="h-1.5 rounded-full relative overflow-hidden"
              style={{
                width: i === current ? '60px' : '40px',
                background: i === current ? s.primaryColor : `${s.primaryColor}30`,
              }}
              whileHover={{ width: '60px' }}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-0 bg-white opacity-30"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 7, ease: "linear", repeat: Infinity }}
                />
              )}
            </motion.div>
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <motion.div
        className="absolute top-10 right-10 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, type: "spring" }}
      >
        <div className="flex items-baseline gap-2 font-black"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="text-5xl" style={{ color: slide.primaryColor }}>
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="text-2xl opacity-40" style={{ color: slide.primaryColor }}>
            / {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Outfit:wght@400;500;600;700&family=Cairo:wght@400;600;700&family=Tajawal:wght@700;800;900&display=swap');
      `}</style>
    </div>
  )
}