// Punto de entrada de Karma.
// 1) Carga todos los archivos *.spec.js(x) de src/ (las pruebas).
const specs = import.meta.webpackContext('../src', { recursive: true, regExp: /\.spec\.jsx?$/ });
specs.keys().forEach(specs);

// 2) Carga también el resto del código de la app (sin ejecutar nada), para que el informe de
//    cobertura incluya TODOS los archivos y no solo los que las pruebas importan por casualidad.
const codigo = import.meta.webpackContext('../src', { recursive: true, regExp: /^(?!.*(\.spec\.|main\.jsx|test-utils|smoke)).*\.jsx?$/ });
codigo.keys().forEach(codigo);
