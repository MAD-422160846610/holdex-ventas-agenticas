---
tags: ['#nota']
created: 2023-03-17
updated: 2023-03-17
status: active
priority: medium
---

En Excel cómo puedo crear una fórmula que quite los espacios en blanco de la columna C y concatene la columna B

Para quitar los espacios en blanco de la columna C y concatenar la columna B, puedes utilizar la función CONCATENAR y la función SUSTITUIR de Excel.

Sigue estos pasos:

1. En una celda vacía, escribe la siguiente fórmula: =CONCATENAR(B1,SUSTITUIR(C1," ",""))

2. Presiona Enter para ver el resultado.

3. Arrastra la fórmula hacia abajo para aplicarla a todas las filas de tu tabla.

4. Verás que el resultado es una nueva columna que contiene los valores de la columna B concatenados con los valores de la columna C sin espacios en blanco.

Nota: Asegúrate de cambiar las referencias a las columnas B y C en la fórmula según corresponda a tu tabla.



---





Como modelo de referencia, aquí está un ejemplo de cómo leer un archivo CSV y convertirlo en una matriz utilizando Node.js:

Para leer un archivo CSV en Node.js, primero necesitamos instalar el módulo csv-parser. Podemos hacerlo ejecutando el siguiente comando en la línea de comandos:

npm install csv-parser

Una vez que tengamos instalado este módulo, podemos comenzar a trabajar con nuestro archivo CSV. Supongamos que tenemos un archivo llamado "datos.csv" con los siguientes datos:

nombre,apellido,edad
Juan,Pérez,25
María,González,30
Pedro,Rodríguez,40

Para leer y procesar este archivo CSV en Node.js, podemos usar el siguiente código:

```javascript
const fs = require('fs');
const csv = require('csv-parser');

let datos = [];

fs.createReadStream('datos.csv')
  .pipe(csv())
  .on('data', (row) => {
    datos.push(row);
  })
  .on('end', () => {
    console.log(datos);
  });
  
```

Este código abre el archivo "datos.csv" y lo parsea usando el módulo csv-parser. Luego, cada fila del archivo se agrega a un arreglo llamado "datos". Finalmente, imprimimos este arreglo en la consola.

El resultado de ejecutar este código sería:

[
  { nombre: 'Juan', apellido: 'Pérez', edad: '25' },
  { nombre: 'María', apellido: 'González', edad: '30' },
  { nombre: 'Pedro', apellido: 'Rodríguez', edad: '40' }
]

Como puedes ver, hemos convertido exitosamente nuestro archivo CSV en una matriz de JavaScript que podemos utilizar para realizar operaciones más complejas.















