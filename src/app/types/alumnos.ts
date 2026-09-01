export type Alumno = {
  id: number;
  alumnoCursoId: number;
  nombre: string;
  apellido: string;
  contacto?: string;
  dni?: string;
};

export type AlumnoConStats = Alumno & {
  asistenciaPorcentaje: number;
  primerTrimestre: number;
  promedioGeneral: number;
};
