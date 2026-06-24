export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <p
          className="text-xs font-inter font-semibold uppercase tracking-[0.2em] mb-6"
          style={{ color: "var(--color-terracotta)" }}
        >
          CMD Afstuderen 2026
        </p>

        <h1
          className="font-playfair text-5xl sm:text-6xl font-bold leading-tight mb-6"
          style={{ color: "var(--color-brown)" }}
        >
          Between{" "}
          <em className="italic" style={{ color: "var(--color-terracotta)" }}>
            Real
          </em>{" "}
          and Made
        </h1>

        <p
          className="font-inter text-base leading-relaxed mb-10"
          style={{ color: "var(--color-brown-light)" }}
        >
          Een onderzoek naar hoe kunstmatige intelligentie verandert hoe mensen
          muziek ervaren, waarderen en bespreken.
        </p>

        <div
          className="inline-block border rounded-full px-6 py-2.5 text-sm font-inter font-medium"
          style={{
            borderColor: "var(--color-beige-dark)",
            color: "var(--color-brown-mid)",
          }}
        >
          Binnenkort beschikbaar
        </div>

        <p
          className="mt-12 text-xs font-inter"
          style={{ color: "var(--color-brown-light)", opacity: 0.5 }}
        >
          Tibo Choquet · Hogeschool van Amsterdam
        </p>
      </div>
    </main>
  );
}
