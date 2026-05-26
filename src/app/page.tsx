export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-areia px-6 py-16">
      <div className="max-w-md w-full">
        {/* Marca */}
        <div className="font-serif text-2xl text-costela mb-16 text-center">
          🌿 Mudinha
        </div>

        {/* Hero */}
        <h1 className="font-serif text-5xl text-costela leading-tight mb-6 text-center">
          plante hábitos.
          <br />
          colha sequências.
        </h1>

        <p className="text-stone-700 text-lg leading-relaxed mb-10 text-center">
          o app brasileiro de hábitos onde você não falha. só esquece de regar.
        </p>

        {/* CTA principal */}
        <button className="w-full bg-costela text-white rounded-full py-4 font-medium text-base mb-3 hover:bg-costela/90 transition-colors">
          plantar minha 1ª 🌱
        </button>

        <p className="text-center text-sm text-stone-500 mb-12">
          já tem conta?{" "}
          <a className="text-costela underline cursor-pointer">entrar</a>
        </p>

        {/* 3 motivos */}
        <div className="bg-offwhite rounded-3xl p-8 border border-stone-200">
          <h3 className="font-serif text-xl text-costela mb-5">3 motivos:</h3>
          <div className="space-y-4 text-sm">
            <p className="flex gap-3">
              <span className="text-lg">🌱</span>
              <span>cada hábito vira uma plantinha</span>
            </p>
            <p className="flex gap-3">
              <span className="text-lg">🤲</span>
              <span>quebrou? sem culpa. planta de novo.</span>
            </p>
            <p className="flex gap-3">
              <span className="text-lg">🇧🇷</span>
              <span>português de verdade, com humor.</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500 mt-8">
          sem ads · sem pegadinha · 100% grátis
        </p>
      </div>
    </main>
  );
}
