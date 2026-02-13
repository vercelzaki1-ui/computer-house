"use client"

const brandNames = [
  "NVIDIA", "AMD", "Intel", "ASUS", "MSI", "Corsair", "Logitech",
  "Samsung", "Canon", "TP-Link", "LG", "Hikvision", "HP", "Dell",
  "Lenovo", "Gigabyte",
]

export function BrandMarquee() {
  return (
    <section className="border-y border-border bg-card py-6 overflow-hidden" aria-label="Brand partners">
      <div className="relative">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...brandNames, ...brandNames].map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="mx-6 flex h-10 shrink-0 items-center px-4 sm:mx-8"
            >
              <span className="text-lg font-bold tracking-wider text-muted-foreground/40 transition-colors duration-300 hover:text-primary sm:text-xl">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
