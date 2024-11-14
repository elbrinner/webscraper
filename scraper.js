const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const url = require('url');
const path = require('path');
const scrapedFolder = path.join(__dirname, 'scraped_pages');

// Desactivar la verificación SSL (opcional)
const axiosInstance = axios.create({
    httpsAgent: new(require('https').Agent)({
        rejectUnauthorized: false
    })
});

// Función para obtener los enlaces de una página
async function getLinksFromPage(pageUrl) {
    try {
        const { data } = await axiosInstance.get(pageUrl);
        const $ = cheerio.load(data);
        const links = [];

        $('a').each((i, element) => {
            const href = $(element).attr('href');
            if (href && !href.startsWith('#')) { // Evitar enlaces de anclas
                const absoluteUrl = url.resolve(pageUrl, href);
                links.push(absoluteUrl);
            }
        });
        return links;
    } catch (error) {
        console.error(`Error al cargar ${pageUrl}:`, error.message);
        return [];
    }
}

// Función para extraer texto de una página, con opciones de exclusión e inclusión
async function getTextFromPage(pageUrl, includeSelectors = [], excludeSelectors = []) {
    try {
        const { data } = await axiosInstance.get(pageUrl);
        const $ = cheerio.load(data);

        // Elimina los elementos no deseados según los selectores excluidos
        excludeSelectors.forEach(selector => $(selector).remove());

        // Crear una copia temporal de los elementos de la página
        const $tempContent = $.root().clone();

        // Eliminar imágenes, iframes y otros elementos visuales en la copia temporal
        $tempContent.find('img, iframe, video, picture, object, embed').remove();

        // Obtiene el título de la página
        const title = $('title').text().trim();

        // Obtiene la descripción desde la metaetiqueta description
        const description = $('meta[name="description"]').attr('content') || '';

        // Incluye solo los selectores específicos si están definidos y extrae texto limpio
        let content = '';
        if (includeSelectors.length > 0) {
            includeSelectors.forEach(selector => {
                content += $tempContent.find(selector).text().replace(/\s+/g, ' ').trim() + ' ';
            });
        } else {
            // Si no se especifican selectores, obtener texto de todo el body en la copia temporal
            content = $tempContent.find('body').text().replace(/\s+/g, ' ').trim();
        }

        // Crear el JSON con la información solicitada
        const pageData = {
            fecha: new Date().toISOString(),
            url: pageUrl,
            titulo: title,
            descripcion: description,
            contenido: content.trim() // Solo texto, sin etiquetas HTML
        };

        return pageData;
    } catch (error) {
        console.error(`Error al cargar ${pageUrl}:`, error.message);
        return null;
    }
}

// Función para guardar JSON de cada página en un archivo
function saveJsonToFile(data) {
    const urlObject = new URL(data.url);
    const filename = `${scrapedFolder}/${data.titulo.replace(/\W/g, '_')}.json`;

    // Crear la carpeta si no existe
    if (!fs.existsSync(scrapedFolder)) {
        fs.mkdirSync(scrapedFolder);
    }

    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Archivo JSON guardado en: ${filename}`);
}

// Función principal para obtener enlaces y extraer el texto de cada uno
async function scrapeWebsite(domain, includeSelectors, excludeSelectors) {
    console.log(`Obteniendo enlaces de: ${domain}`);
    const links = await getLinksFromPage(domain);

    if (links.length) {
        for (const link of links) {
            console.log(`Extrayendo texto de: ${link}`);
            const pageData = await getTextFromPage(link, includeSelectors, excludeSelectors);
            if (pageData) {
                saveJsonToFile(pageData); // Guardar cada página en un archivo JSON separado
            } else {
                console.log(`No se pudo extraer el texto de: ${link}`);
            }
        }
    } else {
        console.log('No se encontraron enlaces.');
    }
}

// Procesar argumentos de la línea de comandos
const domain = process.argv[2];
const includeSelectors = process.argv[3] ? process.argv[3].split(',') : [];
const excludeSelectors = process.argv[4] ? process.argv[4].split(',') : [];

if (!domain) {
    console.log('Por favor, proporciona un dominio.');
} else {
    scrapeWebsite(domain, includeSelectors, excludeSelectors);
}