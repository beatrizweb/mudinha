import Link from "next/link";

type Aba = "jardim" | "conquistas" | "perfil";

const NAV: { aba: Aba; emoji: string; label: string; href: string }[] = [
  { aba: "jardim", emoji: "🏠", label: "jardim", href: "/jardim" },
  { aba: "conquistas", emoji: "🏆", label: "conquistas", href: "/conquistas" },
  { aba: "perfil", emoji: "👤", label: "perfil", href: "/perfil" },
];

export function NavInferior({ ativa }: { ativa: Aba }) {
  return (
    <nav className="bg-white border-t border-stone-200 py-3 px-2 flex justify-around -mx-6 mt-auto sticky bottom-0 z-10">
      {NAV.map((item) => {
        const eAtiva = ativa === item.aba;
        return (
          <Link
            key={item.aba}
            href={item.href}
            className={`text-center py-1 px-4 rounded-xl transition-colors ${
              eAtiva ? "" : "hover:bg-areia"
            }`}
          >
            <div className={`text-xl ${eAtiva ? "" : "opacity-50"}`}>
              {item.emoji}
            </div>
            <div
              className={`text-xs mt-0.5 ${
                eAtiva ? "text-costela font-medium" : "text-stone-500"
              }`}
            >
              {item.label}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
