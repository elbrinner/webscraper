# WebScraper

![Node.js](https://img.shields.io/badge/Node.js-v16.x-green) 
![npm](https://img.shields.io/badge/npm-v7.x-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

WebScraper es una herramienta simple desarrollada en Node.js para realizar **web scraping**. Este script extrae todos los enlaces de una página web dada, accede a cada uno y guarda el contenido textual de cada página en archivos `.txt` individuales. ¡Ideal para análisis de contenido o proyectos de recolección de datos!

## Características
- **Extracción de enlaces:** Recopila todos los enlaces de la página principal proporcionada.
- **Extracción de texto:** Accede a cada enlace y extrae solo el contenido textual, eliminando etiquetas HTML, scripts y otros elementos no deseados.
- **Almacenamiento en archivos:** Guarda el texto extraído en archivos `.txt` independientes, listos para su análisis.

## Requisitos

- [Node.js](https://nodejs.org/) v16 o superior
- [npm](https://www.npmjs.com/) v7 o superior

## Instalación

Clona este repositorio y navega hasta la carpeta del proyecto:
```bash
git https://github.com/elbrinner/webscraper
cd webscraper


npm install

node scraper.js https://tu-dominio.com


```



Ejemplo de salida
El script generará archivos .txt con el contenido textual de cada página enlazada desde el dominio principal. Los nombres de los archivos incluirán el nombre de la página y una marca de tiempo para evitar colisiones:


example_com_1696891245678.txt
example_com_1696891267890.txt

Dependencias

axios - Para realizar solicitudes HTTP de manera simple.
cheerio - Para procesar y manipular el contenido HTML.
Para instalar manualmente, usa:

```bash
npm install axios cheerio
```