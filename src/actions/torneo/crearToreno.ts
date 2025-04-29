'use server'

import { PrismaClient } from '@prisma/client';
import { CrearTorneoInput } from '@/types/wizard';
import { revalidatePath } from 'next/cache';

export async function crearTorneo(input: CrearTorneoInput) {
  const { nombre, deporte, fechaInicio, fechaFin, cantidadCanchas, categorias } = input;

  const prisma = new PrismaClient();

  try {
    // TODO check torneo doesnt exist
    const torneo = await prisma.torneo.create({
      data: {
        nombre,
        deporte,
        fechaInicio,
        fechaFin,
        cantidadCanchas,
        categorias: categorias.join(','),
        estado: 'pendiente',
      },
    })

    // Si querés refrescar el path donde se ve la lista de torneos, por ejemplo:
    revalidatePath('/')

    return { success: true, torneo }
  } catch (error) {
    console.error('Error al crear torneo:', error)
    return { success: false, error: 'Error al crear el torneo' }
  }
}
