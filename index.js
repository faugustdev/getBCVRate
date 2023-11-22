import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import https from 'https';

const app = express();
const port = 3000;

const url = 'https://www.bcv.org.ve/';

export const getBcvRate = async (req, res) => {
    try {
        const response = await axios.get(url, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        if (response && response.data) {
            const $ = cheerio.load(response.data);
            const euro = $('#euro strong').text();
            const euroFormatted = Number(euro.replace(',', '.'));
            const yuan = $('#yuan strong').text();
            const yuanFormatted = Number(yuan.replace(',', '.'));
            const lira = $('#lira strong').text();
            const liraFormatted = Number(lira.replace(',', '.'));
            const rublo = $('#rublo strong').text();
            const rubloFormatted = Number(rublo.replace(',', '.'));
            const dolar = $('#dolar strong').text();
            const dolarFormatted = Number(dolar.replace(',', '.'));
           
            res.json({
                success: true,
                euro: euroFormatted,
                yuan: yuanFormatted,
                lira: liraFormatted,
                rublo: rubloFormatted,
                dolar: dolarFormatted
            });
        } else {
            console.error('La respuesta de Axios es nula o no tiene datos.');
            res.json({ success: false, message: 'Error en la respuesta de la solicitud' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

app.get('/bcv', async (req, res) => {
    await getBcvRate(req, res);
});

app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
