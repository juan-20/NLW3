import image from '../models/images';

export default {
    render(image: image){

        return{
            id:           image.id,
            url: `http://localhost:3333/uploads/${image.path}`,
        };
    },

    renderManny(images: image[]){

        return images.map(image => this.render(image));
    },



}