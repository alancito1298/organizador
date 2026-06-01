interface PerfilAlumno {

    alumno: {
      id: number;
      nombre: string;
      apellido: string;
      dni: string | null;
      contacto: string | null;
    };
  
    curso: {
      id: number;
      escuela: string;
      anio: string;
      materia: string;
    };
  
    estadisticas: {
      presentesBuenConcepto: number;
      presentesMalConcepto: number;
      ausentes: number;
      justificadas: number;
  
      totalAsistencias: number;
      totalPresentes: number;
      totalFaltas: number;
  
      porcentajeAsistencia: number;
      porcentajeBuenConcepto: number;
      porcentajeMalConcepto: number;
      porcentajeJustificadas: number;
    };
  
    promedios: {
      general: number;
      primerTrimestre: number;
      segundoTrimestre: number;
      tercerTrimestre: number;
    };
  
    cantidadesNotas: {
      trabajosPracticos: number;
      examenes: number;
      finales: number;
    };
  
    notas: any[];
    asistencias: any[];
  }

  export default PerfilAlumno