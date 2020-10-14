import { getRepository, Index } from 'typeorm';
import Orphanage from '../models/orphanage';
import {Request, Response} from 'express';

import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';


export default{
    async Index(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return response.json(orphanageView.renderManny(orphanages));
       
    },
    async show(request: Request, response: Response){
        const { id } = request.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id,{
            relations: ['images']
        });

        return response.json(orphanageView.render(orphanage));
       
    },



    async create(request: Request, response: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
        } = request.body
    
        const orphanagesRepository = getRepository(Orphanage);

        const requestImages = request.files as Express.Multer.File[] ;
        const images = requestImages.map(image => {

            return {path: image.filename }
        })

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
        };

        // validação
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
            }))

        });
        const finalData = schema.cast(data);

        // mostra qual campo não esta valido e cancela tudo
        await schema.validate(data, {
            abortEarly: false,

        });
    
        const orphanage = orphanagesRepository.create(data);
    
        await orphanagesRepository.save(orphanage);
    
    
        return response.status(201).json(orphanage);
    }
}