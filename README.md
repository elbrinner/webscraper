# Web Scraper en Node.js

Este proyecto es un web scraper desarrollado en Node.js que permite extraer el contenido de todas las páginas enlazadas en un dominio específico, con la flexibilidad de incluir o excluir secciones de las páginas a través de selectores CSS (`class` o `id`). El contenido extraído se guarda en archivos JSON individuales, conteniendo solo texto plano. 

## Características

- Extrae enlaces de la página principal y recorre cada enlace para extraer su contenido.
- Permite especificar selectores CSS para incluir o excluir partes específicas del contenido de la página.
- Elimina automáticamente elementos no deseados, como imágenes y iframes, para obtener solo texto.
- Guarda el contenido en archivos JSON con los atributos:
  - `fecha`: Fecha de la extracción en formato ISO.
  - `url`: URL de la página de donde se extrajo el contenido.
  - `titulo`: Título de la página.
  - `descripcion`: Descripción de la página (contenido de la metaetiqueta `description`).
  - `contenido`: Contenido de la página en texto plano.

## Requisitos

- Node.js
- npm (Node Package Manager)

## Instalación

1. Clona el repositorio o descarga el archivo del script.
2. Navega a la carpeta del proyecto:
    ```bash
    cd ruta/del/proyecto
    ```
3. Instala las dependencias necesarias:
    ```bash
    npm install axios cheerio
    ```

## Uso

Ejecuta el script en la línea de comandos con el siguiente formato:

```bash
node scraper.js <dominio> [selectores_para_incluir] [selectores_para_excluir]

Parámetros
<dominio>: URL del dominio del que deseas hacer scraping. (Ejemplo: https://ejemplo.com)
[selectores_para_incluir] (opcional): Selectores CSS separados por comas (class o id) que deseas incluir en el contenido extraído. Ejemplo: '.contenido,.articulo'
[selectores_para_excluir] (opcional): Selectores CSS separados por comas (class o id) que deseas excluir del contenido extraído. Ejemplo: '#publicidad,.footer'
Ejemplo
Para extraer contenido de https://ejemplo.com, incluyendo solo las secciones con las clases .contenido y .articulo, y excluyendo elementos con los selectores #publicidad y .footer, usa el siguiente comando:

bash
Copiar código
node scraper.js https://ejemplo.com .contenido,.articulo #publicidad,.footer
Salida
Los archivos JSON se guardarán en la carpeta scraped_pages en la raíz del proyecto.
Cada archivo JSON tendrá un nombre único en el formato <dominio>_timestamp.json para evitar sobrescribir archivos anteriores.
Ejemplo de un archivo JSON generado:
json

{
  "fecha": "2024-11-14T12:34:56.789Z",
  "url": "https://ejemplo.com/pagina",
  "titulo": "Título de la Página",
  "descripcion": "Descripción de la página",
  "contenido": "Este es el texto principal de la página sin etiquetas HTML."
}


Notas

Asegúrate de que el dominio que estás scraping permita realizar este tipo de acciones y revisa su robots.txt para confirmar.
Puedes modificar el script para personalizar la configuración de eliminación de elementos HTML según tus necesidades.