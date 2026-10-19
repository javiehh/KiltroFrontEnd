/**
 * Datos iniciales ("semilla") de la base de datos simulada.
 * db.js los copia a localStorage la primera vez (o cuando cambia DB_VERSION).
 * Cuentas de prueba: javier@gmail.com / admin1 (Administrador),
 * camila@gmail.com / vende1 (Vendedor), pedro@gmail.com / cliente1 (Cliente).
 */
export const SEED = {
  "categorias": [
    {
      "id": 1,
      "nombre": "Perros",
      "descripcion": "Alimento, paseo y juegos para tu perro.",
      "icono": "huellas",
      "tile": "#D9A441"
    },
    {
      "id": 2,
      "nombre": "Gatos",
      "descripcion": "Camas, rascadores y todo para consentir a tu gato.",
      "icono": "rascador",
      "tile": "#1F3A2E"
    },
    {
      "id": 3,
      "nombre": "Aves",
      "descripcion": "Jaulas, comederos y alimento para aves.",
      "icono": "semilla",
      "tile": "#7A4B32"
    },
    {
      "id": 4,
      "nombre": "Roedores",
      "descripcion": "Ruedas, heno y accesorios para pequeños roedores.",
      "icono": "rueda",
      "tile": "#D9A441"
    }
  ],
  "productos": [
    {
      "id": 1,
      "codigo": "PER-001",
      "nombre": "Alimento premium adulto 15kg",
      "descripcion": "Croquetas con pollo real, sin colorantes artificiales.",
      "precio": 34990,
      "stock": 24,
      "stockCritico": 5,
      "media": {
        "tipo": "icono",
        "icono": "huellas",
        "tile": "#D9A441"
      },
      "categoriaId": 1,
      "oferta": true,
      "descuento": 15
    },
    {
      "id": 2,
      "codigo": "PER-002",
      "nombre": "Correa + collar de cuero",
      "descripcion": "Set resistente, ajustable, para paseos largos por el barrio.",
      "precio": 12500,
      "stock": 15,
      "stockCritico": 3,
      "media": {
        "tipo": "icono",
        "icono": "hueso",
        "tile": "#7A4B32"
      },
      "categoriaId": 1,
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 3,
      "codigo": "GAT-001",
      "nombre": "Cama acolchada para gatos",
      "descripcion": "Base antideslizante y funda desmontable lavable.",
      "precio": 18900,
      "stock": 10,
      "stockCritico": 2,
      "media": {
        "tipo": "foto",
        "url": "https://images.unsplash.com/photo-1681128965175-2bb9213eabba?auto=format&fit=crop&w=800&q=80",
        "alt": "Gato blanco descansando sobre un piso de madera"
      },
      "categoriaId": 2,
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 4,
      "codigo": "GAT-002",
      "nombre": "Rascador torre con hamaca",
      "descripcion": "Tres niveles, cuerda de sisal natural, base estable.",
      "precio": 27990,
      "stock": 6,
      "stockCritico": 2,
      "media": {
        "tipo": "icono",
        "icono": "rascador",
        "tile": "#1F3A2E"
      },
      "categoriaId": 2,
      "oferta": true,
      "descuento": 20
    },
    {
      "id": 5,
      "codigo": "AVE-001",
      "nombre": "Jaula decorativa mediana",
      "descripcion": "Incluye comedero, bebedero y percha de madera.",
      "precio": 31500,
      "stock": 8,
      "stockCritico": 2,
      "media": {
        "tipo": "foto",
        "url": "https://images.unsplash.com/photo-1614226355028-9eb93b25cb04?auto=format&fit=crop&w=800&q=80",
        "alt": "Ave pequeña dentro de una jaula"
      },
      "categoriaId": 3,
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 6,
      "codigo": "ROE-001",
      "nombre": "Rueda de ejercicio silenciosa",
      "descripcion": "Para hámster o cuyo, giro suave y sin ruido.",
      "precio": 9990,
      "stock": 3,
      "stockCritico": 4,
      "media": {
        "tipo": "icono",
        "icono": "rueda",
        "tile": "#D9A441"
      },
      "categoriaId": 4,
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 7,
      "codigo": "PER-003",
      "nombre": "Snack dental para perros",
      "descripcion": "Barras masticables que ayudan a limpiar los dientes.",
      "categoriaId": 1,
      "precio": 4990,
      "stock": 40,
      "stockCritico": 8,
      "media": {
        "tipo": "icono",
        "icono": "hueso",
        "tile": "#7A4B32"
      },
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 8,
      "codigo": "GAT-003",
      "nombre": "Juguete de plumas para gatos",
      "descripcion": "Varita con plumas para jugar y ejercitar a tu gato.",
      "categoriaId": 2,
      "precio": 3990,
      "stock": 30,
      "stockCritico": 6,
      "media": {
        "tipo": "icono",
        "icono": "pelota",
        "tile": "#D9A441"
      },
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 9,
      "codigo": "AVE-002",
      "nombre": "Alimento para canarios 1kg",
      "descripcion": "Mezcla de semillas seleccionadas para canarios.",
      "categoriaId": 3,
      "precio": 5990,
      "stock": 20,
      "stockCritico": 5,
      "media": {
        "tipo": "icono",
        "icono": "semilla",
        "tile": "#1F3A2E"
      },
      "oferta": true,
      "descuento": 10
    },
    {
      "id": 10,
      "codigo": "ROE-002",
      "nombre": "Heno premium para conejos",
      "descripcion": "Heno natural, rico en fibra, ideal para conejos y cuyos.",
      "categoriaId": 4,
      "precio": 6990,
      "stock": 12,
      "stockCritico": 4,
      "media": {
        "tipo": "icono",
        "icono": "semilla",
        "tile": "#7A4B32"
      },
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 11,
      "codigo": "GAT-004",
      "nombre": "Comedero doble de cerámica",
      "descripcion": "Dos platos antideslizantes, para comida y agua.",
      "categoriaId": 2,
      "precio": 8990,
      "stock": 14,
      "stockCritico": 3,
      "media": {
        "tipo": "icono",
        "icono": "comedero",
        "tile": "#D9A441"
      },
      "oferta": false,
      "descuento": 0
    },
    {
      "id": 12,
      "codigo": "PER-004",
      "nombre": "Pelota resistente para perros",
      "descripcion": "Goma natural, resistente a mordidas fuertes.",
      "categoriaId": 1,
      "precio": 3490,
      "stock": 25,
      "stockCritico": 5,
      "media": {
        "tipo": "icono",
        "icono": "pelota",
        "tile": "#1F3A2E"
      },
      "oferta": true,
      "descuento": 25
    }
  ],
  "usuarios": [
    {
      "run": "111111111",
      "nombre": "Javier",
      "apellidos": "Herrera",
      "correo": "javier@gmail.com",
      "password": "admin1",
      "fechaNacimiento": "",
      "tipo": "Administrador",
      "region": "Región Metropolitana de Santiago",
      "comuna": "Ñuñoa",
      "direccion": "Av. Siempre Viva 123"
    },
    {
      "run": "222222222",
      "nombre": "Camila",
      "apellidos": "Soto",
      "correo": "camila@gmail.com",
      "password": "vende1",
      "fechaNacimiento": "",
      "tipo": "Vendedor",
      "region": "Región de Valparaíso",
      "comuna": "Viña del Mar",
      "direccion": "Calle Los Álamos 45"
    },
    {
      "run": "123456785",
      "nombre": "Pedro",
      "apellidos": "Pérez",
      "correo": "pedro@gmail.com",
      "password": "cliente1",
      "fechaNacimiento": "",
      "tipo": "Cliente",
      "region": "Región Metropolitana de Santiago",
      "comuna": "Ñuñoa",
      "direccion": "Los Crisantemos 123"
    }
  ],
  "ordenes": [
    {
      "numero": "2026100501",
      "codigo": "ORDER10001",
      "fecha": "2026-10-05T15:20:00.000Z",
      "estado": "pagada",
      "usuarioRun": "123456785",
      "cliente": {
        "nombre": "Pedro",
        "apellidos": "Pérez",
        "correo": "pedro@gmail.com"
      },
      "direccion": {
        "calle": "Los Crisantemos 123",
        "departamento": "Depto 603",
        "region": "Región Metropolitana de Santiago",
        "comuna": "Ñuñoa",
        "indicaciones": "Dejar con el conserje."
      },
      "items": [
        {
          "productoId": 1,
          "nombre": "Alimento premium adulto 15kg",
          "precio": 29742,
          "cantidad": 1,
          "subtotal": 29742
        },
        {
          "productoId": 3,
          "nombre": "Cama acolchada para gatos",
          "precio": 18900,
          "cantidad": 1,
          "subtotal": 18900
        }
      ],
      "total": 48642
    },
    {
      "numero": "2026100901",
      "codigo": "ORDER10002",
      "fecha": "2026-10-09T18:05:00.000Z",
      "estado": "pagada",
      "usuarioRun": "123456785",
      "cliente": {
        "nombre": "Pedro",
        "apellidos": "Pérez",
        "correo": "pedro@gmail.com"
      },
      "direccion": {
        "calle": "Los Crisantemos 123",
        "departamento": "Depto 603",
        "region": "Región Metropolitana de Santiago",
        "comuna": "Ñuñoa",
        "indicaciones": "Dejar con el conserje."
      },
      "items": [
        {
          "productoId": 2,
          "nombre": "Correa + collar de cuero",
          "precio": 12500,
          "cantidad": 2,
          "subtotal": 25000
        },
        {
          "productoId": 6,
          "nombre": "Rueda de ejercicio silenciosa",
          "precio": 9990,
          "cantidad": 1,
          "subtotal": 9990
        }
      ],
      "total": 34990
    },
    {
      "numero": "2026101201",
      "codigo": "ORDER10003",
      "fecha": "2026-10-12T12:40:00.000Z",
      "estado": "pagada",
      "usuarioRun": null,
      "cliente": {
        "nombre": "Ana",
        "apellidos": "Soto",
        "correo": "ana@gmail.com"
      },
      "direccion": {
        "calle": "Av. Libertad 45",
        "departamento": "",
        "region": "Región de Valparaíso",
        "comuna": "Viña del Mar",
        "indicaciones": ""
      },
      "items": [
        {
          "productoId": 9,
          "nombre": "Alimento para canarios 1kg",
          "precio": 5391,
          "cantidad": 2,
          "subtotal": 10782
        }
      ],
      "total": 10782
    },
    {
      "numero": "2026101401",
      "codigo": "ORDER10004",
      "fecha": "2026-10-14T20:10:00.000Z",
      "estado": "rechazada",
      "usuarioRun": "123456785",
      "cliente": {
        "nombre": "Pedro",
        "apellidos": "Pérez",
        "correo": "pedro@gmail.com"
      },
      "direccion": {
        "calle": "Los Crisantemos 123",
        "departamento": "Depto 603",
        "region": "Región Metropolitana de Santiago",
        "comuna": "Ñuñoa",
        "indicaciones": "Dejar con el conserje."
      },
      "items": [
        {
          "productoId": 5,
          "nombre": "Jaula decorativa mediana",
          "precio": 31500,
          "cantidad": 1,
          "subtotal": 31500
        }
      ],
      "total": 31500,
      "motivoRechazo": "Pago rechazado por el emisor"
    }
  ],
  "mensajes": []
};
