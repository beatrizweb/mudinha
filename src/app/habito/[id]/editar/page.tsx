import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormEdicaoHabito } from "@/components/form-edicao-habito";
import type { Habito } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarHabitoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: habito } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .single();

  if (!habito) notFound();

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      <Link href={`/habito/${id}`} className="text-costela text-sm mb-6">
        ← editar hábito
      </Link>

      <FormEdicaoHabito habito={habito as Habito} />
    </main>
  );
}
