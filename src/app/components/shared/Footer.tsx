'use client';

import Link from 'next/link';
import ShareAndInstallButtons from './ShareAndInstallButtons';

export default function Footer() {
  return (
    <footer className="w-full bg-violet-950 text-white border-t border-violet-900 pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-violet-800/60">
        
        {/* COLUMNA 1: LOGO Y CLUSTER PRINCIPAL */}
        <div className="flex flex-col items-start gap-4">
          <Link href="/home" className="flex items-center gap-2">
            <div className="bg-violet-900 p-2 rounded-xl border border-violet-700">
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-yellow-400" viewBox="0 0 4000.000000 4092.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,4092.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                  <path d="M13758 37876 l-217 -186 -13 -58 c-7 -31 -13 -100 -12 -152 1 -83 5 -107 37 -192 29 -79 63 -136 183 -315 161 -237 317 -461 549 -788 551 -778 819 -1252 1070 -1900 543 -1400 721 -2763 565 -4340 -86 -877 -261 -1772 -634 -3250 -69 -269 -141 -571 -161 -670 -20 -99 -54 -232 -75 -296 -22 -64 -67 -240 -99 -390 -57 -259 -79 -359 -136 -609 -218 -963 -270 -1202 -350 -1605 -224 -1127 -315 -1886 -315 -2645 0 -1634 449 -3409 1232 -4860 267 -495 537 -903 1038 -1570 859 -1144 1789 -2233 2237 -2619 l111 -97 194 -63 c720 -235 2325 -820 5438 -1983 771 -288 1953 -726 2630 -975 912 -335 1064 -391 1225 -448 83 -29 258 -92 390 -140 896 -324 1762 -615 2055 -690 138 -36 165 -37 243 -8 167 60 260 125 329 230 87 131 91 145 90 343 -2 405 -97 1058 -347 2380 -105 554 -126 672 -219 1200 -42 234 -132 745 -201 1135 -69 391 -166 940 -216 1220 -88 496 -339 1918 -400 2260 -16 94 -120 676 -229 1295 -109 619 -217 1226 -239 1350 -22 124 -49 286 -60 360 -117 775 -157 1004 -221 1265 -59 242 -66 257 -197 443 -435 619 -1141 1466 -2014 2418 -598 652 -680 738 -884 928 -811 755 -1947 1418 -3185 1856 -322 114 -508 172 -830 260 -612 166 -1080 248 -2030 355 -597 67 -602 68 -1455 72 l-790 5 -330 -28 c-186 -15 -335 -32 -342 -38 -6 -6 -35 -85 -63 -176 -28 -91 -74 -232 -101 -315 -40 -121 -56 -193 -84 -374 -20 -123 -33 -227 -29 -230 3 -3 564 -9 1247 -12 1227 -7 1428 -12 1722 -45 125 -14 285 -40 293 -49 2 -2 -171 -151 -385 -331 -213 -181 -534 -452 -713 -603 -179 -151 -469 -396 -645 -545 -176 -149 -435 -367 -575 -486 -140 -119 -385 -326 -545 -461 -159 -134 -434 -366 -610 -515 -176 -149 -333 -288 -349 -309 -43 -55 -91 -160 -110 -236 -20 -83 -21 -237 -1 -314 51 -195 211 -343 423 -391 64 -14 78 -15 146 -1 330 67 864 463 1961 1452 284 256 392 350 720 626 160 134 353 297 430 363 629 534 1303 1095 1664 1385 l153 123 82 -35 c108 -47 209 -82 498 -173 246 -77 474 -162 583 -217 83 -41 216 -128 213 -137 -3 -8 -315 -267 -1058 -876 -648 -531 -871 -714 -920 -755 -25 -21 -180 -150 -346 -286 -695 -573 -1367 -1134 -2039 -1703 -213 -180 -929 -800 -1129 -979 -376 -334 -777 -725 -845 -824 -82 -120 -99 -341 -35 -471 78 -159 259 -258 634 -345 l84 -19 656 547 c643 537 1767 1475 3680 3070 531 443 1248 1042 1594 1331 345 289 643 536 660 550 17 14 73 60 124 103 51 42 96 77 100 77 10 0 876 -669 880 -679 5 -15 -509 -484 -939 -857 -400 -347 -1654 -1403 -1845 -1554 -18 -14 -94 -77 -170 -140 -239 -197 -671 -551 -1499 -1229 -440 -361 -1007 -826 -1260 -1036 -436 -360 -599 -491 -900 -721 -374 -285 -572 -475 -702 -676 -177 -270 -153 -513 72 -733 149 -145 314 -176 545 -103 282 89 604 322 1155 833 212 196 309 282 520 460 329 278 675 574 2260 1930 384 328 785 670 1069 910 1039 878 1742 1454 2221 1821 161 123 376 282 402 297 13 8 372 -381 451 -488 156 -211 168 -390 61 -937 -17 -88 -63 -358 -103 -601 l-71 -442 -85 -14 c-60 -10 -178 -14 -395 -14 -318 0 -359 3 -880 58 -293 31 -593 42 -725 26 -102 -12 -240 -50 -305 -83 -259 -133 -402 -430 -440 -918 -4 -47 -74 -550 -156 -1118 -82 -568 -149 -1035 -149 -1037 0 -1 -28 -8 -63 -14 -145 -25 -453 -12 -1272 54 -1105 90 -1396 96 -1520 33 -131 -67 -233 -217 -311 -457 -127 -387 -182 -872 -192 -1696 l-7 -490 -95 3 c-52 1 -529 16 -1060 33 l-965 31 -49 46 c-83 81 -294 321 -423 482 -351 440 -669 948 -924 1475 -568 1178 -904 2486 -980 3808 -15 262 -6 1036 15 1337 40 566 94 988 194 1515 22 116 47 262 56 325 9 63 78 378 155 700 77 322 171 729 211 905 90 405 138 590 201 774 34 98 54 174 60 231 17 162 77 442 189 890 543 2169 725 3520 650 4810 -124 2118 -795 4020 -1934 5480 -66 85 -268 333 -449 550 -321 385 -331 396 -406 438 -130 75 -156 84 -271 89 l-105 5 -217 -186z"/>
                </g>
              </svg>
            </div>
            <span className="font-bold text-lg text-white">Organizador Docente</span>
          </Link>
          <p className="text-xs text-violet-300 leading-relaxed font-light">
            La plataforma líder diseñada por docentes para simplificar la agenda de clases, planificaciones, tomador de asistencias y calificaciones escolares.
          </p>
          <div className="pt-2">
            <ShareAndInstallButtons />
          </div>
        </div>

        {/* COLUMNA 2: CLUSTER MÓDULOS DE GESTIÓN */}
        <div>
          <h4 className="font-bold text-sm uppercase text-yellow-400 tracking-wider mb-3">Módulos de Gestión</h4>
          <ul className="space-y-2 text-xs text-violet-200">
            <li><Link href="/cursos" className="hover:text-white transition flex items-center gap-1.5">👥 Mis Cursos y Aulas</Link></li>
            <li><Link href="/agenda" className="hover:text-white transition flex items-center gap-1.5">📅 Agenda y Calendario Escolar</Link></li>
            <li><Link href="/horario" className="hover:text-white transition flex items-center gap-1.5">⏰ Grilla de Horarios Lectivos</Link></li>
            <li><Link href="/planificaciones" className="hover:text-white transition flex items-center gap-1.5">📚 Planificaciones y Secuencias</Link></li>
            <li><Link href="/perfil" className="hover:text-white transition flex items-center gap-1.5">👤 Perfil y Configuración</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: CLUSTER PLANES Y RECURSOS */}
        <div>
          <h4 className="font-bold text-sm uppercase text-yellow-400 tracking-wider mb-3">Planes y Precios</h4>
          <ul className="space-y-2 text-xs text-violet-200">
            <li><Link href="/planes" className="hover:text-white transition">🌱 Plan Gratis (hasta 2 cursos)</Link></li>
            <li><Link href="/planes" className="hover:text-white transition">⚡ Plan Básico Mensual ($3.999)</Link></li>
            <li><Link href="/planes" className="hover:text-white transition">⭐ Plan Plus Ilimitado ($4.999)</Link></li>
            <li><Link href="/registro" className="hover:text-white transition font-bold text-yellow-300">🚀 Crear Cuenta Docente Gratis</Link></li>
            <li><Link href="/login" className="hover:text-white transition">🔐 Iniciar Sesión Docente</Link></li>
          </ul>
        </div>

        {/* COLUMNA 4: CLUSTER SOPORTE Y LEGAL */}
        <div>
          <h4 className="font-bold text-sm uppercase text-yellow-400 tracking-wider mb-3">Soporte y Seguridad</h4>
          <ul className="space-y-2 text-xs text-violet-200">
            <li><Link href="/recuperar" className="hover:text-white transition">🔑 Recuperar Contraseña</Link></li>
            <li><a href="https://www.organizadordocente.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🌐 Sitio Oficial</a></li>
            <li><span className="opacity-80">🛡️ Exportación Segura a Excel</span></li>
            <li><span className="opacity-80">🔒 Datos Protegidos en la Nube</span></li>
          </ul>
        </div>

      </div>

      {/* FOOTER BOTTOM / COPYRIGHT */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-violet-400 gap-4">
        <p className="text-center sm:text-left">
          Desarrollado por <a href="https://cv-sigma-umber.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-violet-200 font-bold hover:underline">Alan G. Amarillo</a>
        </p>
        <p className="text-center">Copyright © 2026 Organizador Docente. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">Términos y condiciones</span>
          <span className="hover:underline cursor-pointer">Políticas de privacidad</span>
        </div>
      </div>
    </footer>
  );
}