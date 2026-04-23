"use client";

import React, { useCallback } from "react";
import { useTorneo } from "@/context/torneoContext";
import type { Partido } from "@/types/torneo";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TablaPartidosProps = {
  soloLectura?: boolean;
};

function leerPuntosPatch(
  p: Partido,
  s1: string,
  s2: string,
): Pick<Partido, "resultado"> | null {
  if (p.fase !== "zona" || !p.pareja1Id || !p.pareja2Id) return null;
  const t1 = s1.trim();
  const t2 = s2.trim();
  if (t1 === "" && t2 === "") return { resultado: undefined };
  const n1 = Number.parseInt(t1, 10);
  const n2 = Number.parseInt(t2, 10);
  if (Number.isNaN(n1) || Number.isNaN(n2)) return null;
  let ganadorId = "";
  if (n1 > n2) ganadorId = p.pareja1Id;
  else if (n2 > n1) ganadorId = p.pareja2Id;
  return {
    resultado: {
      ganadorId,
      puntosPareja1: n1,
      puntosPareja2: n2,
    },
  };
}

const TablaPartidos = ({ soloLectura = false }: TablaPartidosProps) => {
  const { state, dispatch } = useTorneo();
  const { partidos } = state;

  const onBlurFilaZona = useCallback(
    (p: Partido, tr: HTMLTableRowElement | null) => {
      if (!tr) return;
      const inputs = tr.querySelectorAll<HTMLInputElement>("input[type='number']");
      const a = inputs[0]?.value ?? "";
      const b = inputs[1]?.value ?? "";
      const patch = leerPuntosPatch(p, a, b);
      if (patch) dispatch({ type: "UPDATE_PARTIDO", payload: { id: p.id, patch } });
    },
    [dispatch],
  );

  if (partidos.length === 0) {
    return <p className="text-gray-500 text-center">No hay partidos para mostrar</p>;
  }

  const deZona = partidos.filter((p) => p.fase === "zona");
  const deElim = partidos.filter((p) => p.fase === "eliminacion");

  return (
    <div className="flex flex-col gap-8">
      <ListadoSeccion
        titulo="Fase de zona"
        partidos={deZona}
        soloLectura={soloLectura}
        columnaLugar="Zona / Ronda"
        onBlurFilaZona={onBlurFilaZona}
      />
      {deElim.length > 0 ? (
        <ListadoSeccion
          titulo="Eliminación"
          partidos={deElim}
          soloLectura={true}
          columnaLugar="Ronda"
        />
      ) : null}
    </div>
  );
};

function ListadoSeccion({
  titulo,
  partidos,
  soloLectura,
  onBlurFilaZona,
  columnaLugar,
}: {
  titulo: string;
  partidos: Partido[];
  soloLectura: boolean;
  onBlurFilaZona?: (p: Partido, tr: HTMLTableRowElement | null) => void;
  columnaLugar?: string;
}) {
  if (partidos.length === 0) return null;
  const readOnlyFila = soloLectura || !onBlurFilaZona;
  const colLugar = Boolean(columnaLugar);

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-center">{titulo}</h4>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Cat</TableHead>
              {colLugar ? (
                <TableHead className="hidden sm:table-cell">{columnaLugar}</TableHead>
              ) : null}
              <TableHead>Partido</TableHead>
              <TableHead className="w-20">P1</TableHead>
              <TableHead className="w-20">P2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partidos.map((partido, idx) => {
              const r = partido.resultado;
              const editarZona = !readOnlyFila && partido.fase === "zona" && partido.pareja1Id && partido.pareja2Id;
              const labelLugar =
                partido.fase === "zona" ? (partido.zona ?? "—") : (partido.ronda ?? "—");
              return (
                <TableRow
                  key={`${String(partido.id)}-${r?.puntosPareja1 ?? ""}-${r?.puntosPareja2 ?? ""}`}
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{partido.categoria}</TableCell>
                  {colLugar ? (
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {labelLugar}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <span className="text-sm block whitespace-normal">{partido.pareja1}</span>
                    <span className="text-xs text-muted-foreground"> vs </span>
                    <span className="text-sm block whitespace-normal">{partido.pareja2}</span>
                  </TableCell>
                  <TableCell>
                    {editarZona ? (
                      <Input
                        className="h-8"
                        type="number"
                        min={0}
                        defaultValue={r !== undefined ? r.puntosPareja1 : ""}
                        onBlur={(e) => onBlurFilaZona?.(partido, e.currentTarget.closest("tr"))}
                      />
                    ) : (
                      <span className="text-sm tabular-nums">
                        {r ? r.puntosPareja1 : ""}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editarZona ? (
                      <Input
                        className="h-8"
                        type="number"
                        min={0}
                        defaultValue={r !== undefined ? r.puntosPareja2 : ""}
                        onBlur={(e) => onBlurFilaZona?.(partido, e.currentTarget.closest("tr"))}
                      />
                    ) : (
                      <span className="text-sm tabular-nums">
                        {r ? r.puntosPareja2 : ""}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TablaPartidos;
