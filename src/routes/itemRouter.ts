import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { DatabaseItem } from '../models/DatabaseItem';

export class ItemRouter<T extends DatabaseItem, DTO extends DatabaseItem = never> {
    public router = Router();
    public controller: ItemController<T, DTO>;

    constructor(
        controller: ItemController<T, DTO>,
        requiredFields: { [key: string]: any } = {},
        optionalFields: { [key: string]: any } = {}
    ) {
        this.controller = controller;

        const requiredFieldsWithRequirement: { [key: string]: any} = {};
        for(const key of Object.keys(requiredFields)) {
            requiredFieldsWithRequirement[key] = requiredFields[key].required();
        }
        
        this.router.get(
            '/',
            celebrate({
                [Segments.QUERY]: Joi.object({}).unknown(),
                [Segments.HEADERS]: Joi.object({
                    token: Joi.string().required()
                }).unknown()
            }),
            this.controller.getAll
        );

        this.router.post(
            '/create',
            celebrate({
                [Segments.BODY]: Joi.object({
                    ...requiredFieldsWithRequirement,
                    ...optionalFields,
                    venueName: Joi.string().required()
                }),
                // requires authentication
                [Segments.HEADERS]: Joi.object({
                    token: Joi.string().required()
                }).unknown()
            }),
            this.controller.create
        );
        
        this.router.post(
            '/edit',
            celebrate({
                [Segments.BODY]: Joi.object({
                    ...requiredFields,
                    ...optionalFields,
                    id: Joi.number().required()
                }),
                // requires authentication
                [Segments.HEADERS]: Joi.object({
                    token: Joi.string().required()
                }).unknown()
            }),
            this.controller.update
        );
        
        this.router.delete(
            '/:id',
            celebrate({
                [Segments.PARAMS]: Joi.object({
                    id: Joi.number().required()
                }),
                // requires authentication
                [Segments.HEADERS]: Joi.object({
                    token: Joi.string().required()
                }).unknown()
            }),
            this.controller.delete
        );
    }
}