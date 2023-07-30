import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Icon, Overlay } from '@rneui/base';
import AsyncStorageUtils from '../storage/AsyncStorageUtils';

const Clients = () => {
  // State variables
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddingButton, setShowAddingButton] = useState(true);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [longPressed, setLongPressed] = useState(false);

  // Load clients from AsyncStorage on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Toggle showModal overlay based on isEditingClient or isAddingClient state changes
  useEffect(() => {
    (isEditingClient || isAddingClient) ? setShowModal(true) : setShowModal(false);
  }, [isEditingClient, isAddingClient]);

  // Function to close the overlay and reset states related to editing and adding clients
  const toggleOverlay = () => {
    setIsAddingClient(false);
    setSelectedClient(null);
    setIsEditingClient(false);
    setShowAddingButton(true);
  };

  // Load clients from AsyncStorage
  const loadClients = async () => {
    const storedClients = await AsyncStorageUtils.obtenerData('clients');
    if (storedClients) {
      setClients(storedClients);
    }
  };

  // Function to save a client
  const saveClient = async () => {
    try {
      // Create a new client object with the provided name, phone, and address
      const newClient = { name, phone, address };

      // Check if the client name already exists in the list of clients
      const nameExists = clients.some(client => client.name === name);

      // If the name doesn't exist or it exists and we are editing the client, proceed
      if ((!nameExists) || (nameExists && isEditingClient)) {
        // Update the clients list by replacing the selected client with the new client,
        // or adding the new client to the end of the list if no client is selected
        const updatedClients = selectedClient !== null
          ? clients.map((client, index) => (index === selectedClient ? newClient : client))
          : [...clients, newClient];

        // Save the updated clients list to AsyncStorage
        await AsyncStorageUtils.guardarData('clients', updatedClients);

        // Update the state with the updated clients list
        setClients(updatedClients);
        setSelectedClient(null);
        setIsEditingClient(false);
      } else {
        // Show an alert if the name already exists in the client list
        Alert.alert(name + ' already exists in the list of clients.');

        // Clear the name field
        setName("");

        return; // Exit the function
      }

      // Clear the input fields and reset the state
      setName('');
      setPhone('');
      setAddress('');
      setLongPressed(false);
      setIsAddingClient(false);
      setShowAddingButton(true);
    } catch (error) {
      console.log('Error while saving the client:', error);
    }
  };

  // Function to delete a client
  const deleteClient = async (index) => {
    try {
      // Show a confirmation dialog before deleting the client
      Alert.alert(
        'Delete ' + name + '?',
        'Are you sure you want to delete ' + name + '?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                // Filter out the client at the specified index to delete it
                const updatedClients = clients.filter((_, i) => i !== index);

                // Save the updated clients list to AsyncStorage
                await AsyncStorageUtils.guardarData('clients', updatedClients);

                // Update the state with the updated clients list
                setClients(updatedClients);

                if (index === selectedClient) {
                  setSelectedClient(null);
                }

                console.log('Client deleted successfully');
                setLongPressed(false);
                setShowAddingButton(true);
              } catch (error) {
                console.log('Error while deleting the client:', error);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log('Error while deleting the client:', error);
    }
  };

  // Render a client item
  const renderClientItem = ({ item, index }) => {
    const isSelected = selectedClient === index;

    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectedClient(isSelected ? null : index);
          setName(item.name);
          setPhone(item.phone);
          setAddress(item.address);
          setLongPressed(true);
        }}
        style={styles.clientItemContainer}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.clientName, isSelected && styles.selectedClientName]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.clientDetailsContainer}>
          <Text style={styles.clientInfo}>Phone: {item.phone}</Text>
          <Text style={styles.clientInfo}>Address: {item.address}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return renderClientItem({ item, index });
        }}
      />
      {showAddingButton && (
        <TouchableOpacity
          onPress={() => {
            setName('');
            setPhone('');
            setAddress('');
            setSelectedClient(null);
            setIsAddingClient(true);
            setShowAddingButton(false);
          }}
          style={styles.addClientStyle}
        >
          <Icon name="person-add" type="ionicons" size={30} color="white" />
        </TouchableOpacity>
      )}
      <Overlay
        visible={longPressed}
        animationType="slide"
        onBackdropPress={() => { setLongPressed(false); }}
        overlayStyle={styles.selectedClientItemContainer}
      >
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.clientName}>{name}</Text>
            <TouchableOpacity onPress={() => { setLongPressed(false) }}>
              <Icon name="close" style={'ionicon'} size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.clientDetailsContainer}>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setIsEditingClient(!isEditingClient);
                  setShowAddingButton(false);
                }}
              >
                <Icon name="user-edit" type="font-awesome-5" size={20} color="#6495ED" />
                <Text style={{ marginLeft: 5 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteClient(selectedClient)} >
                <Icon name="trash" type="entypo" size={15} color="red" />
                <Text style={{ marginLeft: 2, fontSize: 10 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      </Overlay>
      <Overlay
        visible={showModal}
        animationType="slide"
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.editContainer}
      >
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {!isAddingClient && (
              <Text style={styles.editText}>
                Editing {name}
              </Text>
            )}
            <TouchableOpacity
              onPress={toggleOverlay}
              style={{ marginLeft: 'auto', marginBottom: 5 }}
            >
              <Icon name="close" style={'ionicon'} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.editContainerBottom}>
            <View style={styles.inputIcon}><Icon name="person-circle-outline" type='ionicon' size={24} color="white" /></View>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              style={styles.input}
            />
          </View>
          <View style={styles.editContainerBottom}>
            <View style={styles.inputIcon}><Icon name="phone" type='feather' size={25} color="white" /></View>
            <TextInput
              keyboardType="numeric"
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              style={styles.input}
            />
          </View>
          <View style={styles.editContainerBottom}>
            <View style={styles.inputIcon}><Icon name="location-outline" type='ionicon' size={24} color="white" /></View>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
              style={styles.input}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={saveClient} disabled={!name} color='#917FB3' />
          </View>
        </>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 15,
    overflow: 'hidden',
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
  container: {
    flex: 1,
    padding: 16,
  },
  clientItemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#8B008B',
  },
  selectedClientItemContainer: {
    backgroundColor: '#E6E6FA',
    borderColor: '#8B008B',
    borderWidth: 0.5,
    borderRadius: 8,
    width: '60%',
    padding: 15,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientDetailsContainer: {
    marginTop: 8,
  },
  clientInfo: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editContainerBottom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  editContainer: {
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
    padding: 6.5,
    paddingLeft: 12,
    width: "85%",
    height: "100%",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    color: "#3A3A3A",
    borderColor: 'lightgray',
    borderWidth: 0.5,
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
  editText: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6495ED',
    marginTop: 20,
    width: '50%',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#CC0033',
    width: '35%',
  },
});

export default Clients;