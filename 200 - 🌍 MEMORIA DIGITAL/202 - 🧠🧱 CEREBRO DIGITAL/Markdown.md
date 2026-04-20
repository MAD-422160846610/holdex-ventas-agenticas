---
tags: ['#para/r/memoria-digital', '#zk/permanent']
created: 2022-02-04
updated: 2022-02-04
status: active
priority: medium
aliases: ['Markdown']
---



#Markdown

#¿Qué es Markdown?
Markdown es un [lenguaje de marcado ligero](https://es.wikipedia.org/wiki/Lenguaje_de_marcas_ligero), es decir, es un estándar para textos planos, mediante el cual podemos dar formato a nuestros textos añadiendo series de caracteres extras de una forma especial, usarlo nos permite enriquecer visualmente los textos, lo cual es muy importante, ya que de esta forma es más agradable la lectura y el estudio de los mismos.

**Una de las grandes ventajas de usar Markdown** es la facilidad que nos brinda para migrar la información, ya que al ser un formato estándar de texto plano, permite integrar los archivos de manera sencilla en otras plataformas.


#Herramientas y Markdown
El formato universal de nuestro CEREBRO DIGITAL es Markdown porque es el formato de texto más extendido. Aunque no se considere un estándar como tal, es adoptado por una gran parte de herramientas para tomar notas como formato de importación/exportación del contenido.

Pero, una exportación e importación en markdown NO es blanco o negro. La exportación/importación a markdown puede ser más o menos limpia y esto depende de cada herramienta. Por eso tenemos que tener en cuenta el flujo de exportación/importación de las herramientas para no quedarnos atados a una y tener sustos.


#Flujo exportación e importación 
Cada herramienta tiene un flujo distinto:
<!-- Imagen eliminada durante limpieza -->


#Otro


#Reglas Markdown
Es texto plano y la extensión del fichero es .md (ojo no txt)

```

#Título nivel 1

#Título nivel 2

#Título nivel 3

#Título nivel 4

```



#Formateo del texto

**negrita la palabra**
*cursiva*
***negrita y cursiva***
___negrita y cursiva___

Markdown no permite el subrayado para no confundirlo con los enlaces.
Ni tampoco más de dos líneas en blanco, si las ves las unificará en una, el espacio.





TACHADO
También podemos tachar texto, pero aquí necesitaremos un carácter especial que no está en los teclados.

Este carácter ~~ (Alt y teclear 1 2 6) pulsamos alt, y mientras la mantenemos pulsada, tecleamos el 126, uno, dos, seis, los números uno detrás de otro, no a la vez. Alt pulsado y tecleamos uno dos seis

Este ~~texto~~ está tachado

~~este texto va a ir tachado~~ fasdfasdfasd

MARCADO EN COLOR
Lo que si está permitido en markdown es el marcado con color del texto.
El texto puede estar ==resaltado palabra== kpokipòk



#Divisores y presentaciones
Divisores con tres guiones

---

presentación 1
lo que sea

---

presentación 2
otra cosa

---


---


#Citas
Símbolo de mayor que y la cita
> Lo importante no es lo que sabes, sino lo que haces con lo que sabes


 - [ ] Checkbox without marked
 - [x] Checkbox marked



#Listas
LISTAS SIN NUMERAR
Creamos un guion
- fasdfa
- adsfasd
- asdfasd


LISTAS NUMERADAS
Escribimos un número y podemos anidar listas una dentro de otras
1. ASFASD
2. FASDFAS
	1. ffasdfasd
	2. FASDFASD (tabulador)
	3. jlkñjñ
		1. asdfasda
3. jñljñjl (shift, la tecla de las mayúsculas y tabulador) movemos la tabulación a su origen
4. jñjñlj

LISTAS DE TAREAS
guion, abrimos corchete, dejamos espacio, cerramos corchete
- [x] FASDASD
- [x] MLKMLÑK
- [ ] 
 - [x] FADSFASD
 - [ ] FASDFASD
 


Ojo, aquí ya podemos ver que la idea es que estos carácteres extra no ensucien la nota, incluse ayuden en la edición a entender mejor el texto. Los propios caracteres con los que enriquecemos tienen todo el sentido en relación al detalle visual que añaden, o sea, no molestan en absoluto al leer en el estado edición.


#Imágenes
Si copiais cualquier imagen y la pegáis en obsidian en este caso, ya os adapta el formato markdown para insertar imágenes de forma directa que es éste:

En obsidian no muestra la ruta porque esta imagen al pegarla, la ha incluido dentro de su vault, de su sistema de archivos, de hecho está aquí.

Pero si la imagen estuviera fuera del alcance del vault, o la carpeta raiz de obsidian, el formato sería así:

![Engelbartjjjj](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)

Pero si la imagen la queremos redimensionar, también podemos hacerlo de una forma muy sencilla:

![Engelbart|100](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)


#Bloques código o lo que no quieras que se compile Markdown
Hay que usar la comilla que está  a la derecha de la P en un teclado español y nos permite incluir código de lenguajes de programación.

```js
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
```


#Comentarios para que no compile Markdown
%% JKJLJLK **jjjjj**
Avisar de loooo
%%


#Carácteres markdown que no quieras compilar
Añadir \ (barra invertida) delante del carácter:
\[\[no compila
\*\*no compila



#Tablas
| Nombre | Valor |
| ------ | ------ |
| Docena | 12 |
| Centena | 100 |


#Enlaces externos 

#Enlaces externos con Markdown
 - https://obsidian.md/
 - Este es la [Web de obsidian](https://obsidian.md/)
 - Ctrl+K sale el formato para incluir una url 
 - [nombre enlace](https://google.es)


#Enlaces externos formato Obsidian
Recurso externo en mi equipo o red local, mediante obsidian, esto no es markdown:
[Link to note](obsidian://open?path=D:%2Fpath%2Fto%2Fficheroquesea.md)


`/` codificados con `%2F` 
` ` Espacios en blanco`%20`


