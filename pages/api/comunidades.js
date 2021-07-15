
import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

    if(request.method === 'POST'){
        const TOKEN = 'b78f1aaef1e8220851f661ed5ccee5';

        const client = new SiteClient(TOKEN);
    
        const registroCriado = await client.items.create({
            itemType: '967691', //ID DO MODEL DE COMUNIDADE CRIADO PELO DATO
            ...request.body,
            // title: "Comunidade teste",
            // imageUrl: "https://github.com/victorbohrer.png",
        })
    
        console.log(registroCriado);
    
        response.json({
            dados: 'alguns dados',
            registroCriado: registroCriado
        })
    }
}