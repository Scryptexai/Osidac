"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

type Labels = {
  storeTitle: string;
  storeDescription: string;
  storeAction: string;
  storeAlt: string;
  missionsTitle: string;
  missionsDescription: string;
  missionsAction: string;
  missionsAlt: string;
  communityTitle: string;
  communityDescription: string;
  communityAction: string;
  communityAlt: string;
  previous: string;
  next: string;
  goToSlide: string;
};

export default function AppPromoCarousel({
  locale,
  labels,
}: {
  locale: string;
  labels: Labels;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    {
      image: "/images/app-store-slide.jpg",
      title: labels.storeTitle,
      description: labels.storeDescription,
      action: labels.storeAction,
      alt: labels.storeAlt,
      href: `/${locale}/app`,
    },
    {
      image: "/images/app-missions-slide.jpg",
      title: labels.missionsTitle,
      description: labels.missionsDescription,
      action: labels.missionsAction,
      alt: labels.missionsAlt,
      href: `/${locale}/app/misi`,
    },
    {
      image: "/images/app-community-slide.jpg",
      title: labels.communityTitle,
      description: labels.communityDescription,
      action: labels.communityAction,
      alt: labels.communityAlt,
      href: `/${locale}/app/jaringan`,
    },
  ];

  const updateActiveSlide = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const width = rail.clientWidth || 1;
    setActiveIndex(Math.max(0, Math.min(slides.length - 1, Math.round(rail.scrollLeft / width))));
  }, [slides.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", updateActiveSlide, { passive: true });
    return () => rail.removeEventListener("scroll", updateActiveSlide);
  }, [updateActiveSlide]);

  function goTo(index: number) {
    const rail = railRef.current;
    if (!rail) return;
    const nextIndex = (index + slides.length) % slides.length;
    rail.scrollTo({ left: nextIndex * rail.clientWidth, behavior: "smooth" });
    setActiveIndex(nextIndex);
  }

  return (
    <section aria-label={locale === "id" ? "Sorotan OSIDAC" : "OSIDAC highlights"} aria-roledescription="carousel" className="relative">
      <div
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[1.75rem] scroll-smooth"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") goTo(activeIndex - 1);
          if (event.key === "ArrowRight") goTo(activeIndex + 1);
        }}
        tabIndex={0}
      >
        {slides.map((slide, index) => (
          <article
            key={slide.image}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slides.length}`}
            className="market-ink-panel relative min-h-[250px] min-w-full snap-center overflow-hidden rounded-[1.5rem] border border-[#171d19]/20 sm:min-h-[280px]"
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171d19]/95 via-[#171d19]/65 to-[#171d19]/10" />
            <div className="relative z-10 flex min-h-[250px] max-w-xl flex-col justify-center p-6 text-white sm:min-h-[280px] sm:p-8">
              <p className="market-kicker text-[#d6f36a]">OSIDAC / FEATURED ROUTE</p>
              <h2 className="mt-2 max-w-lg text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                {slide.title}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="market-lime-button mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-4 text-sm font-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6f36a]"
              >
                {slide.action}
                <Icon name="arrowRight" size={17} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        aria-label={labels.previous}
        className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur transition hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-white sm:flex"
      >
        <Icon name="chevronLeft" size={21} />
      </button>
      <button
        type="button"
        onClick={() => goTo(activeIndex + 1)}
        aria-label={labels.next}
        className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur transition hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-white sm:flex"
      >
        <Icon name="chevronRight" size={21} />
      </button>

      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-2 backdrop-blur">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${labels.goToSlide} ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              activeIndex === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
