"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
/* eslint-disable @next/next/no-img-element */
import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Music2 } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { DEFAULT_STORE_SETTINGS, loadStoreSettings, toWhatsAppUrl } from "@/lib/store-settings"

export function Footer() {
  const { locale, t } = useLocale()
  const [settings, setSettings] = useState(DEFAULT_STORE_SETTINGS)

  useEffect(() => {
    setSettings(loadStoreSettings())
  }, [])

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bW70tCNYfU4dioNQ6iPrgQN9yQlB48.png"
                alt="ComputerHouse"
                width={36}
                height={36}
                className="rounded-md"
              />
              <div>
                <span className="block font-heading text-base font-bold text-foreground">
                  {settings.storeName}
                </span>
                <span className="block text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                  Maison Tech
                </span>
              </div>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {settings.description || t.footer.aboutDesc}
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                {settings.address}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {settings.phonePrimary}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {settings.phoneSecondary}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                {settings.contactEmail}
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
              {t.footer.quickLinks}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/shop", label: t.nav.shop },
                { href: "/build-your-pc", label: t.nav.buildPC },
                { href: "/shop?tab=deals", label: t.nav.deals },
                { href: "/contact", label: t.nav.contact },
                { href: "/support", label: t.nav.support },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
              {t.footer.customerService}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/support", label: t.footer.faq },
                { href: "/support#returns", label: t.footer.returns },
                { href: "/support#shipping", label: t.footer.shipping },
                { href: "/privacy", label: t.footer.privacy },
                { href: "/terms", label: t.footer.terms },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
              {t.footer.followUs}
            </h3>
            <div className="mb-6 flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook", href: settings.facebook },
                { icon: Instagram, label: "Instagram", href: settings.instagram },
                { icon: Music2, label: "TikTok", href: settings.tiktok },
                { icon: MessageCircle, label: "WhatsApp", href: toWhatsAppUrl(settings.whatsapp) },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <h3 className="mb-3 font-heading text-sm font-bold text-foreground">
              {locale === "fr" ? "Moyens de paiement" : "طرق الدفع"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Visa", "Mastercard", "CIB", "Edahabia"].map((method) => (
                <span
                  key={method}
                  className="flex h-8 items-center rounded-md border border-border bg-muted px-3 text-xs font-medium text-muted-foreground"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.storeName}. {t.footer.rights}.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
