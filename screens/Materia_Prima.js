import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Icon, ListItem, Overlay, ButtonGroup } from '@rneui/base';
import AsyncStorageUtils from '../storage/AsyncStorageUtils';

export default function RawMaterial() {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [amount, setAmount] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState({});
  const [iconInput, setIconInput] = useState({});
  const [isUpdatingIngredient, setIsUpdatingIngredient] = useState(false);


  useEffect(() => {
    loadStock();
  }, []);

  // Load stock from AsyncStorage
  const loadStock = async () => {
    const storedStock = await AsyncStorageUtils.obtenerData('stock');
    if (storedStock) {
      setStockData(storedStock);
    } else { // If there is no stock...
      const initialIngredients =
        [{ name: 'Leche', amount: 0, unit: '', },
        { name: 'Vainilla', amount: 0, unit: '' },
        { name: 'Azucar', amount: 0, unit: '' },
        { name: 'Grenetina', amount: 0, unit: '' }]

      await AsyncStorageUtils.guardarData('stock', initialIngredients);
    }
  };

  // Save stock to AsyncStorage
  const saveStock = async (stock) => {
    await AsyncStorageUtils.guardarData('stock', stock);
  };

  const clearValuesForUpdatingStock = () => {
    setIsUpdatingIngredient(!isUpdatingIngredient);
    setSelectedIndex(-1);
    setAmount(0);
    setSelectedUnit('');
  };

  // Update stock
  const handleUpdateStock = () => {
    if (selectedUnit === '') { Alert.alert('Por favor, seleccione la unidad para el ingrediente ' + selectedIngredient.name); return; }

    selectedIngredient.unit === '' ? selectedIngredient.unit = selectedUnit : null;
    // Update quantity regardless of the unit
    if (selectedIngredient.unit === selectedUnit) {
      selectedIngredient.amount += parseFloat(amount);
    } else if (selectedIngredient.unit === 'Litros' || selectedIngredient.unit === 'Kilos') {
      selectedIngredient.amount += parseFloat((amount / 1000));
    } else {
      selectedIngredient.amount += parseFloat((amount * 1000));
    }

    if (!(selectedIngredient.unit === 'Litros' || selectedIngredient.unit === 'Kilos') && selectedIngredient.amount >= 1000) {
      selectedIngredient.amount = parseFloat(selectedIngredient.amount / 1000);
      selectedIngredient.unit = selectedIngredient.unit === 'Mililitros' ? 'Litros' : 'Kilos';
    } else if ((selectedIngredient.unit === 'Litros' || selectedIngredient.unit === 'Kilos') && selectedIngredient.amount < 1) {
      selectedIngredient.amount = parseFloat(selectedIngredient.amount * 1000);
      selectedIngredient.unit = selectedIngredient.unit === 'Litros' ? 'Mililitros' : 'Gramos';
    }

    setStockData(prevStockData => {
      const updatedStockData = [...prevStockData];
      const selectedIndexUpdate = updatedStockData.findIndex(item => item.name === selectedIngredient.name);

      if (selectedIndexUpdate !== -1) {
        updatedStockData[selectedIndexUpdate] = selectedIngredient;
      } else {
        updatedStockData.push(selectedIngredient);
      }

      return updatedStockData;
    });

    saveStock(stockData);

    clearValuesForUpdatingStock();
  };

  // Set specific ingredient amount to 0
  const clearIngredient = () => {
    Alert.alert(
      '¿Reiniciar?',
      'La cantidad se reducirá a 0, ¿continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: () => {
            selectedIngredient.amount = 0;
            selectedIngredient.unit = '';

            setStockData(prevStockData => {
              const updatedStockData = [...prevStockData];
              const selectedIndexUpdate = updatedStockData.findIndex(item => item.name === selectedIngredient.name);

              if (selectedIndexUpdate !== -1) {
                updatedStockData[selectedIndexUpdate] = selectedIngredient;
              } else {
                updatedStockData.push(selectedIngredient);
              }

              return updatedStockData;
            });

            saveStock(stockData);

            clearValuesForUpdatingStock();
          },
        },
      ]
    );
  };

  const isEnough = (item) => {
    if (item.name === 'Azucar') {
      return (!(item.amount <= 3));
    } else if (item.name === 'Grenetina') {
      return (!(item.amount <= 1));
    } else if (item.name === 'Vainilla') {
      return (!(item.amount <= 100));
    } else { return true; }
  };

  const renderIngredientsList = () => {
    return (
      <View style={styles.itemListContainer}>
        {stockData.map((item, index) => (
          <ListItem.Swipeable
            key={index}
            rightContent={(reset) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedIngredient(item);
                  if (item.name === 'Leche') { setIconInput({ name: 'bottle-soda', type: 'material-community' }); setUnits(['Litros', 'Mililitros']); }
                  else if (item.name === 'Vainilla') { setIconInput({ name: 'bottle-tonic', type: 'material-community' }); setUnits(['Litros', 'Mililitros']); }
                  else if (item.name === 'Azucar') { setIconInput({ name: 'spoon-sugar', type: 'material-community' }); setUnits(['Kilos', 'Gramos']); }
                  else { setIconInput({ name: 'bowl-mix', type: 'material-community' }); setUnits(['Kilos', 'Gramos']); }
                  setIsUpdatingIngredient(!isUpdatingIngredient);
                  reset();
                }}
                style={styles.rightContentStyle}
              >
                <Icon name="shoppingcart" type="antdesign" size={25} color="white" />
                <Text style={{ color: 'white', marginLeft: 8, fontSize: 16, }}>Actualizar</Text>
              </TouchableOpacity>
            )}
            containerStyle={{ height: 120, }}
          >
            <ListItem.Content>
              <ListItem.Title style={{ fontSize: 28, }}>{isEnough(item) ? item.name : '¡' + item.name + ' requiere atención!'} </ListItem.Title>
              <Text style={{ fontSize: 16, color: 'gray', }}>En existencia: {item.amount} {item.unit}</Text>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem.Swipeable>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.shelf}>
        <View style={styles.shelfItems}>
          <Icon name='bottle-soda' type='material-community' size={120} color={'lightgray'} />
          <Icon name='bottle-soda' type='material-community' size={75} color={'#C38154'} />
        </View>
        <View style={styles.shelfBackground} />
      </View>
      <View style={styles.shelf}>
        <View style={styles.shelfItems}>
          <Icon name='bowl-mix' type='material-community' size={65} color={'#C38154'} />
          <Icon name='spoon-sugar' type='material-community' size={90} color={'lightgray'} />
        </View>
        <View style={styles.shelfBackground} />
      </View>
      <StatusBar style="auto" />
      {renderIngredientsList()}
      <Overlay isVisible={isUpdatingIngredient} onBackdropPress={clearValuesForUpdatingStock} overlayStyle={styles.editContainerOverlay}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{selectedIngredient.name} disponible: {selectedIngredient.amount} {selectedIngredient.unit}</Text>
            <TouchableOpacity
              onPress={clearValuesForUpdatingStock}
              style={{ marginLeft: 'auto', marginBottom: 5 }}
            >
              <Icon name="close" style={'ionicon'} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.editContainer}>
            <View style={styles.inputIcon}><Icon name={iconInput.name} type={iconInput.type} size={34} color="white" /></View>
            <TextInput
              keyboardType='numeric'
              placeholder="Cantidad"
              onChangeText={setAmount}
              style={styles.input}
            />
            <ButtonGroup
              buttons={units}
              vertical
              buttonStyle={styles.unitButtonStyle}
              textStyle={{ color: "#917FB3", fontSize: 14, }}
              selectedButtonStyle={styles.selectedUnitButton}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value);
                setSelectedUnit(units[value]);
              }}
              containerStyle={styles.unitButtons}
            />
          </View>
          <View style={{ alignItems: 'center', marginTop: 5 }}>
            <TouchableOpacity onPress={handleUpdateStock} style={styles.acceptButton}>
              <Text style={{ color: "#917FB3", fontSize: 15, }}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearIngredient} style={styles.clearButton}>
              <Text style={{ color: "#917FB3", fontSize: 10, }}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
  },
  shelf: {
    marginHorizontal: 50,
  },
  shelfBackground: {
    position: 'absolute',
    top: '90%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#7B5843',
    height: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.50,
    shadowRadius: 3.84,
    elevation: 20,
  },
  itemIngredientContainer: {
    padding: 10,
    backgroundColor: 'beige',
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    height: '50%',
    borderRadius: 5,
  },
  rightContentStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    minHeight: '100%',
    borderRadius: 2,
  },
  shelfItems: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginBottom: 5,
  },
  itemListContainer: {
    marginTop: 20,
  },
  item: {
    height: '28%',
  },
  editContainerOverlay: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    width: "90%",
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
    borderWidth: 1,
    width: "50%",
    height: '60%',
  },
  inputIcon: {
    backgroundColor: "#C4B0FF",
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderColor: 'lightgray',
  },
  editContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  unitButtons: {
    width: "30%",
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  unitButtonStyle: {
    backgroundColor: "#F2F2F2",
  },
  selectedUnitButton: {
    backgroundColor: '#917FB3',
  },
  acceptButton: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    alignItems: 'center',
    width: "50%",
    marginBottom: 5,
  },
  clearButton: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    alignItems: 'center',
    width: "25%",
    marginBottom: 5,
    marginTop: 5,
  },
});