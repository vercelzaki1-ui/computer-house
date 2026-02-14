"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

type SlideData = {
  id: number
  titleFr: string
  titleAr: string
  subtitleFr: string
  subtitleAr: string
  badgeFr: string
  badgeAr: string
  imageSrc: string
  ctaFr: string
  ctaAr: string
}

const slides: SlideData[] = [
  {
    id: 1,
    titleFr: "Produits Apple",
    titleAr: "منتجات أبل",
    subtitleFr: "Originaux aux meilleurs prix",
    subtitleAr: "أصلية بأفضل الأسعار",
    badgeFr: "Garantie officielle",
    badgeAr: "ضمان رسمي",
    imageSrc: "https://tse2.mm.bing.net/th/id/OIP.RqDIPsG5aUfGH01xhj5dzgAAAA?w=474&h=316&rs=1&pid=ImgDetMain&o=7&rm=3,",
    ctaFr: "Découvrir",
    ctaAr: "اكتشف"
  },
  {
    id: 2,
    titleFr: "Setup Gaming",
    titleAr: "إعداد ألعاب",
    subtitleFr: "Claviers, Souris, Casques premium",
    subtitleAr: "كيبورد، ماوس، سماعات فاخرة",
    badgeFr: "Performance maximale",
    badgeAr: "أداء أقصى",
    imageSrc: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1920&q=90",
    ctaFr: "Explorer",
    ctaAr: "تصفح"
  },
  {
    id: 3,
    titleFr: "Caméras Pro",
    titleAr: "كاميرات احترافية",
    subtitleFr: "Pour créateurs et professionnels",
    subtitleAr: "للمبدعين والمحترفين",
    badgeFr: "Qualité supérieure",
    badgeAr: "جودة عالية",
    imageSrc: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920&q=90",
    ctaFr: "Voir plus",
    ctaAr: "المزيد"
  },
  {
    id: 4,
    titleFr: "Accessoires Tech",
    titleAr: "إكسسوارات تقنية",
    subtitleFr: "Tout pour votre setup parfait",
    subtitleAr: "كل ما تحتاجه لإعداد مثالي",
    badgeFr: "Plus de 1000 produits",
    badgeAr: "أكثر من 1000 منتج",
    imageSrc: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=1920&q=90",
    ctaFr: "Acheter",
    ctaAr: "اشتري"
  }
]

export function HeroSliderPerfect() {
  const { locale } = useLocale()
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]
  const isArabic = locale === "ar"

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          
          {/* Background Image */}
          <div className="absolute inset-0">
            <motion.img 
              src={slide.imageSrc}
              alt=""
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-8 md:pt-12 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white text-sm md:text-base font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>{isArabic ? slide.badgeAr : slide.badgeFr}</span>
              </div>
            </motion.div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex items-center justify-center px-6 md:px-12">
              <div className="text-center max-w-5xl">
                
                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-4 md:mb-6 leading-tight"
                >
                  {isArabic ? slide.titleAr : slide.titleFr}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-3xl lg:text-4xl text-white/95 mb-8 md:mb-12 font-light"
                >
                  {isArabic ? slide.subtitleAr : slide.subtitleFr}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link href="/shop">
                    <motion.button
                      className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 rounded-full bg-teal-500 text-white font-semibold text-base md:text-lg flex items-center justify-center gap-3 shadow-xl"
                      whileHover={{ scale: 1.05, backgroundColor: "#14b8a6" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{isArabic ? 'تسوق الآن' : 'Acheter maintenant'}</span>
                      <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
                    </motion.button>
                  </Link>
                  
                  <Link href="/brands">
                    <motion.button
                      className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 font-semibold text-base md:text-lg"
                      whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isArabic ? 'استكشف العلامات' : 'Explorer les marques'}
                    </motion.button>
                  </Link>
                </motion.div>

              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pb-10 md:pb-12 flex justify-center gap-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  className="relative group"
                >
                  <motion.div
                    className="h-1.5 md:h-2 rounded-full transition-all duration-500"
                    style={{
                      width: i === current ? '48px' : '12px',
                      backgroundColor: i === current ? '#14b8a6' : 'rgba(255,255,255,0.5)'
                    }}
                    whileHover={{ width: '48px', backgroundColor: '#14b8a6' }}
                  />
                </button>
              ))}
            </div>

          </div>

        </motion.div>
      </AnimatePresence>

      {/* Logo - Top Left */}
      <div className={`absolute top-8 md:top-12 ${isArabic ? 'right-6 md:right-12' : 'left-6 md:left-12'} z-30`}>
        <div className="text-white font-bold text-xl md:text-2xl lg:text-3xl drop-shadow-lg">
          COMPUTER HOUSE
        </div>
      </div>

    </div>
  )
}