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
};

export default AsyncStorageUtils;