import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { ListItem, Overlay } from '@rneui/themed';
import { Icon } from '@rneui/base';
import React, { useState, useEffect } from 'react';
import AsyncStorageUtils from '../storage/AsyncStorageUtils';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phoneNumber: '', address: '' });
  const [editingIndex, setEditingIndex] = useState(-1);


  useEffect(() => {
    loadClients();
  }, []);

  // Load clients from AsyncStorage
  const loadClients = async () => {
    const storedClients = await AsyncStorageUtils.obtenerData('clients');
    if (storedClients) {
      setClients(storedClients);
    }
  };

  // Save clients to AsyncStorage
  const saveClients = async (updatedClients) => {
    await AsyncStorageUtils.guardarData('clients', updatedClients);
  };

  // Update the newClient state object with the input changes
  const handleInputChange = (text, field) => {
    setNewClient({ ...newClient, [field]: text });
  };

  // Handles the submission of the form and updates the list of clients accordingly
  const handleSubmit = () => {
    if (newClient.name === '') {
      Alert.alert('El nombre es obligatorio');
      return;
    }

    let updatedClients;

    if (editingIndex !== -1) {
      // Editing an existing client
      updatedClients = clients.map((client, index) => {
        if (index === editingIndex) {
          return newClient;
        } else {
          return client;
        }
      });
    } else {
      // Adding a new client
      updatedClients = [...clients, newClient];
    }

    setClients(updatedClients);
    saveClients(updatedClients);

    setModalVisible(false);
    setNewClient({ name: '', phoneNumber: '', address: '' });
    setEditingIndex(-1);
  };


  // Delete client 
  const handleDelete = (index) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Deseas eliminar a ' + clients[index].name + '?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedClients = clients.filter((_, i) => i !== index);
            setClients(updatedClients);
            saveClients(updatedClients);
          },
        },
      ]
    );
  };

  // Edit client
  const handleEdit = (index) => {
    const clientToEdit = clients[index];
    setNewClient(clientToEdit);
    setEditingIndex(index);
    setModalVisible(true);
  };

  // Toggle the visibility of the modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Render ClientList
  const renderClientList = () => {
    if (clients.length === 0) {
      return (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          La lista de clientes está vacía...
        </Text>
      );
    }

    return clients.map((client, index) => (
      <ListItem.Swipeable
        key={index}
        leftContent={(reset) => (
          <TouchableOpacity
            onPress={() => { handleEdit(index); reset(); }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'lightblue',
              justifyContent: 'center',
              minHeight: '100%',
            }}
          >
            <Icon name="user-edit" type="font-awesome-5" size={18} color="white" />
            <Text style={{ color: 'white', marginLeft: 10 }}>Editar</Text>
          </TouchableOpacity>
        )}
        rightContent={(reset) => (
          <TouchableOpacity
            onPress={() => { handleDelete(index); reset(); }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F15A59',
              justifyContent: 'center',
              minHeight: '100%',
            }}
          >
            <Icon name="trash" type="entypo" size={20} color="white" />
            <Text style={{ color: 'white', marginLeft: 10 }}>Eliminar</Text>
          </TouchableOpacity>
        )}
      >
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, }}>{client.name}</ListItem.Title>
          {client.phoneNumber && (<Text style={styles.clientInfo}>Número de teléfono: {client.phoneNumber}</Text>)}
          {client.address && (<Text style={styles.clientInfo}>Dirección: {client.address}</Text>)}
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem.Swipeable>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {renderClientList()}
        <StatusBar style="auto" />
      </ScrollView>
      <TouchableOpacity onPress={toggleModal} style={styles.addClientStyle}>
        <Icon name="person-add" type="ionicons" size={25} color="white" />
      </TouchableOpacity>

      {/* Overlay para agregar nuevo cliente */}
      <Overlay isVisible={isModalVisible} onBackdropPress={toggleModal} overlayStyle={styles.editContainerOverlay}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Agregar nuevo cliente</Text>
            <TouchableOpacity
              onPress={toggleModal}
              style={{ marginLeft: 'auto', marginBottom: 5 }}
            >
              <Icon name="close" style={'ionicon'} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.editContainer}>
            <View style={styles.inputIcon}><Icon name="person-circle-outline" type='ionicon' size={24} color="white" /></View>
            <TextInput
              placeholder="Nombre"
              value={newClient.name}
              onChangeText={(text) => handleInputChange(text, 'name')}
              style={styles.input}
            />
          </View>
          <View style={styles.editContainer}>
            <View style={styles.inputIcon}><Icon name="phone" type='feather' size={24} color="white" /></View>
            <TextInput
              placeholder="Número de teléfono"
              value={newClient.phoneNumber}
              keyboardType='numeric'
              onChangeText={(text) => handleInputChange(text, 'phoneNumber')}
              style={styles.input}
            />
          </View>
          <View style={styles.editContainer}>
            <View style={styles.inputIcon}><Icon name="location-outline" type='ionicon' size={24} color="white" /></View>
            <TextInput
              placeholder="Dirección"
              value={newClient.address}
              onChangeText={(text) => handleInputChange(text, 'address')}
              style={styles.input}
            />
          </View>
          <View style={{ alignItems: 'center', marginTop: 5 }}>
            <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
              <Text style={{ color: "#917FB3", fontSize: 15, }}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>

    </View>
  );
};

const styles = StyleSheet.create({
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
  addButton: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    alignItems: 'center',
    width: "50%",
  },
  clientInfo: {
    fontSize: 12,
    color: 'gray',
  },
  editContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 10,
  },
  editContainerOverlay: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  input: {
    fontSize: 16,
    backgroundColor: "white",
    padding: 9,
    paddingLeft: 12,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    color: "#3A3A3A",
    borderColor: 'lightgray',
    borderWidth: 0.5,
    width: "80%",
  },
  inputIcon: {
    backgroundColor: "#C4B0FF",
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },
});