import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, ListItem } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import AsyncStorageUtils from '../storage/AsyncStorageUtils';

// Navigation stuff------------------------

const Tab = createBottomTabNavigator();

// Screens.
import Clients from './Clientes'
import RawMaterial from './Materia_Prima';

//-----------------------------------------

const Route = () => {
    const [routeClients, setRouteClients] = useState([]);
    const [showList, setShowList] = useState(false);

    // Load clients from AsyncStorage
    const loadClientsFromClients = async () => {
        const storedClients = await AsyncStorageUtils.obtenerData('clients');
        if (storedClients) {
            const updatedClients = storedClients.map((client) => ({
                cliente: client.name,
                cantidadGelatinas: 0,
                devoluciones: 0,
                total: 0,
            }));
            setRouteClients(updatedClients);
            setShowList(!showList);
        }
    };

    const renderItem = () => {
        return routeClients.map((client, index) => (
            <ListItem.Swipeable
                key={index}
                rightContent={(reset) => (
                    <TouchableOpacity onPress={() => { reset(); }} style={styles.rightContentStyle}>
                        <Icon name="trash" type="entypo" size={20} color="white" />
                        <Text style={{ color: 'white', marginLeft: 10 }}>Eliminar</Text>
                    </TouchableOpacity>
                )}
                containerStyle={{paddingHorizontal: 0,}}
            >
                <ListItem.Content style={styles.row}>
                    <ListItem.Title style={styles.column}>{client.cliente}</ListItem.Title>
                    <Text style={styles.column}>{client.cantidadGelatinas}</Text>
                    <Text style={styles.column}>{client.devoluciones}</Text>
                    <Text style={styles.column}>{client.total}</Text>
                </ListItem.Content>

            </ListItem.Swipeable>
        ));
    };

    return (
        <View style={styles.container}>
            {showList && (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Cliente</Text>
                        <Text style={styles.headerText}>Cantidad</Text>
                        <Text style={styles.headerText}>Devoluciones</Text>
                        <Text style={styles.headerText}>Total</Text>
                    </View>
                    {renderItem()}
                </>
            )}
            <TouchableOpacity onPress={loadClientsFromClients}>
                <Text> Ver lista </Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
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
                        /*headerRight: () => (
                            <TouchableOpacity style={{marginTop: 5, width: '25%',}}>
                                <Icon name='three-bars' type='octicon' color={'gray'} size={22} />
                            </TouchableOpacity>
                        ),*/
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