import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, ListItem, Overlay } from '@rneui/themed';
import AsyncStorageUtils from '../storage/AsyncStorageUtils';

const Tab = createBottomTabNavigator();

// Screens.
import Clients from './Clientes';
import RawMaterial from './Materia_Prima';

const Route = () => {
    const [auxRouteClients, setAuxRouteClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadSelectedClientsFromStorage();
        loadAuxClientsFromStorage();
    }, []);

    useEffect(() => {
        saveSelectedClientsToStorage(selectedClients);
    }, [selectedClients]);

    const loadSelectedClientsFromStorage = async () => {
        const storedSelectedClients = await AsyncStorageUtils.obtenerData('selectedClients');
        if (storedSelectedClients) {
            setSelectedClients(storedSelectedClients);
        }
    };

    const loadAuxClientsFromStorage = async () => {
        const storedAuxClients = await AsyncStorageUtils.obtenerData('auxClients');
        const storedClients = await AsyncStorageUtils.obtenerData('clients');
        if (storedAuxClients.length !== 0 || storedAuxClients.length > 0) {
            setAuxRouteClients(storedAuxClients);
        } else if (storedClients.length === 0) {
            if (storedClients) {
                const updatedClients = storedClients.map((client) => ({
                    cliente: client.name,
                }));
                setAuxRouteClients(updatedClients);
                saveAuxClients(updatedClients);
            }
        }
    };

    const updateAuxClientFromClients = async () => {
        await AsyncStorageUtils.guardarData('auxClients', []);
        const storedClients = await AsyncStorageUtils.obtenerData('clients');
        if (storedClients) {
            const updatedClients = storedClients.map((client) => ({
                cliente: client.name,
                numero: client.phoneNumber,
            }));
            setAuxRouteClients(updatedClients);
            saveAuxClients(updatedClients);
        }
    };

    const saveSelectedClientsToStorage = async (updatedSelectedClients) => {
        await AsyncStorageUtils.guardarData('selectedClients', updatedSelectedClients);
    };

    const addClientToRoute = (client) => {
        const updatedClient = {
            cliente: client.cliente,
            cantidad: 0,
            devoluciones: 0,
            total: 0,
        };
        const updatedSelectedClients = [...selectedClients, updatedClient];
        setSelectedClients(updatedSelectedClients);
        const filteredAuxRouteClients = auxRouteClients.filter((c) => c.cliente !== client.cliente);
        setAuxRouteClients(filteredAuxRouteClients);
        saveSelectedClientsToStorage(updatedSelectedClients);
        saveAuxClients(filteredAuxRouteClients);
    };

    const removeClientFromRoute = (client) => {
        const updatedClient = {
            cliente: client.cliente,
            cantidad: 0,
            devoluciones: 0,
            total: 0,
        };
        const filteredAuxRouteClients = auxRouteClients.filter((c) => c.cliente !== client.cliente);
        setAuxRouteClients([...filteredAuxRouteClients, updatedClient]);
        saveAuxClients([...filteredAuxRouteClients, updatedClient]);
        setSelectedClients((prevRouteClients) => prevRouteClients.filter((c) => c.cliente !== client.cliente));
        const updatedSelectedClients = selectedClients.filter((c) => c.cliente !== client.cliente);
        saveSelectedClientsToStorage(updatedSelectedClients);
    };

    const toggleModal = () => {
        setModalVisible((prevState) => !prevState);
    };

    const saveAuxClients = useCallback(async (data) => {
        await AsyncStorageUtils.guardarData('auxClients', data);
    }, []);

    const handleInputChange = useCallback((value, index, field) => {
        setSelectedClients((prevSelectedClients) => {
            const updatedClients = [...prevSelectedClients];
            updatedClients[index][field] = value;
            return updatedClients;
        });
    }, []);

    const renderItem = useCallback(() => {
        return selectedClients.map((client, index) => (
            <ListItem.Swipeable
                key={client.cliente} // Use a unique key here
                rightContent={(reset) => (
                    <TouchableOpacity onPress={() => { removeClientFromRoute(client); reset(); }} style={styles.rightContentStyle}>
                        <Icon name="trash" type="entypo" size={20} color="white" />
                        <Text style={{ color: 'white', marginLeft: 10 }}>Eliminar</Text>
                    </TouchableOpacity>
                )}
                containerStyle={{ paddingHorizontal: 0 }}
            >
                <ListItem.Content style={styles.row}>
                    <ListItem.Title style={styles.column}>{client.cliente}</ListItem.Title>
                    <TextInput
                        style={styles.column}
                        value={client.cantidad.toString()}
                        onChangeText={(value) => handleInputChange(value, index, 'cantidad')}
                    />
                    <TextInput
                        style={styles.column}
                        value={client.devoluciones.toString()}
                        onChangeText={(value) => handleInputChange(value, index, 'devoluciones')}
                    />
                    <Text style={styles.column}>$ {client.total}</Text>
                </ListItem.Content>
            </ListItem.Swipeable>
        ));
    }, [selectedClients]);

    const renderClientsList = useCallback(() => {
        return (
            <Overlay isVisible={isModalVisible} onBackdropPress={toggleModal} overlayStyle={styles.overlay}>
                <View style={[styles.header, { borderBottomColor: 'lightgray', borderBottomWidth: 1 }]}>
                    <Text style={styles.headerText}> Clientes disponibles </Text>
                </View>
                {auxRouteClients.length > 0 ? (
                    <FlatList
                        data={auxRouteClients}
                        keyExtractor={(client) => client.cliente} // Use a unique key here
                        renderItem={({ item: client }) => (
                            <TouchableOpacity style={{ padding: 8 }} onPress={() => { addClientToRoute(client); }}>
                                <ListItem.Title>{client.cliente}</ListItem.Title>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>
                            La lista de clientes está vacía...
                        </Text>
                    </View>
                )}
            </Overlay>
        );
    }, [isModalVisible, auxRouteClients]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {renderClientsList()}
                {selectedClients.length > 0 && (
                    <View style={{ backgroundColor: 'white', flex: 1, paddingBottom: 6 }}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Cliente</Text>
                            <Text style={styles.headerText}>Cantidad</Text>
                            <Text style={styles.headerText}>Devoluciones</Text>
                            <Text style={styles.headerText}>Total</Text>
                        </View>
                        <FlatList
                            data={selectedClients}
                            keyExtractor={(client) => client.cliente}
                            renderItem={({ item: client, index }) => (
                                <ListItem.Swipeable
                                    key={client.cliente}
                                    rightContent={(reset) => (
                                        <TouchableOpacity onPress={() => { removeClientFromRoute(client); reset(); }} style={styles.rightContentStyle}>
                                            <Icon name="trash" type="entypo" size={20} color="white" />
                                            <Text style={{ color: 'white', marginLeft: 10 }}>Eliminar</Text>
                                        </TouchableOpacity>
                                    )}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                >
                                    <ListItem.Content style={styles.row}>
                                        <ListItem.Title style={styles.column}>{client.cliente}</ListItem.Title>
                                        <TextInput
                                            keyboardType="numeric"
                                            style={styles.column}
                                            value={client.cantidad.toString()}
                                            onChangeText={(value) => handleInputChange(value, index, 'cantidad')}
                                        />
                                        <TextInput
                                            keyboardType="numeric"
                                            style={styles.column}
                                            value={client.devoluciones.toString()}
                                            onChangeText={(value) => handleInputChange(value, index, 'devoluciones')}
                                        />
                                        <Text style={styles.column}>$ {client.total}</Text>
                                    </ListItem.Content>
                                </ListItem.Swipeable>
                            )}
                        />
                    </View>
                )}
                <StatusBar style="auto" />
            </View>
            <TouchableOpacity style={styles.menuButton}>
                <Icon name="playlist-plus" type="material-community" size={25} color="white" />
            </TouchableOpacity>
            {(auxRouteClients.length > 0 || selectedClients.length === 0) && (
                <TouchableOpacity onPress={toggleModal} style={styles.addClientStyle}>
                    <Icon name="person-add" type="ionicons" size={30} color="white" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    overlay: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        width: '45%',
        height: '50%',
        position: 'absolute',
        right: 10,
        top: '25%',
    },
    header: {
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 5,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    column: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },
    rightContentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F15A59',
        justifyContent: 'center',
        minHeight: '100%',
        borderRadius: 2,
    },
    accordionList: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '45%',
    },
    addClientStyle: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 25,
        width: 50,
        height: 50,
        backgroundColor: '#FF7777',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButton: {
        position: 'absolute',
        bottom: 20,
        right: 25,
        borderRadius: 20,
        width: 40,
        height: 40,
        backgroundColor: '#FF7777',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
    },
});

export default function RouteAsHome() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#FF4646',
                tabBarLabelStyle: {
                    display: 'none',
                },
            }}
        >
            <Tab.Group >
                <Tab.Screen
                    name="Ruta"
                    component={Route}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="directions" type='simple-line-icon' color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Inventario"
                    component={RawMaterial}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="kitchen" type='materialIcons' color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Clientes"
                    component={Clients}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="people" type='octicon' color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Group>
        </Tab.Navigator>
    );
}