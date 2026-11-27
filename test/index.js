const specs = import.meta.webpackContext('../src', { recursive: true, regExp: /\.spec\.jsx?$/ });
specs.keys().forEach(specs);

const codigo = import.meta.webpackContext('../src', { recursive: true, regExp: /^(?!.*(\.spec\.|main\.jsx|test-utils|smoke)).*\.jsx?$/ });
codigo.keys().forEach(codigo);
