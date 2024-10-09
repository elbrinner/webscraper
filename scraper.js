const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const url = require('url');

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

// Función para extraer solo el texto de una página
async function getTextFromPage(pageUrl) {
    try {
        const { data } = await axiosInstance.get(pageUrl);
        const $ = cheerio.load(data);

        // Elimina etiquetas que no son de contenido
        $('script, style, iframe, noscript').remove();

        // Obtén el texto principal de la página
        const pageText = $('body').text().replace(/\s+/g, ' ').trim();
        return pageText;
    } catch (error) {
        console.error(`Error al cargar ${pageUrl}:`, error.message);
        return '';
    }
}

// Función para guardar texto en un archivo .txt
function saveTextToFile(pageUrl, text) {
    const filename = `${new URL(pageUrl).hostname.replace(/\W/g, '_')}_${Date.now()}.txt`;
    fs.writeFileSync(filename, text, 'utf8');
    console.log(`Texto guardado en: ${filename}`);
}

// Función principal para obtener enlaces y extraer el texto de cada uno
async function scrapeWebsite(domain) {
    console.log(`Obteniendo enlaces de: ${domain}`);
    const links = await getLinksFromPage(domain);

    if (links.length) {
        for (const link of links) {
            console.log(`Extrayendo texto de: ${link}`);
            const text = await getTextFromPage(link);
            if (text) {
                saveTextToFile(link, text);
            } else {
                console.log(`No se pudo extraer el texto de: ${link}`);
            }
        }
    } else {
        console.log('No se encontraron enlaces.');
    }
}

// Dominio a pasar como parámetro
const domain = process.argv[2];
if (!domain) {
    console.log('Por favor, proporciona un dominio.');
} else {
    scrapeWebsite(domain);
}