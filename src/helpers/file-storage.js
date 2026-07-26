import fs from 'fs';
import path from 'path';


// Helper/Utilidad para gestionar la eliminación segura de archivos locales cuando un usuario actualice su foto o sea eliminado
const deleteOldImage = async (imagePath) => {
    // Si la imagen es la por defecto o no existe ruta, no eliminar nada
    if (!imagePath || imagePath.includes('default-avatar.png')) {
        return;
    }

    try {
        // Se construye la ruta completa de la imagen
        const fullPath = path.join(process.cwd(), 'public', imagePath);
        // Si la imagen existe, se elimina
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
    } catch (error) {
        console.error('Error al eliminar la imagen previa:', error);
    }
};

const deleteMultipleImages = async (imagePaths = []) => {
    for (const imagePath of imagePaths) {
        await deleteOldImage(imagePath);
    }
};


export { deleteOldImage, deleteMultipleImages };