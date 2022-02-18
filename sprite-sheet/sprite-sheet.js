import Spritesmith from 'spritesmith';
import fs from 'fs';
import Jimp from "jimp";
let __dirname = "./sprite-sheet/img/";
let imagesPaths = [__dirname + "img0.jpeg", __dirname + "img1.jpeg"]
let flattenedImagesPaths = [__dirname + "small_img0.jpeg", __dirname + "small_img1.jpeg"]

await reshapeImages(imagesPaths);
await createSprite(flattenedImagesPaths);

// For more see: materials/browser-based-models-with-tensorflow-js/W2/ungraded_lab/data.js

async function reshapeImages(imagePaths) {
    for (let i = 0; i < 2; i++) {
        await reshapeImageToVector(imagePaths[i], "img" + i + ".jpeg", 300*168, 1);
    }
}

function reshapeImageToVector(path, imgName, dim_1, dim_2) {
    return new Promise((resolve, reject) => {
        Jimp.read(path)
            .then(img => {
                resolve(img
                    .resize(dim_1, dim_2)
                    .grayscale()
                    .write(__dirname + 'small_' + imgName));
            })
            .catch(err => {
                console.error(err);
            });
    });
}

function createSprite(flattenedImagesPaths) {
    return new Promise((resolve, reject) => {
        // Generate our spritesheet
        let spritesmith = new Spritesmith();
        spritesmith.createImages(flattenedImagesPaths, function handleImages (err, images) {
            // If there was an error, throw it
            if (err) {
                throw err;
            }
            // Create our result
            let result = spritesmith.processImages(images);
            // and output the image
            result.image.pipe(fs.createWriteStream(__dirname + 'sprite.png'));
            resolve();
        });
    });
}