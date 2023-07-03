import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';

// Navigation stuff------------------------

const Tab = createBottomTabNavigator();

// Screens.
import Clients from './Clientes'
import RawMaterial from './Materia_Prima';

//-----------------------------------------

const Route = () => {
    return (
        <View style={styles.container}>
            <Text>Ruta</Text>
            <StatusBar style="auto" />
        </View>
    );
}

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
                        headerRight: () => (
                            <TouchableOpacity style={{marginTop: 5, width: '25%',}}>
                                <Icon name='three-bars' type='octicon' color={'gray'} size={22} />
                            </TouchableOpacity>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});