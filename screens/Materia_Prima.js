import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Icon, Tooltip, ListItem } from '@rneui/base';
import AsyncStorageUtils from '../storage/AsyncStorageUtils';

export default function RawMaterial() {
  const [milkInfo, setMilkInfo] = useState(false);
  const [vanillInfo, setVanillaInfo] = useState(false);
  const [sugarInfo, setSugarInfo] = useState(false);
  const [gelatinInfo, setGelatinInfo] = useState(false);
  const [stockData, setStockData] = useState([]);


  useEffect(() => {
    loadStock();
  }, []);

  // Load stock from AsyncStorage
  const loadStock = async () => {
    const storedStock = await AsyncStorageUtils.obtenerData('stock');
    if (storedStock) {
      setStockData(storedStock);
    } else {
      const initialIngredients =
        [{ name: 'Leche', amount: 0, unit: '' },
        { name: 'Vainilla', amount: 0, unit: '' },
        { name: 'Azucar', amount: 0, unit: '' },
        { name: 'Grenetina', amount: 0, unit: '' }]

      await AsyncStorageUtils.guardarData('stock', initialIngredients);
    }
  };

  const renderShelf = () => {
    return (
      <>
        <View style={styles.shelf}>
          <View style={styles.shelfBackground} />
          <Tooltip
            visible={milkInfo}
            onOpen={() => setMilkInfo(true)}
            onClose={() => setMilkInfo(false)}
            popover={<Text style={{ fontSize: 15 }}>Leche</Text>}
            pointerColor='beige'
            containerStyle={{ borderColor: 'gray', borderWidth: 1, backgroundColor: 'beige', }}
          >
            <View style={styles.rowShelf}>
              <Icon name='bottle-soda' type='material-community' size={130} color={'lightgray'} />
            </View>
          </Tooltip>
          <Tooltip
            visible={vanillInfo}
            onOpen={() => setVanillaInfo(true)}
            onClose={() => setVanillaInfo(false)}
            popover={<Text style={{ fontSize: 15 }}>Vainilla</Text>}
            pointerColor='beige'
            containerStyle={{ borderColor: 'gray', borderWidth: 1, backgroundColor: 'beige', }}
          >
            <View style={styles.rowShelf}>
              <Icon name='prescription-bottle' type='font-awesome-5' size={50} color={'#C38154'} />
            </View>
          </Tooltip>
        </View>
        <View style={styles.shelf}>
          <View style={styles.shelfBackground} />
          <Tooltip
            visible={gelatinInfo}
            onOpen={() => setGelatinInfo(true)}
            onClose={() => setGelatinInfo(false)}
            popover={<Text style={{ fontSize: 15 }}>Grenetina</Text>}
            pointerColor='beige'
            containerStyle={{ borderColor: 'gray', borderWidth: 1, backgroundColor: 'beige', }}
          >
            <View style={styles.rowShelf}>
              <Icon name='bowl-mix' type='material-community' size={60} color={'#C38154'} />
            </View>
          </Tooltip>
          <Tooltip
            visible={sugarInfo}
            onOpen={() => setSugarInfo(true)}
            onClose={() => setSugarInfo(false)}
            popover={<Text style={{ fontSize: 15 }}>Azucar</Text>}
            pointerColor='beige'
            containerStyle={{ borderColor: 'gray', borderWidth: 1, backgroundColor: 'beige', }}
          >
            <View style={styles.rowShelf}>
              <Icon name='spoon-sugar' type='material-community' size={90} color={'lightgray'} />
            </View>
          </Tooltip>
        </View>
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {renderShelf()}
      </View>
      <View style={{ flex: 1, }}>
        {stockData.map((item, index) => (
          <ListItem.Swipeable
            key={index}
            rightContent={(reset) => (
              <TouchableOpacity onPress={() => { reset(); }} style={styles.rightContentStyle}>
                <Icon name="system-update-alt" type="material" size={25} color="white" />
                <Text style={{ color: 'white', marginLeft: 10, fontSize: 16, }}>Actualizar</Text>
              </TouchableOpacity>
            )}
          >
            <ListItem.Content>
              <ListItem.Title style={{ fontSize: 28, }}>{item.name}</ListItem.Title>
              <Text style={{ fontSize: 16, color: 'gray', }}>En existencia: {item.amount} {item.unit}</Text>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem.Swipeable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shelf: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 50,
  },
  shelfBackground: {
    position: 'absolute',
    top: '92%',
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
  rowShelf: {
    paddingHorizontal: 20,
    marginBottom: 4,
    marginRight: 10,
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
  item: {
    height: '28%',
  },
});