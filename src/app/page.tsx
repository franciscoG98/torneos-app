import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-5xl">Torneos App</h1>
      <h2 className="font-bold text-2xl">Crea torneos para tu club, segui el siguiente enlace</h2>

      <Link
        className="underline text-lg text-blue-500 hover:no-underline"
        href='/torneos/crear'
      >
        Crear Torneo
      </Link>
    </main>
  );
}
