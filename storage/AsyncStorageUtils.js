import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageUtils = {
    guardarData: async (key, data) => {
        try {
            const dataJSON = JSON.stringify(data);
            await AsyncStorage.setItem(key, dataJSON);
        } catch (error) {
            console.log(error);
        }
    },

    obtenerData: async (key) => {
        try {
            const dataJSON = await AsyncStorage.getItem(key);
            if (dataJSON !== null) {
                return JSON.parse(dataJSON);
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    },
    
    borrarData: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`Se ha borrado "${key}" del AsyncStorage correctamente.`);
        } catch (error) {
            console.error(`Error al borrar "${key}" del AsyncStorage:`, error);
        }
    },
};

export default AsyncStorageUtils;