"use client";

import { useMemo } from "react";
import type { Pareja } from "@/types/torneo";
import type { Partido } from "@/types/torneo";
import { estadisticasZona, partidosDeZona } from "@/lib/estadisticasZona";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TablaPosicionesZonaProps = {
  parejas: Pareja[];
  zonaId: string;
  partidos: Partido[];
};

export default function TablaPosicionesZona({ parejas, zonaId, partidos }: TablaPosicionesZonaProps) {
  const filas = useMemo(
    () => estadisticasZona(parejas, partidosDeZona(partidos, zonaId)),
    [parejas, zonaId, partidos],
  );

  return (
    <div className="mt-2 overflow-x-auto border rounded">
      <p className="px-2 py-1 text-sm font-medium text-muted-foreground">Tabla de posiciones</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pos</TableHead>
            <TableHead>Pareja</TableHead>
            <TableHead>PG</TableHead>
            <TableHead>PF</TableHead>
            <TableHead>PC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((f) => (
            <TableRow key={f.pareja.id}>
              <TableCell className="font-medium">{f.posicion}</TableCell>
              <TableCell>
                {f.pareja.jugador1} — {f.pareja.jugador2}
              </TableCell>
              <TableCell>{f.pg}</TableCell>
              <TableCell>{f.pf}</TableCell>
              <TableCell>{f.pc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
