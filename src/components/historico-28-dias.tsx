type Props = {
  dias: { data: string; regado: boolean }[];
};

export function Historico28Dias({ dias }: Props) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {dias.map(({ data, regado }) => {
        const ehHoje = data === formatarHoje();
        return (
          <div
            key={data}
            title={data}
            className={`aspect-square rounded-full transition-colors ${
              regado
                ? ehHoje
                  ? "bg-costela"
                  : "bg-brote"
                : "bg-stone-200"
            }`}
          />
        );
      })}
    </div>
  );
}

function formatarHoje(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
